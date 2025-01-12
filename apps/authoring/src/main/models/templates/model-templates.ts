import { Model } from '../model.types';
import {
  TemplateEvents,
  TemplateRecords,
  TemplateManifest,
} from './model-templates.types';
import {
  FileSystem as fs,
  InternalStorage as IS,
  Requester,
  Logger,
  Templater,
} from '../../services';
import * as table from './model-templates-schema';
import { requester } from '../../../renderer/services';

export const templateFolderPath = fs.join(fs.pathSaveFolder, 'templates');
export const templateWorkingPath = fs.join(fs.pathTempFolder, 'templates');
export const templateAssetPath = fs.getAssetPath(fs.join('assets'));

export const install = () => {
  return new Promise<Requester.ApiResult>(resolve => {
    try {
      const dialogOptions = {
        title: 'Scrowl - Import Template',
        showHiddenFiles: false,
        filters: [
          {
            name: 'Archive',
            extensions: ['zip'],
          },
        ],
      };
      fs.dialogOpen(dialogOptions).then(openRes => {
        if (openRes.error) {
          const openError = {
            error: true,
            message: openRes.message,
            data: openRes.data,
          };
          Logger.error(openError);
          resolve(openError);
          return;
        }

        if (openRes.data.canceled) {
          resolve({
            error: false,
            data: {
              canceled: true,
            },
          });
          return;
        }

        const source = openRes.data.filePaths[0];
        const filename = fs.basename(source, '.zip');
        const dest = fs.join(templateFolderPath, filename);

        fs.unarchive(source, dest).then(archiveRes => {
          if (archiveRes.error) {
            const archiveError = {
              error: true,
              message: archiveRes.message,
              data: archiveRes.data,
            };
            Logger.error(archiveError);
            resolve(archiveError);
            return;
          }

          resolve({
            error: false,
            data: {
              canceled: false,
              source,
              dest,
            },
          });
        });
      });
    } catch (e) {
      const addError = {
        error: true,
        message: 'Failed to add template',
        data: {
          trace: e,
        },
      };
      Logger.error(addError);
      resolve(addError);
    }
  });
};

export const list = () => {
  const isDir = (file: fs.Dirent) => {
    return file.isDirectory();
  };

  const templateRecord = (file: fs.Dirent, pathname: string) => {
    return new Promise<requester.ApiResult>(resolve => {
      try {
        const source = fs.join(pathname, file.name, 'manifest.json');

        fs.readFile(source).then(readRes => {
          if (readRes.error) {
            Logger.error(readRes);
            resolve(readRes);
            return;
          }

          resolve({
            error: false,
            data: {
              name: file.name,
              source,
              manifest: readRes.data.contents,
            },
          });
        });
      } catch (e) {
        const listError = {
          error: true,
          message: 'Failed to get template info',
          data: {
            trace: e,
          },
        };
        Logger.error(listError);
        resolve(listError);
      }
    });
  };
  const getTemplateRecords = (pathname: string) => {
    return new Promise<Requester.ApiResult>(resolve => {
      try {
        fs.readDir(pathname).then(readRes => {
          if (readRes.error) {
            Logger.warn(readRes);
            resolve(readRes);
            return;
          }

          const templateList = readRes.data.files
            .filter(isDir)
            .map((file: fs.Dirent) => {
              return templateRecord(file, pathname);
            });

          Promise.allSettled(templateList).then(listRes => {
            const templates: TemplateRecords = [];

            listRes.forEach(res => {
              if (res.status === 'rejected') {
                Logger.error('Failed to get template record', res);
                return;
              }

              if (res.value.error) {
                Logger.warn('Unable to get template record', res);
                return;
              }

              templates.push(res.value.data);
            });

            resolve({
              error: false,
              data: {
                templates,
              },
            });
          });
        });
      } catch (e) {
        const msg = `Failed to list templates: ${pathname}`;

        Logger.error(msg, e);
        resolve({
          error: true,
          message: msg,
          data: {
            trace: e,
          },
        });
      }
    });
  };

  return new Promise<Requester.ApiResult>(resolve => {
    try {
      const recordPromises = [
        getTemplateRecords(templateFolderPath),
        getTemplateRecords(templateAssetPath),
      ];

      Promise.allSettled(recordPromises).then(resPromises => {
        let templates: TemplateRecords = [];

        resPromises.forEach(res => {
          if (res.status === 'rejected') {
            const rejectedMsg = 'Failed to get template record';
            console.error(rejectedMsg, res);
            Logger.info(rejectedMsg, res);
            return;
          }

          if (res.value.error) {
            const recordErrorMsg = 'Unable to get template record';
            console.warn(recordErrorMsg, res);
            Logger.error(recordErrorMsg, res);
            return;
          }

          templates = templates.concat(
            res.value.data.templates.map(
              (record: {
                name: string;
                source: string;
                manifest: TemplateManifest;
              }) => record.manifest
            )
          );
        });

        resolve({
          error: false,
          data: {
            templates,
          },
        });
      });
    } catch (e) {
      Logger.error('Failed to list templates', e);
      resolve({
        error: true,
        message: 'Failed to list templates',
        data: {
          trace: e,
        },
      });
    }
  });
};

export const load = (
  ev: Requester.RequestEvent,
  manifest: TemplateManifest
) => {
  const templateBase = `template-${manifest.meta.filename}`;
  const copyTemplateComponent = () => {
    return new Promise<Requester.ApiResult>(resolve => {
      const templateFolder = fs.join(templateAssetPath, templateBase);
      const dest = fs.join(templateWorkingPath, 'src');

      fs.existsFile(templateFolder)
        .then(existRes => {
          if (existRes.error) {
            Logger.error(existRes);
            resolve(existRes);
            return;
          }

          if (!existRes.data.exists) {
            const existError: Requester.ApiResultError = {
              error: true,
              message: 'unable to load template: template does not exist',
            };
            Logger.error(existError);
            resolve(existError);
            return;
          }

          fs.copy(templateFolder, dest)
            .then(resolve)
            .catch(e => {
              const copyError = {
                error: true,
                message: 'failed to copy template',
                data: {
                  trace: e,
                },
              };
              Logger.error(copyError);
              resolve(copyError);
            });
        })
        .catch(e => {
          const loadError = {
            error: true,
            message: 'failed to copy template',
            data: {
              trace: e,
            },
          };
          Logger.error(loadError);
          resolve(loadError);
        });
    });
  };
  const compileCanvas = (
    filename: string,
    data: { [key: string]: string | { [key: string]: string } },
    dest: string
  ) => {
    return new Promise<Requester.ApiResult>(resolve => {
      try {
        fs.readFile(filename).then(readRes => {
          if (readRes.error) {
            Logger.error(readRes);
            resolve(readRes);
            return;
          }

          const compileRes = Templater.compile(readRes.data.contents, data);

          if (compileRes.error) {
            Logger.error(compileRes);
            resolve(compileRes);
            return;
          }

          fs.writeFileTemp(dest, compileRes.data.contents).then(resolve);
        });
      } catch (e) {
        const compileError = {
          error: true,
          message: 'Failed to compile canvas',
          data: {
            trace: e,
          },
        };
        Logger.error(compileError);
        resolve(compileError);
      }
    });
  };

  return new Promise<Requester.ApiResult>(resolve => {
    try {
      if (!manifest) {
        const missingDataError: Requester.ApiResultError = {
          error: true,
          message: `Unable to load template: template required`,
        };
        Logger.error(missingDataError);
        resolve(missingDataError);
        return;
      }
      const ver = new Date().valueOf();
      const filenameShimReact = 'shim-react.js';
      const filenameShimReactDom = 'shim-react-dom.js';
      const filenameShimReactBootstrap = 'shim-react-bootstrap.js';
      const filenameReactJsx = 'react-jsx-runtime.development.js';
      const filenameOwlui = 'owl.lib.module.js';
      const workspaceSource = fs.join(templateAssetPath, 'workspace');
      const workspaceDest = fs.join(templateWorkingPath, 'src');
      const workspaceOpts = {
        overwrite: true,
        filter: (source: string) => {
          return source.indexOf('.hbs') === -1;
        },
      };
      const canvasHtmlSource = fs.join(workspaceSource, 'canvas.html.hbs');
      const canvasHtmlDest = fs.join('templates', 'src', 'canvas.html');
      const canvasScriptSource = fs.join(workspaceSource, 'canvas.js.hbs');
      const canvasScriptDest = fs.join('templates', 'src', `canvas.${ver}.js`);
      const data = {
        canvasJs: `./canvas.${ver}.js`,
        templateJs: `./${templateBase}.js?${ver}`,
        templateCss: `./${templateBase}.css?${ver}`,
        templateComponent: manifest.meta.component,
        manifest: JSON.stringify(manifest),
        importList: JSON.stringify({
          react: `./${filenameShimReact}`,
          'react-dom': `./${filenameShimReactDom}`,
          'react/jsx-runtime': `./${filenameReactJsx}`,
          'react-bootstrap': `./${filenameShimReactBootstrap}`,
          '@owlui/lib': `./${filenameOwlui}`,
        }),
      };
      const canvasRendering = [
        fs.copy(workspaceSource, workspaceDest, workspaceOpts),
        copyTemplateComponent(),
        compileCanvas(canvasHtmlSource, data, canvasHtmlDest),
        compileCanvas(canvasScriptSource, data, canvasScriptDest),
      ];

      Promise.allSettled(canvasRendering).then(renderingRes => {
        let isRendered = true;

        for (let i = 0, ii = renderingRes.length; i < ii; i++) {
          if (renderingRes[i].status === 'rejected') {
            isRendered = false;
            Logger.error('Failed to render canvas');
            break;
          }
        }

        if (!isRendered) {
          const renderError: Requester.ApiResultError = {
            error: true,
            message: 'Failed to render canvas',
          };
          Logger.error(renderError);
          resolve(renderError);
          return;
        }

        resolve({
          error: false,
          data: {
            url: `${Requester.templateServerUrl}/canvas.html?ver=${ver}`,
          },
        });
      });
    } catch (e) {
      const loadError = {
        error: true,
        message: 'Failed to load template',
        data: {
          trace: e,
        },
      };
      Logger.error(loadError);
      resolve(loadError);
    }
  });
};

export const add = (
  ev: Requester.RequestEvent | undefined,
  templateName: string,
  projectId: string | number,
  dest: 'save' | 'temp' = 'temp'
) => {
  const templatePath = `template-${templateName}`;
  const getDestFolderPath = (start: string) => {
    return fs.join(start, projectId.toString(), 'templates', templatePath);
  };
  return new Promise<Requester.ApiResult>(resolve => {
    try {
      if (!templateName) {
        const missingDataError: Requester.ApiResultError = {
          error: true,
          message: `Unable to add template to project (${projectId}): template required`,
        };
        Logger.error(missingDataError);
        resolve(missingDataError);
        return;
      }

      if (!projectId) {
        const missingIdError: Requester.ApiResultError = {
          error: true,
          message: `Unable to add template (${templateName}) to project: project required`,
        };
        Logger.error(missingIdError);
        resolve(missingIdError);
        return;
      }

      const sourceFolder = fs.join(templateAssetPath, templatePath);
      const sourceManifest = fs.join(sourceFolder, 'manifest.json');

      fs.existsFile(sourceManifest).then(existsRes => {
        if (existsRes.error) {
          Logger.error(existsRes);
          resolve(existsRes);
          return;
        }

        if (!existsRes.data.exists) {
          const existError: Requester.ApiResultError = {
            error: true,
            message: `Unable to add template: template does not exist - ${templateName}`,
          };
          Logger.error(existError);
          resolve(existError);
          return;
        }

        let destFolder = '';

        switch (dest) {
          case 'save':
            destFolder = getDestFolderPath(fs.pathSaveFolder);
            break;
          case 'temp':
            destFolder = getDestFolderPath(fs.pathTempFolder);
            break;
        }

        fs.copy(sourceFolder, destFolder)
          .then(copyRes => {
            if (copyRes.error) {
              Logger.error(copyRes);
              resolve(copyRes);
              return;
            }

            resolve({
              error: false,
              data: {
                templateName,
                projectId,
                source: sourceFolder,
                dest: destFolder,
              },
            });
          })
          .catch(e => {
            const addError = {
              error: true,
              message: `Failed to add template (${templateName}) to project (${projectId})`,
              data: {
                trace: e,
              },
            };
            Logger.error(addError);
            resolve(addError);
          });
      });
    } catch (e) {
      const addError = {
        error: true,
        message: 'Failed to add template',
        data: {
          trace: e,
        },
      };
      Logger.error(addError);
      resolve(addError);
    }
  });
};

export const locate = (name: string) => {
  return new Promise<Requester.ApiResult>(resolve => {
    try {
      let pathname = '';
      const folder = `template-${name}`;
      const installedPath = fs.join(templateFolderPath, folder);
      let isInstalled = false;
      const internalPath = fs.join(templateAssetPath, folder);
      let isInternal = false;
      const existReqs = [
        fs.existsFile(installedPath),
        fs.existsFile(internalPath),
      ];

      Promise.allSettled(existReqs).then(existRes => {
        existRes.forEach(res => {
          if (res.status === 'rejected') {
            Logger.info('location check rejected');
            return;
          }

          if (res.value.error) {
            Logger.info(res.value);
            return;
          }

          if (!res.value.data.exists) {
            Logger.info(res.value);
            return;
          }

          if (res.value.data.pathname === installedPath) {
            isInstalled = true;
          }

          if (res.value.data.pathname === internalPath) {
            isInternal = true;
          }
        });

        if (!isInstalled && !isInternal) {
          const locateError = {
            error: true,
            message: `Unable to locate template: ${name}`,
            data: {
              name,
              installedPath,
              internalPath,
            },
          };
          Logger.error(locateError);
          resolve(locateError);
          return;
        }

        if (isInstalled) {
          pathname = installedPath;
        }

        if (isInternal) {
          pathname = internalPath;
        }

        resolve({
          error: false,
          data: {
            name,
            pathname,
          },
        });
      });
    } catch (e) {
      const locateError = {
        error: true,
        message: 'failed to get url to template',
        data: {
          name,
        },
      };
      Logger.error(locateError);
      resolve(locateError);
    }
  });
};

export const EVENTS: TemplateEvents = {
  install: {
    name: '/templates/install', // sends menu event to frontend
    type: 'send',
  },
  onInstall: {
    name: '/templates/install', // allows user to add/import/install a new template
    type: 'invoke',
    fn: install,
  },
  open: {
    name: '/templates/open', // sends menu event to open the explorer modal
    type: 'send',
  },
  list: {
    name: '/templates/list', // gets list of templates
    type: 'invoke',
    fn: list,
  },
  load: {
    name: '/templates/load', // makes template available to canvas
    type: 'invoke',
    fn: load,
  },
};

export const init = () => {
  return new Promise<Requester.ApiResult>(resolve => {
    try {
      Requester.registerAll(EVENTS);
      IS.__tableCreate(table.name, table.schema).then(() => {
        resolve({
          error: false,
          data: {
            table: table.name,
          },
        });
      });
    } catch (e) {
      resolve({
        error: true,
        message: 'Unable to initialize template model',
        data: {
          trace: e,
        },
      });
    }
  });
};

export const Templates: Model = {
  EVENTS,
  init,
  install,
  list,
  load,
  add,
};

export default Templates;

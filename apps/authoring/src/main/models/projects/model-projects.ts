import { Model } from '../model.types';
import {
  ProjectEvents,
  ImportResult,
  ProjectData,
} from './model-projects.types';
import {
  FileSystem as fs,
  InternalStorage as IS,
  Requester,
} from '../../services';
import * as table from './model-projects-schema';
import { ApiResult } from '../../services/requester';

const PROJECT_DIR_PREFIX = 'scrowl';
const PROJECT_FILE_NAME = 'scrowl.project';

const writeProjectTemp = (
  project: ProjectData,
  filename: string,
  contents: string
) => {
  return new Promise<Requester.ApiResult>(resolve => {
    if (!project.id) {
      resolve({
        error: true,
        message:
          'Unable to add project to temporary directory: project id required',
      });
      return;
    }

    const filePath = fs.join(`${project.id}`, filename);

    fs.writeFileTemp(filePath, contents).then(writeRes => {
      if (writeRes.error) {
        resolve(writeRes);
        return;
      }

      resolve({
        error: false,
        data: {
          filename,
          contents,
        },
      });
    });
  });
};

// TODO change the event to send (remove the resolves)
export const create = () => {
  // TODO add support for handling duplicating a project when a project ID is passed
  return new Promise<Requester.ApiResult>(resolve => {
    let project: ProjectData = { name: 'Untitled Project' };

    // create a new entity in the DB
    IS.create(table.name, project).then(createRes => {
      if (createRes.error) {
        createRes.message = 'Unable to create project';
        resolve(createRes);
        return;
      }

      project = createRes.data.item;
      writeProjectTemp(
        project,
        'manifest.json',
        JSON.stringify(project, null, 2)
      ).then(writeRes => {
        if (writeRes.error) {
          resolve(writeRes);
          Requester.send(EVENTS.onCreate.name, writeRes);
          return;
        }

        const result = {
          error: false as const,
          data: {
            project,
          },
        };

        resolve(result);
        Requester.send(EVENTS.onCreate.name, result);
      });
    });
  });
};

export const save = (ev: Requester.RequestEvent, project: ProjectData) => {
  return new Promise<ApiResult>(resolve => {
    if (!project.id) {
      resolve({
        error: true,
        message: 'Unable to save: project id required',
      });
      return;
    }

    // update the project in the DB
    IS.update(table.name, project, { id: project.id })
      .then(updateRes => {
        if (updateRes.error) {
          resolve(updateRes);
          return;
        }

        if (!updateRes.data.item) {
          resolve({
            error: true,
            message: 'Malformed save: project was not returned',
            data: updateRes,
          });
          return;
        }

        const updatedProject = updateRes.data.item;

        // write the new manifest
        writeProjectTemp(
          updatedProject,
          'manifest.json',
          JSON.stringify(updatedProject, null, 2)
        ).then(writeRes => {
          if (writeRes.error) {
            resolve(writeRes);
            return;
          }

          const from = updatedProject.id.toString();
          const to = updatedProject.id.toString();

          // copy the project temp folder into the save folder
          fs.copyTempToSave(from, to).then(copyRes => {
            if (copyRes.error) {
              resolve(copyRes);
              return;
            }

            resolve({
              error: false,
              data: {
                project: updatedProject,
              },
            });
          });
        });
      })
      .catch(e => {
        resolve({
          error: true,
          message: 'Failed to save changes to storage',
          data: {
            trace: e,
          },
        });
      });
  });
};

export const list = (ev: Requester.RequestEvent, amount?: number) => {
  return new Promise<ApiResult>(resolve => {
    try {
      const orderBy: IS.StorageOrder = [
        {
          column: 'updated_at',
        },
      ];
      const getProjectsManifests = (projectRecords: Array<ProjectData>) => {
        const filePromises = projectRecords.map(project => {
          return fs.readFileSave(fs.join(`${project.id}`, 'manifest.json'));
        });

        Promise.allSettled(filePromises).then(fileResults => {
          const projects: Array<ProjectData | undefined> = [];
          fileResults.forEach(result => {
            if (result.status === 'rejected') {
              return;
            }

            const fileRes = result.value;

            if (fileRes.error) {
              return;
            }

            projects.push(fileRes.data.contents);
          });

          resolve({
            error: false,
            data: {
              projects,
            },
          });
        });
      };

      IS.read(table.name, undefined, orderBy, amount).then(readRes => {
        if (readRes.error) {
          resolve(readRes);
          return;
        }

        getProjectsManifests(readRes.data.items);
      });
    } catch (e) {
      resolve({
        error: true,
        message: 'Failed to list projects',
        data: {
          trace: e,
        },
      });
    }
  });
};

export const open = async function (
  ev: Requester.RequestEvent,
  fileLocation: string
) {
  const tempDir = fs.dirTempSync(PROJECT_DIR_PREFIX);

  if (tempDir.error || !tempDir.data.pathname) {
    return tempDir;
  }

  const projectFiles = await fs.unarchive(fileLocation, tempDir.data.pathname);

  const projectData = fs.fileReadSync(
    `${projectFiles.data.projectDir}/${PROJECT_FILE_NAME}`
  );

  if (projectData.data.contents) {
    projectData.data.contents.updatedAt = new Date().toJSON();
    projectData.data.contents.workingDir = tempDir.data.pathname;
    projectData.data.contents.workingFile = `${tempDir.data.pathname}/${PROJECT_FILE_NAME}`;

    return await save(ev, projectData.data.contents);
  } else {
    return {
      error: true,
      message: `Error opening the project "${projectData.data.project.name}"`,
    };
  }
};

export const importFile = (
  ev: Requester.RequestEvent,
  fileTypes: Array<fs.AllowedFiles>,
  project: ProjectData
) => {
  return new Promise<ImportResult>(resolve => {
    if (!project) {
      resolve({
        error: true,
        message: 'Unable to import a file - project required',
      });
      return;
    }

    if (!project.workingDir) {
      resolve({
        error: true,
        message: 'Unable to import a file - project working directory required',
      });
      return;
    }

    if (!fileTypes || !fileTypes.length) {
      resolve({
        error: true,
        message: 'Unable to import a file - file types required',
      });
      return;
    }

    const filters = fs.getDialogMediaFilters(fileTypes);

    if (!filters.length) {
      resolve({
        error: true,
        message: `Unable to import a file: ${fileTypes.join(
          ', '
        )} - not supported`,
      });
      return;
    }

    const dialogOptions = {
      title: 'Scrowl - Import File',
      filters,
    };

    fs.dialogOpen(dialogOptions).then(openRes => {
      if (openRes.error) {
        resolve(openRes);
        return;
      }

      if (!openRes.data.filePaths.length) {
        resolve({
          error: true,
          message: 'Unable to import file - no file selected',
        });
        return;
      }

      const importSource = openRes.data.filePaths[0];

      if (!project.workingDir) {
        resolve({
          error: true,
          message:
            'Unable to import a file - project working directory required',
        });
        return;
      }

      const copyRes = fs.fileTempSync(importSource, project.workingDir);

      if (copyRes.error) {
        resolve(copyRes);
      }

      const workingImport = copyRes.data.filename;
      project.workingImports = project.workingImports || [];
      project.workingImports.push(workingImport);

      resolve({
        error: false,
        data: {
          project: project,
          import: workingImport,
        },
      });
    });
  });
};

export const EVENTS: ProjectEvents = {
  create: {
    name: '/projects/create',
    type: 'invoke',
    fn: create,
  },
  onCreate: {
    name: '/projects/create',
    type: 'send',
  },
  save: {
    name: '/projects/save',
    type: 'invoke',
    fn: save,
  },
  onSave: {
    name: '/projects/save',
    type: 'send',
  },
  open: {
    name: '/projects/open',
    type: 'invoke',
    fn: open,
  },
  list: {
    name: '/projects/list',
    type: 'invoke',
    fn: list,
  },
  listRecent: {
    name: '/projects/list/recent',
    type: 'invoke',
    fn: ev => {
      return list(ev, 10);
    },
  },
  import: {
    name: 'project/import-file',
    type: 'invoke',
    fn: importFile,
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
        message: 'Unable to initialize project model',
        data: {
          trace: e,
        },
      });
    }
  });
};

export const Project: Model = {
  EVENTS,
  init,
  create,
  open,
  save,
  importFile,
};

export default Project;

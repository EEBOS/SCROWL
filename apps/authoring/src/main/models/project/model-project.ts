import { IpcMainInvokeEvent } from 'electron';
import { Model } from '../model.types';
import {
  ProjectEvents,
  CreateResult,
  SaveResult,
  ImportResult,
  ProjectData,
} from './model-project.types';
import { FileSystem as fs, Requester } from '../../services';
import { projectData as EXAMPLE_DATA } from './model-project-data';

const PROJECT_DIR_PREFIX = 'scrowl';
const PROJECT_FILE_NAME = 'scrowl.project';

export const create = function (
  event: IpcMainInvokeEvent,
  projectID: ProjectData
): CreateResult {
  const tempDir: fs.DirectoryTempResult = fs.dirTempSync(PROJECT_DIR_PREFIX);

  if (tempDir.error) {
    return tempDir;
  }

  const filename = `${tempDir.data.pathname}/${PROJECT_FILE_NAME}`;

  // TODO: The tempProjectData will be replaced by the proper project data loaded from the project
  // template file according to the projectID received from the frontend. The way the templates
  // will be stored hasn't been defined yet so we'll use example data for now.
  const currentDate = new Date().toJSON();
  const tempProjectData: ProjectData = {
    ...EXAMPLE_DATA,
    workingFile: filename,
    workingDir: filename.split('/').slice(0, -1).join('/'),
    createdAt: currentDate,
    modifiedAt: currentDate,
    openedAt: currentDate,
  };

  const writeRes = fs.fileWriteSync(filename, tempProjectData);

  if (writeRes.error) {
    return writeRes;
  }

  return {
    error: false,
    data: {
      filename: filename,
      project: tempProjectData,
    },
  };
};

export const open = async function () {
  const dialogOptions = {
    title: 'Scrowl - Open Project',
    filters: [
      {
        name: 'Scrowl Project',
        extensions: ['scrowl'],
      },
    ],
  };

  const dialogResult = await fs.dialogOpen(dialogOptions);

  if (dialogResult.error) {
    return {
      error: true,
      message: 'Unable to save project - working directory required',
    };
  }

  if (dialogResult.data.canceled) {
    return {
      error: true,
      message: 'No files found/selected',
    };
  }

  const tempDir = fs.dirTempSync(PROJECT_DIR_PREFIX);

  if (tempDir.error || !tempDir.data.pathname) {
    return tempDir;
  }

  const projectData = fs.unarchive(
    dialogResult.data.filePaths[0],
    tempDir.data.pathname
  );

  return fs.fileReadSync(`${projectData.data.projectDir}/${PROJECT_FILE_NAME}`);
};

const write = function (source: string, filename: string): fs.FileDataResult {
  if (!source) {
    return {
      error: true,
      message: 'project requires a source',
    };
  }

  if (!filename) {
    return {
      error: true,
      message: 'project requires a filename',
    };
  }

  return fs.archive(source, filename);
};

export const save = (event: IpcMainInvokeEvent, project: ProjectData) => {
  return new Promise<SaveResult>(resolve => {
    const updateProject = (res: fs.DialogSaveResult) => {
      if (!project.workingDir) {
        resolve({
          error: true,
          message: 'Unable to save project - working directory required',
        });
        return;
      }

      if (res.error) {
        resolve(res);
        return;
      }

      const writeRes = write(project.workingDir, res.data.filePath);

      if (writeRes.error) {
        resolve(writeRes);
        return;
      }

      try {
        project.saveFile = writeRes.data.filename;
        project.saveDir = writeRes.data.filename
          .split('/')
          .slice(0, -1)
          .join('/');

        resolve({
          error: false,
          data: {
            filename: writeRes.data.filename,
            project: project,
          },
        });
      } catch (err) {
        const message =
          err && typeof err === 'string'
            ? err
            : 'Unable to save project - unknown reason';

        resolve({
          error: true,
          message,
        });
      }
    };

    if (!project) {
      resolve({
        error: true,
        message: 'Unable to save project - project data required',
      });
    }

    if (!project.workingDir) {
      resolve({
        error: true,
        message: 'Unable to save project - working directory required',
      });
    }

    updateProject({
      error: false,
      data: {
        canceled: false,
        filePath: project.saveDir,
      },
    });
  });
};

export const importFile = (
  event: IpcMainInvokeEvent,
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
          contents: project,
          import: workingImport,
        },
      });
    });
  });
};

export const EVENTS: ProjectEvents = {
  new: {
    name: '/projects/create',
    type: 'invoke',
    fn: create,
  },
  save: {
    name: 'project/save',
    type: 'invoke',
    fn: save,
  },
  import: {
    name: 'project/import-file',
    type: 'invoke',
    fn: importFile,
  },
};

export const init = () => {
  Requester.registerAll(EVENTS);
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

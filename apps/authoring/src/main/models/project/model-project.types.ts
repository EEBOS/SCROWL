import { Requester, FileSystem } from '../../services';

export interface ProjectEventCreate
  extends Omit<Requester.RegisterEvent, 'name'> {
  name: '/projects/create';
}

export interface ProjectEventSave
  extends Omit<Requester.RegisterEvent, 'name'> {
  name: '/projects/save';
}

export interface ProjectEventOpen
  extends Omit<Requester.RegisterEvent, 'name'> {
  name: '/projects/open';
}

export interface ProjectEventList
  extends Omit<Requester.RegisterEvent, 'name'> {
  name: '/projects/list';
}

export interface ProjectEventListRecent
  extends Omit<Requester.RegisterEvent, 'name'> {
  name: '/projects/list/recent';
}

export interface ProjectEventImport
  extends Omit<Requester.RegisterEvent, 'name'> {
  name: 'project/import-file';
}

export type ProjectEventApi = {
  new: ProjectEventCreate['name'];
  save: ProjectEventSave['name'];
  open: ProjectEventOpen['name'];
  getFiles: ProjectEventList['name'];
  getRecentFiles: ProjectEventListRecent['name'];
  import: ProjectEventImport['name'];
};

export type ProjectEventNames =
  | ProjectEventCreate['name']
  | ProjectEventSave['name']
  | ProjectEventOpen['name']
  | ProjectEventList['name']
  | ProjectEventListRecent['name']
  | ProjectEventImport['name'];

export type ProjectEvent =
  | ProjectEventCreate
  | ProjectEventSave
  | ProjectEventOpen
  | ProjectEventList
  | ProjectEventListRecent
  | ProjectEventImport;

export type ProjectEvents = {
  create: ProjectEventCreate;
  onCreate: ProjectEventCreate;
  save: ProjectEventSave;
  onSave: ProjectEventSave;
  open: ProjectEventOpen;
  list: ProjectEventList;
  listRecent: ProjectEventListRecent;
  import: ProjectEventImport;
};

/**
 * This interface should be updated once
 * define the actual project structure.
 */
export interface ProjectData {
  id: number | null;
  createdAt: string;
  updatedAt: string;
  openedAt: string;
  name: string;
  description: string;
  theme?: string;
  workingFile?: string;
  workingDir?: string;
  workingImports?: Array<string>;
  saveFile?: string;
  saveDir?: string;
}

interface CreateResultSuccess
  extends Omit<FileSystem.FileDataResultSuccess, 'data'> {
  data: {
    filename: string;
    project: ProjectData;
  };
}

export type CreateResult =
  | CreateResultSuccess
  | FileSystem.DirectoryTempResult
  | FileSystem.FileDataResult;

interface OpenResultSuccess
  extends Omit<FileSystem.FileDataResultSuccess, 'data'> {
  data: {
    filename: string;
    contents: ProjectData;
  };
}

export type OpenResult =
  | OpenResultSuccess
  | FileSystem.DirectoryTempResult
  | FileSystem.FileDataResult;

export interface SaveResultSuccess
  extends Omit<FileSystem.FileDataResultSuccess, 'data'> {
  data: {
    filename: string;
    contents: ProjectData;
  };
}

export type SaveResult =
  | SaveResultSuccess
  | FileSystem.DialogSaveResult
  | FileSystem.FileDataResult;

export interface ImportResultSuccess
  extends Omit<FileSystem.DialogOpenResultSuccess, 'data'> {
  data: {
    import: string;
    contents: ProjectData;
  };
}

export type ImportResult =
  | ImportResultSuccess
  | FileSystem.DialogOpenResult
  | FileSystem.FileDataResult;

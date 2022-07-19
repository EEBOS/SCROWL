import {
  AllowedFiles,
  FileData,
} from '../../../main/services/file-system';
import { EVENTS, ProjectData, ProjectDataNew } from '../../../main/models/project';
import { Menu } from '../../services';

// export const create = (project: Project) => {
//   return new Promise<FileData>((resolve, reject) => {
//     requester.invoke(EVENTS.new.save, project)
//       .then((res: FileData) => {
//         if (res.error) {
//           resolve(res);
//           return;
//         }

//         if (res.filename) {
//           res.dir = res.filename.split('/').slice(0, -1).join('/');
//         }

//         resolve(res);
//       })
//       .catch(reject);
//   });
// };

function create(data: ProjectDataNew) {
  return new Promise((resolve, reject) => {

  });
}

export const init = (projectData: ProjectData) => {
  // requester.newProject(create);
};

export const save = (project: string, isSaveAs: boolean, source?: string) => {
  // return requester.invoke(EVENTS.save.name, project, isSaveAs, source);
};

export const importFile = (fileTypes: AllowedFiles[], source: string) => {
  // return requester.invoke(EVENTS.import.name, fileTypes, source);
};

export const Project = {
  create,
  save,
  importFile,
};

export default Project;

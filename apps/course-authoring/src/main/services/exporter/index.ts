import path from 'path';
import fs from 'fs-extra';
import { ipcMain } from 'electron';
import packager from 'scorm-packager';
import { ProjectConfig } from '@scrowl/player/src/lib';
import { PathingProps, PathingDirKey } from './types';
import { fileReadSync, fileWriteSync } from '../file-system';
import { compile } from '../templater';

const pathing: PathingProps = {
  files: {
    template: {
      source: path.join(__dirname, 'course/templates/index.hbs'),
      dest: path.join(__dirname, 'course/package/content/index.html'),
    },
  },
  dirs: {
    source: path.join(__dirname, 'course/package'),
    out: path.join(__dirname, 'course/dist'),
  }
};

const setPathingDirs = () => {
  let dest = '' as PathingDirKey;

  for (dest in pathing.dirs) {
    if (!fs.existsSync(pathing.dirs[dest])) {
      fs.mkdirSync(pathing.dirs[dest]);
    }
  }
};

export const pack = (ev: Electron.IpcMainInvokeEvent, packOptions: {
  title?: string,
  manifest?: ProjectConfig
}) => {
  return new Promise((resolve, reject) => {
    const config = {
      version: '1.2',
      organization: 'OSG',
      language: 'en-US',
      startingPage: 'content/index.html',
      source: pathing.dirs.source,
      package: {
        version: '0.0.1',
        zip: true,
        outputFolder: pathing.dirs.out,
      },
    };
    const courseTemplate = fileReadSync(pathing.files.template.source);

    if (courseTemplate.error) {
      reject(courseTemplate);
      return;
    }

    if (!packOptions.manifest) {
      reject(
        {
          error: true,
          message: 'Missing project manifest'
        }
      );
      return;
    }

    const courseData = {
      title: packOptions.title ? packOptions.title : '',
      manifest: JSON.stringify(packOptions.manifest),
    }
    const courseContents = compile(courseTemplate.contents, courseData);

    if (courseContents.error) {
      reject(courseContents);
      return;
    }

    const writeRes = fileWriteSync(pathing.files.template.dest, courseContents.data);

    if (writeRes.error) {
      reject(writeRes);
      return;
    }

    setPathingDirs();
    packager(config, (msg: string) => {
      resolve({
        error: false,
        message: msg,
      });
    });
  });
};

export const EVENTS = {
  package: 'package-course',
};

export const init = () => {
  ipcMain.handle(EVENTS.package, pack);
};

export default {
  EVENTS,
  init,
  pack,
};

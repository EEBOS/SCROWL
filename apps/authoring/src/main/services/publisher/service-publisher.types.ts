import { RegisterEvent, ApiResult } from '../requester';
import { TemplateManifestMeta } from '../../models/templates/model-templates.types';

interface PathingFiles {
  template: {
    source: string;
    dest: string;
  };
}

export type PathingFileKey = keyof PathingFiles;

interface PathingDirs {
  source: string;
  out: string;
}

export type PathingDirKey = keyof PathingDirs;

export interface PathingProps {
  files: PathingFiles;
  dirs: PathingDirs;
}

export type TemplateData = {
  [key: string]: string | number | TemplateData | Array<TemplateData>;
};

export interface TemplateInfo extends TemplateManifestMeta {
  pathname: string;
}

export type TemplateCopyResult = {
  templates: Array<TemplateInfo>;
  to: string;
};

export interface PublisherEventPackage extends Omit<RegisterEvent, 'name'> {
  name: 'publish-project';
}

export type PublisherEventNames = PublisherEventPackage['name'];

export type ExportEvent = PublisherEventPackage;

export type PublisherEvents = {
  package: PublisherEventPackage;
};

export type TemplateResult = ApiResult;

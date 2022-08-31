import { Requester } from '..';
import { Project, Preferences } from '../../models';

export interface MenuEventCreateProject
  extends Omit<Requester.RegisterEvent, 'name'> {
  id: 'new-project';
  name: Project.ProjectEventCreate['name'];
}

export interface MenuEventOpenProject
  extends Omit<Requester.RegisterEvent, 'name'> {
  id: 'open-project';
  name: Project.ProjectEventOpen['name'];
}

export interface MenuEventSaveProject
  extends Omit<Requester.RegisterEvent, 'name'> {
  id: 'save-project';
  name: Project.ProjectEventSave['name'];
}

export interface MenuEventPublishProject
  extends Omit<Requester.RegisterEvent, 'name'> {
  id: 'publish-project';
  name: Project.ProjectEventPublish['name'];
}

export interface MenuEventImportFile
  extends Omit<Requester.RegisterEvent, 'name'> {
  id: 'import-file';
  name: Project.ProjectEventImport['name'];
}

export interface MenuEventPreferencesCreate
  extends Omit<Requester.RegisterEvent, 'name'> {
  id: 'preferences-create';
  name: Preferences.PreferenceEventCreate['name'];
}

export interface MenuEventPreferencesOpen
  extends Omit<Requester.RegisterEvent, 'name'> {
  id: 'preferences-open';
  name: Preferences.PreferenceEventOpen['name'];
}

export interface MenuEventGetStarted
  extends Omit<Requester.RegisterEvent, 'name'> {
  id: 'get-started';
  name: '/get-started';
}

export interface MenuEventItemList
  extends Omit<Requester.RegisterEvent, 'name'> {
  name: 'menu/items';
}

export interface MenuEventItemToggle
  extends Omit<Requester.RegisterEvent, 'name'> {
  name: 'menu/item/toggle';
}

export interface MenuEventItemDisable
  extends Omit<Requester.RegisterEvent, 'name'> {
  name: 'menu/item/disable';
}

export interface MenuEventItemEnable
  extends Omit<Requester.RegisterEvent, 'name'> {
  name: 'menu/item/enable';
}

export type MenuItemEventNames =
  | MenuEventCreateProject['name']
  | MenuEventOpenProject['name']
  | MenuEventSaveProject['name']
  | MenuEventPublishProject['name']
  | MenuEventImportFile['name']
  | MenuEventPreferencesCreate['name']
  | MenuEventPreferencesOpen['name']
  | MenuEventGetStarted['name'];

export type MenuItemEvent =
  | MenuEventCreateProject
  | MenuEventOpenProject
  | MenuEventSaveProject
  | MenuEventPublishProject
  | MenuEventImportFile
  | MenuEventPreferencesCreate
  | MenuEventPreferencesOpen
  | MenuEventGetStarted;

export type MenuItemEventsFile = {
  projectsCreate: MenuEventCreateProject;
  projectOpen: MenuEventOpenProject;
  projectSave: MenuEventSaveProject;
  projectPublish: MenuEventPublishProject;
  importFile: MenuEventImportFile;
};

export type MenuEventsFileApi = {
  projectsCreate: MenuEventCreateProject['name'];
  projectOpen: MenuEventOpenProject['name'];
  projectSave: MenuEventSaveProject['name'];
  projectPublish: MenuEventPublishProject['name'];
  importFile: MenuEventImportFile['name'];
  preferencesCreate: MenuEventPreferencesCreate['name'];
  preferencesOpen: MenuEventPreferencesOpen['name'];
  getStarted: MenuEventGetStarted['name'];
};

export type MenuItemEventsApp = {
  preferencesCreate?: MenuEventPreferencesCreate;
  preferencesOpen: MenuEventPreferencesOpen;
  getStarted: MenuEventGetStarted;
};

export type MenuEventsAppApi = {
  preferencesCreate: MenuEventPreferencesCreate['name'];
  preferencesOpen: MenuEventPreferencesOpen['name'];
  getStarted: MenuEventGetStarted['name'];
};

export type MenuItems = Partial<MenuItemEventsApp> &
  Partial<MenuItemEventsFile>;

export type MenuEventsGlobal = {
  itemList: MenuEventItemList;
  itemToggle: MenuEventItemToggle;
  itemDisable: MenuEventItemDisable;
  itemEnable: MenuEventItemEnable;
};

export type MenuEventGlobalApi = {
  itemList: MenuEventItemList['name'];
  itemToggle: MenuEventItemToggle['name'];
  itemDisable: MenuEventItemDisable['name'];
  itemEnable: MenuEventItemEnable['name'];
};

export type MenuEvents = Partial<MenuEventsGlobal> &
  Partial<MenuItemEventsApp> &
  Partial<MenuItemEventsFile>;

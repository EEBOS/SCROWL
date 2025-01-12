import { MenuItemConstructorOptions } from 'electron';
import { MenuItemEventsFile, MenuItemEventsApp } from '../service-menu.types';
import { registerAll } from '../../requester';
import * as menuApp from './service-menu-items-app';
import * as menuFile from './service-menu-items-file';
import * as menuEdit from './service-menu-items-edit';

export const createMenu = (
  isMacOs: boolean
): {
  template: MenuItemConstructorOptions[];
  EVENTS: Partial<MenuItemEventsFile> & Partial<MenuItemEventsApp>;
} => {
  let EVENTS = {};
  const template = [];

  if (isMacOs) {
    template.push(menuApp.template);
  }

  template.push(menuFile.template);
  template.push(menuEdit.template);
  EVENTS = Object.assign(EVENTS, menuApp.EVENTS, menuFile.EVENTS);
  registerAll(EVENTS);

  return {
    template,
    EVENTS,
  };
};

export default {
  createMenu,
};

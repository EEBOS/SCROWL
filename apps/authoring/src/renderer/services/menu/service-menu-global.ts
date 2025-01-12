import { requester } from '..';
import { MenuEventGlobalApi, MenuItems } from '../../../main/services/menu';

export const ENDPOINTS: MenuEventGlobalApi = {
  itemList: 'menu/items',
  itemDisable: 'menu/item/disable',
  itemToggle: 'menu/item/toggle',
  itemEnable: 'menu/item/enable',
};

export let ITEMS: MenuItems = {};

export const init = () => {
  return new Promise<requester.ApiResult>(resolve => {
    requester.invoke(ENDPOINTS.itemList).then((result: requester.ApiResult) => {
      if (result.error) {
        console.error(result);
        resolve(result);
        return;
      }

      ITEMS = result.data.items;
      resolve(result);
    });
  });
};

const isMenuInitialized = () => {
  return Object.keys(ITEMS).length > 0;
};

export const enable = (item: typeof ITEMS[keyof typeof ITEMS]) => {
  return new Promise<requester.ApiResult>(resolve => {
    if (!item) {
      resolve({
        error: true,
        message: `Unable to enable item - No item to process`,
        data: {
          items: ITEMS,
        },
      });
      return;
    }

    if (!isMenuInitialized) {
      resolve({
        error: true,
        message: `Unable to enable item: ${item.name} - Menu not initialized`,
      });
      return;
    }

    requester.invoke(ENDPOINTS.itemEnable, item).then(resolve);
  });
};

export const disable = (item: typeof ITEMS[keyof typeof ITEMS]) => {
  return new Promise<requester.ApiResult>(resolve => {
    if (!item) {
      resolve({
        error: true,
        message: `Unable to disable item - No item to process`,
        data: {
          items: ITEMS,
        },
      });
      return;
    }

    if (!isMenuInitialized) {
      resolve({
        error: true,
        message: `Unable to disable item: ${item.name} - Menu not initialized`,
      });
      return;
    }

    requester.invoke(ENDPOINTS.itemDisable, item).then(resolve);
  });
};

export const toggle = (item: typeof ITEMS[keyof typeof ITEMS]) => {
  return new Promise<requester.ApiResult>(resolve => {
    if (!item) {
      resolve({
        error: true,
        message: `Unable to toggle item - No item to process`,
        data: {
          items: ITEMS,
        },
      });
      return;
    }

    if (!isMenuInitialized) {
      resolve({
        error: true,
        message: `Unable to toggle item: ${item.name} - Menu not initialized`,
      });
      return;
    }

    requester.invoke(ENDPOINTS.itemToggle, item).then(resolve);
  });
};

export default {
  ITEMS,
  init,
  disable,
  toggle,
};

import { createSlice } from '@reduxjs/toolkit';
import { StateConfig } from '../../services/state/service-state.types';

export const config: StateConfig = {
  name: 'projects',
  initialState: {
    data: {},
    isProcessing: false,
    isInit: false,
    isExplorerModelOpen: false,
    isSaveable: false,
    isListeningSave: false,
  },
  reducers: {
    update: (state, action) => {
      state.data = Object.assign(state.data, action.payload);
    },
    process: (state, action) => {
      state.isProcessing = action.payload;
    },
    init: (state, action) => {
      state.isInit = action.payload;
    },
    toggleExplorer: (state, action) => {
      state.isExplorerModelOpen = action.payload;
    },
    saveable: (state, action) => {
      state.isSaveable = action.payload;
    },
    listeningSave: (state, action) => {
      state.isListeningSave = action.payload;
    },
  },
};

export const slice = createSlice(config);

export const {
  update,
  process,
  init,
  toggleExplorer,
  saveable,
  listeningSave,
} = slice.actions;

export const reducer = slice.reducer;

export default {
  config,
};

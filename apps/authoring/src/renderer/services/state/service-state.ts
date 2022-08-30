import { configureStore } from '@reduxjs/toolkit';
import { StoreConfig } from './service-state.types';
import { Preferences, Projects } from '../../models';

export const init = () => {
  const states = [
    {
      name: Preferences.state.config.name,
      reducer: Preferences.state.reducer,
    },
    {
      name: Projects.state.config.name,
      reducer: Projects.state.reducer,
    },
  ];
  const config: StoreConfig = {
    reducer: {},
  };

  states.forEach(state => {
    config.reducer[state.name] = state.reducer;
  });

  return configureStore(config);
};

export default {
  init,
};

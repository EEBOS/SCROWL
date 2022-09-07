import React from 'react';
import * as styles from './page-editor.module.scss';
import { Header, PaneDetails } from './elements';
import { RightPane } from './elements/right-pane';

export const PageElement = () => {
  return (
    <>
      <main className={styles.editor}>
        <Header />

        <PaneDetails />

        <div className={styles.workspace}>
          <div className="workspace__body">Workspace</div>
        </div>

        <RightPane />

        <nav className="scrowl__footer owlui-navbar fixed-bottom"></nav>
      </main>
    </>
  );
};

export default {
  PageElement,
};

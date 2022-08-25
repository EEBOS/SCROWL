import React, { useState } from 'react';
import * as styles from './editor-header.module.scss';
import { Logo, Toolbar } from '../../../../components';
import { PublishButton } from './editor-header-publish-button';

export const Header = () => {
  const [filename, setFilename] = useState('MyCourseProject');

  const handleFilenameChange = (ev: React.FormEvent<HTMLInputElement>) => {
    setFilename(ev.currentTarget.value);
  };

  return (
    <Toolbar>
      <div className="d-flex justify-content-between align-items-center w-100">
        <div>
          <Logo />
          <div className={styles.filename} data-value={filename}>
            <input
              name="filename"
              id="filenameInput"
              className="form-control"
              value={filename}
              placeholder="Untitled Project"
              onChange={handleFilenameChange}
            />
          </div>
        </div>
        <div>
          <PublishButton />
        </div>
      </div>
    </Toolbar>
  );
};

export default {
  Header,
};

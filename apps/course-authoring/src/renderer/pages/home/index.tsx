import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import style from './styles.module.scss';
import { Default as Nav } from '@owlui/navigationdrawer';
import { Default as Btn } from '@owlui/button';
import { Default as Icon } from '@owlui/icons';
import { Default as Table } from '@owlui/table';
import { Default as Card } from '@owlui/card';
import { sidebarItems, cards, filesList, EXAMPLE_PROJECT } from './data';
import * as projectModel from '../../models/project-models';
import { CardGrid } from '../../components/cardgrid';
import {
  AllowedFiles,
  FileData,
  OpenFileData,
  SaveFileData,
} from '../../../main/services/file-system/types';

export const PageRoute = '/';
export const PageName = 'Home';

const TemplatesList = () => {
  const tempTemplatesQty = 6;

  return Array.from(Array(tempTemplatesQty), (e, i) => {
    return (
      <div key={i} className="owlui-grid-col-xs-2">
        <Card
          className={style.template}
          style={{ height: '110px', cursor: 'pointer' }}
        ></Card>
      </div>
    );
  });
};

export const PageElement = () => {
  const [projectDir, setProjectDir] = useState<string | undefined>();
  const [projectFile, setProjectFile] = useState<string | undefined>();
  const [projectData] = useState(EXAMPLE_PROJECT);
  const [imgFileExample, setImgFileExample] = useState<string | undefined>();

  const createProject = () => {
    const resolveProjectCreate = (createResult: FileData) => {
      if (createResult.error) {
        console.error(createResult.message);
        return;
      }

      setProjectDir(createResult.dir);
    };

    projectModel.create(projectData).then(resolveProjectCreate);
  };

  const importFile = (fileTypes: AllowedFiles[]) => {
    const resolveImportFile = (importResult: OpenFileData) => {
      if (importResult.error) {
        console.error(importResult.message);
        return;
      }

      if (importResult.filename) {
        setImgFileExample(`scrowl-file://${importResult.filename}`);
      }
    };

    if (!projectDir) {
      return;
    }

    projectModel.importFile(fileTypes, projectDir).then(resolveImportFile);
  };

  const saveProject = () => {
    const resolveProjecetSave = function (saveResult: SaveFileData) {
      if (saveResult.error) {
        console.error(saveResult.message);
        return;
      }

      setProjectFile(saveResult.filePath);
    };

    if (!projectDir) {
      return;
    }

    projectModel.save(projectDir, projectFile).then(resolveProjecetSave);
  };

  if (projectDir) console.log(projectDir);

  const Header = (
    <>
      <div>
        <h1 className={style.navTitle}>
          <Icon
            className={style.navTitleIcon}
            icon="school"
            aria-hidden="true"
          />
          <span>Scrowl</span>
        </h1>
      </div>
      <div className={style.navActions}>
        <div>
          <Btn variant="link">
            <Link to="/settings">Settings</Link>
          </Btn>
        </div>
        <div>
          <Btn onClick={createProject} disabled={!projectDir ? false : true}>
            New Project
          </Btn>
        </div>
        <div className={style.navDivider} />
        <div>
          <Btn
            onClick={() => importFile(['image'])}
            disabled={projectDir ? false : true}
          >
            Import Image
          </Btn>
          {imgFileExample && (
            <>
              <div className={style.navDivider} />
              <img
                src={imgFileExample}
                alt="Example"
                style={{ width: 'auto', height: '100px' }}
              />
            </>
          )}
        </div>
        <div className={style.navDivider} />
        <div>
          <Btn onClick={saveProject} disabled={projectDir ? false : true}>
            Save Project
          </Btn>
        </div>
      </div>
      <div className={style.navDivider} />
    </>
  );

  return (
    <>
      <Nav className={style.nav} header={Header} items={sidebarItems} />
      <main className={style.main}>
        <section>
          <div>
            <CardGrid cards={cards} />
          </div>
        </section>
        <section className={style.filesList}>
          <div>
            <h2 className={style.sectionTitle}>Your Files</h2>
            <Table columns={filesList.columns} items={filesList.items} />
          </div>
        </section>
        <section className={style.templatesList}>
          <div>
            <h2 className={style.sectionTitle}>Templates</h2>
            <div className="owlui-grid-row">{TemplatesList()}</div>
          </div>
        </section>
      </main>
    </>
  );
};

export default {
  PageName,
  PageRoute,
  PageElement,
};

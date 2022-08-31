import React, {
  BaseSyntheticEvent,
  Dispatch,
  SetStateAction,
  useState,
} from 'react';
import * as styles from '../editor-pane-details.module.scss';
import { ActionMenu, ActionMenuItem } from '../../../../../components';
import { Projects } from '../../../../../models';
import { Icon, Drawer, DrawerProps, Button } from '@owlui/lib';
import { GlossaryForm } from './forms/glossary-form';
import { ProjectData } from '../../../../../models/projects';

export type GlossaryItem = { name: string; description: string };
export type GlossaryData = Array<GlossaryItem>;
export type GlossaryDict = {
  [key: string]: {
    [key: string]: string;
  };
};

const glossaryTermMenuItems: Array<ActionMenuItem> = [
  {
    label: 'Edit',
    icon: 'edit',
    iconStyle: 'Outlined',
  },
  {
    label: 'Delete Term',
    icon: 'delete',
    iconStyle: 'Outlined',
  },
];

const createGlossaryDict = (data: GlossaryData) => {
  const glossary: GlossaryDict = {};

  data.forEach((item: GlossaryItem) => {
    const firstLetter = item.name.substring(0, 1).toUpperCase();

    if (glossary[firstLetter] === undefined) {
      glossary[firstLetter] = {};
    }

    glossary[firstLetter][item.name] = item.description;
  });

  return glossary;
};

const createGlossaryItems = (
  data: GlossaryDict,
  toggleDrawer: boolean,
  setToggleDrawer: Dispatch<SetStateAction<boolean>>,
  glossary: GlossaryData,
  setGlossary: Dispatch<SetStateAction<any>>
) => {
  const headings = Object.keys(data).sort();

  // const glossaryDrawer: DrawerProps = {
  //   header: {
  //     content: <h4>Add Glossary Term</h4>,
  //     bsProps: {
  //       closeButton: true,
  //       className: styles.owluiOffcanvasHeader,
  //     },
  //   },
  //   body: (
  //     <GlossaryForm
  //       show={toggleDrawer}
  //       setShow={setToggleDrawer}
  //       glossary={glossary}
  //       setGlossary={setGlossary}
  //       editEntry={true}
  //     />
  //   ),
  // };

  const toggleShow = (e: BaseSyntheticEvent) => {
    console.log(e.target);
    setToggleDrawer(!toggleDrawer);
  };

  return headings.map((heading: string, idxH: number) => {
    const entries = Object.keys(data[heading]).sort();
    const glossaryItemElements = entries.map((entry, idxE) => {
      return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
        <div
          className={styles.tabGlossaryTerm}
          key={idxE}
          onClick={toggleShow}
          role="cell"
          id={`glossary-item-${idxE}`}
        >
          <div className="d-flex justify-content-between">
            <dt className={styles.tabGlossaryTermWord}>{entry}</dt>
            <ActionMenu
              menu-items={glossaryTermMenuItems}
              title="title"
              children={<></>}
            />
          </div>
          <dd className={styles.tabGlossaryTermDefinition}>
            {data[heading][entry]}
          </dd>
        </div>
      );
    });
    return (
      <div key={idxH}>
        <header>{heading}</header>
        {glossaryItemElements}
      </div>
    );
  });
};

interface AddToGlossaryProps {
  glossary: GlossaryData;
  setGlossary: Dispatch<SetStateAction<GlossaryData>>;
  toggleDrawer: boolean;
  setToggleDrawer: Dispatch<SetStateAction<boolean>>;
  project: ProjectData;
}

const AddGlossaryTermButton = (props: AddToGlossaryProps) => {
  const { toggleDrawer, setToggleDrawer, project } = props;

  const glossaryDrawer: DrawerProps = {
    header: {
      content: <h4>Add Glossary Term</h4>,
      bsProps: {
        closeButton: true,
        className: styles.owluiOffcanvasHeader,
      },
    },
    body: (
      <GlossaryForm
        show={toggleDrawer}
        setShow={setToggleDrawer}
        glossary={props.glossary}
        setGlossary={props.setGlossary}
        project={project}
      />
    ),
  };

  const toggleShow = () => {
    setToggleDrawer(!toggleDrawer);
  };

  return (
    <div className={styles.owlStickyAddItem}>
      <Button
        className={styles.owlStickyAddItemButton}
        data-bs-toggle="offcanvas"
        data-bs-target="#addResource"
        aria-controls="addResource"
        onClick={toggleShow}
      >
        Add a new term to the glossary... <Icon icon="add_circle" />
      </Button>
      <Drawer
        drawer={glossaryDrawer}
        show={toggleDrawer}
        onHide={toggleShow}
        className={styles.tabGlossaryOwlOffcanvasForm}
      />
    </div>
  );
};

export const TabGlossary = () => {
  const project = Projects.useData();

  const glossaryData = project.glossary;

  const [glossary, setGlossary] = useState([...glossaryData]);
  const [toggleDrawer, setToggleDrawer] = useState(false);

  const glossaryDict = createGlossaryDict(glossary);
  const glossaryItems = createGlossaryItems(
    glossaryDict,
    toggleDrawer,
    setToggleDrawer,
    glossary,
    setGlossary
  );

  return (
    <div className={styles.tabGlossary}>
      <dl className={styles.tabGlossaryList}>{glossaryItems}</dl>
      <AddGlossaryTermButton
        glossary={glossary}
        setGlossary={setGlossary}
        toggleDrawer={toggleDrawer}
        setToggleDrawer={setToggleDrawer}
        project={project}
      />
    </div>
  );
};

export default {
  TabGlossary,
};

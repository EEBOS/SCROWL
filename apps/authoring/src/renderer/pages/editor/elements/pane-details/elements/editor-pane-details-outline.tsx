import React, { useState } from 'react';
import * as styles from '../editor-pane-details.module.scss';
import { Icon, Button } from '@owlui/lib';
import Collapse from 'react-bootstrap/Collapse';
import { ActionMenu, ActionMenuItem } from '../../../../../components';
import { outlineData } from './mock-data';

export type SlideTreeItem = {
  name: string;
};

export type SlideTree = Array<SlideTreeItem>;

export type LessonTreeItem = {
  name: string;
  slides: SlideTree;
};

export type LessonTree = Array<LessonTreeItem>;

export type ModuleTreeItem = {
  name: string;
  lessons: LessonTree;
};

export type ProjectTree = Array<ModuleTreeItem>;

const moduleMenuItems: Array<ActionMenuItem> = [
  {
    label: 'Add Lesson',
    icon: 'widgets',
    iconStyle: 'Outlined',
  },
  {
    label: 'Rename',
    icon: 'edit',
    iconStyle: 'Outlined',
  },
  {
    label: 'Duplicate',
    icon: 'content_copy',
    iconStyle: 'Outlined',
  },
  {
    label: 'Add Module After',
    icon: 'folder',
    iconStyle: 'Outlined',
  },
  {
    label: 'Move Up',
    icon: 'arrow_upward',
    iconStyle: 'Outlined',
  },
  {
    label: 'Move Down',
    icon: 'arrow_downward',
    iconStyle: 'Outlined',
  },
  {
    label: 'Delete Module',
    icon: 'delete',
    iconStyle: 'Outlined',
  },
];
const lessonMenuItems: Array<ActionMenuItem> = [
  {
    label: 'Add Slide',
    icon: 'crop_square',
    iconStyle: 'Outlined',
  },
];
const slideMenuItems: Array<ActionMenuItem> = [
  {
    label: 'Rename',
    icon: 'edit',
    iconStyle: 'Outlined',
  },
];

const TreeViewSlide = (tree: SlideTreeItem, id: string) => {
  const itemId = `${id}-slide-item`;
  return (
    <div className={styles.treeViewSlide} key={id}>
      <div className={styles.treeViewHeader}>
        <Button id={itemId} className={styles.treeViewItem} variant="link">
          <span className={styles.treeViewItemIconDetail}>
            <Icon icon="check_box_outline_blank" display="Filled" />
          </span>
          <span className={styles.treeViewItemLabel}>{tree.name}</span>
        </Button>
        <ActionMenu
          menu-items={slideMenuItems}
          title="title"
          children={<></>}
        />
      </div>
    </div>
  );
};

const TreeViewSlides = (data: SlideTree, parentId: string) => {
  return data.map((tree, idx: number) => {
    return TreeViewSlide(tree, `${parentId} - ${idx}`);
  });
};

const TreeViewLesson = (tree: LessonTreeItem, id: string) => {
  const [open, setOpen] = useState(false);
  const itemId = `${id}-lesson-item`;
  const menuId = `${id}-lesson-menu`;
  return (
    <div className={styles.treeViewLesson} key={id}>
      <div className={styles.treeViewHeader}>
        <Button
          id={itemId}
          aria-expanded={open}
          aria-controls={menuId}
          className={styles.treeViewItem}
          onClick={() => setOpen(!open)}
          variant="link"
        >
          <span className={styles.treeViewItemIconHandle}>
            <Icon icon="arrow_drop_down" display="Filled" />
          </span>
          <span className={styles.treeViewItemIconDetail}>
            <Icon icon="widgets" display="Outlined" />
          </span>
          <span className={styles.treeViewItemLabel}>{tree.name}</span>
        </Button>
        <ActionMenu
          menu-items={lessonMenuItems}
          title="title"
          children={<></>}
        />
      </div>
      <Collapse in={open}>
        <div className="nav flex-column collapse" id={menuId}>
          {TreeViewSlides(tree.slides, itemId)}
        </div>
      </Collapse>
    </div>
  );
};

const TreeViewLessons = (data: LessonTree, parentId: string) => {
  return data.map((tree, idx: number) => {
    return TreeViewLesson(tree, `${parentId} - ${idx}`);
  });
};

const TreeViewModule = (tree: ModuleTreeItem, idx: number) => {
  const [open, setOpen] = useState(false);
  const itemId = `tree-item-module-${idx}-item`;
  const menuId = `tree-item-module-${idx}-menu`;
  return (
    <div className={styles.treeViewModule} key={idx}>
      <div className={styles.treeViewHeader}>
        <Button
          id={itemId}
          aria-expanded={open}
          aria-controls={menuId}
          className={styles.treeViewItem}
          onClick={() => setOpen(!open)}
          variant="link"
        >
          <span className={styles.treeViewItemIconHandle}>
            <Icon icon="arrow_drop_down" display="Filled" />
          </span>
          <span className={styles.treeViewItemIconDetail}>
            <Icon icon="folder" display="Filled" />
          </span>
          <span className={styles.treeViewItemLabel}>{tree.name}</span>
        </Button>
        <ActionMenu
          menu-items={moduleMenuItems}
          title="title"
          children={<></>}
        />
      </div>
      <Collapse in={open}>
        <div className="nav flex-column collapse" id={menuId}>
          {TreeViewLessons(tree.lessons, itemId)}
        </div>
      </Collapse>
    </div>
  );
};

const TreeViewModules = (data: ProjectTree) => {
  return data.map(TreeViewModule);
};

export const TabOutline = () => {
  const tabStyles = `${styles.tabOutline} tree-view nav flex-column`;
  const outlineTree = TreeViewModules(outlineData);

  return <div className={tabStyles}>{outlineTree}</div>;
};

export default {
  TabOutline,
};

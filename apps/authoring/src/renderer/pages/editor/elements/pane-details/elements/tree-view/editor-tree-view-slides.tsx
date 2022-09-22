import React, { useState } from 'react';
import * as styles from '../../editor-pane-details.module.scss';
import { Icon, Button } from '@owlui/lib';
import { Projects } from '../../../../../../models';
import { ActionMenu, ActionMenuItem } from '../../../../../../components';
import {
  ModuleTreeItem,
  LessonTreeItem,
  SlideTreeItem,
  TreeViewSlidesProps,
  TreeViewSlideProps,
} from './editor-tree-view.types';
import { deepCopy } from './utils';
import { RenameModal } from '../modals/editor-modal-rename';
import { updateActiveSlide } from '../../../../page-editor-hooks';

const TreeViewSlide = (props: TreeViewSlideProps) => {
  const { tree, idx, moduleIdx, lessonIdx, project } = props;
  const itemId = `module-${moduleIdx}-lesson-${lessonIdx}-slide-item-${idx}`;
  const modules = deepCopy(project.modules);
  const slideModule: ModuleTreeItem = modules[moduleIdx];
  const slideLesson: LessonTreeItem = slideModule.lessons[lessonIdx];
  const slide: SlideTreeItem = slideLesson.slides[idx];
  const [showModalRename, setModalRename] = useState(false);
  const toggleModalRename = () => setModalRename(!showModalRename);

  const slideMenuItems: Array<ActionMenuItem> = [
    {
      label: 'Rename',
      icon: 'edit',
      display: 'outlined',
      actionHandler: () => {
        toggleModalRename();
      },
    },
    {
      label: 'Duplicate',
      icon: 'content_copy',
      display: 'outlined',
      actionHandler: () => {
        if (!modules) {
          return;
        }

        const newSlide: SlideTreeItem = {
          name: slide.name + ' copy',
        };

        slideLesson.slides.splice(idx + 1, 0, newSlide);
        Projects.update({ modules });
      },
    },
    {
      label: 'Add Slide',
      icon: 'folder',
      display: 'outlined',
      actionHandler: () => {
        const newSlide: SlideTreeItem = {
          name: 'Untitled Slide',
        };
        slideLesson.slides.splice(idx + 1, 0, newSlide);
        Projects.update({ modules });
      },
    },
    {
      label: 'Move Up',
      icon: 'arrow_upward',
      display: 'outlined',
      actionHandler: () => {
        if (slideLesson.slides.length <= 1 || idx <= 0) {
          console.log('Invalid operation');
          return;
        }
        [slideLesson.slides[idx - 1], slideLesson.slides[idx]] = [
          slideLesson.slides[idx],
          slideLesson.slides[idx - 1],
        ];
        Projects.update({ modules });
      },
    },
    {
      label: 'Move Down',
      icon: 'arrow_downward',
      display: 'outlined',
      actionHandler: () => {
        if (
          slideLesson.slides.length <= 1 ||
          slideLesson.slides.length - 1 <= idx
        ) {
          console.log('Invalid operation');
          return;
        }
        [slideLesson.slides[idx], slideLesson.slides[idx + 1]] = [
          slideLesson.slides[idx + 1],
          slideLesson.slides[idx],
        ];
        Projects.update({ modules });
      },
    },
    {
      label: 'Delete Slide',
      icon: 'delete',
      display: 'outlined',
      actionHandler: () => {
        slideLesson.slides.splice(idx, 1);
        Projects.update({ modules });
      },
    },
  ];

  const handleRename = (name: string) => {
    slide.name = name;
    Projects.update({ modules });
  };

  const wrapper = itemId + '-wrapper';

  const handleSlideSelection = () => {
    const selector = document.querySelector('.slideActive');
    if (selector) {
      selector.classList.remove('slideActive');
    }
    updateActiveSlide(tree);
    document.getElementById(wrapper)?.classList.add('slideActive');
  };

  return (
    <div className={styles.treeViewSlide} key={idx}>
      <div id={wrapper} className={styles.treeViewHeader}>
        <Button
          id={itemId}
          className={styles.treeViewItem}
          variant="link"
          onClick={handleSlideSelection}
        >
          <span className={styles.treeViewItemIconDetail}>
            <Icon icon="rectangle" display="outlined" />
          </span>
          <span className={styles.treeViewItemLabel}>{tree.name}</span>
        </Button>
        <ActionMenu
          menu-items={slideMenuItems}
          title="title"
          children={<></>}
        />
      </div>
      <RenameModal
        label="Rename Slide"
        value={tree.name}
        onSubmit={handleRename}
        show={showModalRename}
        onHide={toggleModalRename}
      />
    </div>
  );
};

export const TreeViewSlides = (props: TreeViewSlidesProps) => {
  const { tree, moduleIdx, lessonIdx, project } = props;

  return (
    <>
      {tree.map((lesson, idx) => {
        return (
          <TreeViewSlide
            tree={lesson}
            moduleIdx={moduleIdx}
            lessonIdx={lessonIdx}
            idx={idx}
            key={idx}
            project={project}
          />
        );
      })}
    </>
  );
};

export default {
  TreeViewSlides,
};

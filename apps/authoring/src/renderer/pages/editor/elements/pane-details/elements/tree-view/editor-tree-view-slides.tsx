import React from 'react';
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
import { deepCopy, addLeadZero } from './utils';

const TreeViewSlide = (props: TreeViewSlideProps) => {
  const { tree, idx, moduleIdx, lessonIdx, project } = props;
  const itemId = `module-${moduleIdx}-lesson-${lessonIdx}-slide-item-${idx}`;
  const modules = deepCopy(project.modules);
  const slideModule: ModuleTreeItem = modules[moduleIdx];
  const slideLesson: LessonTreeItem = slideModule.lessons[lessonIdx];
  const slide: SlideTreeItem = slideLesson.slides[idx];

  const slideMenuItems: Array<ActionMenuItem> = [
    {
      label: 'Rename',
      icon: 'edit',
      iconStyle: 'Outlined',
      action: () => {
        const now = new Date();
        const y = now.getFullYear().toString().slice(-2);
        const m = addLeadZero(now.getMonth() + 1);
        const d = addLeadZero(now.getDate());
        const hh = addLeadZero(now.getHours());
        const mm = addLeadZero(now.getMinutes());
        const ss = addLeadZero(now.getSeconds());

        slide.name = `${y}/${m}/${d} - ${hh}:${mm}:${ss}`;
        Projects.update({ modules });
      },
    },
    {
      label: 'Duplicate',
      icon: 'content_copy',
      iconStyle: 'Outlined',
      action: () => {
        if (!modules) {
          return;
        }

        slideLesson.slides.splice(idx + 1, 0, slide);
        Projects.update({ modules });
      },
    },
    {
      label: 'Add Slide',
      icon: 'folder',
      iconStyle: 'Outlined',
      action: () => {
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
      iconStyle: 'Outlined',
      action: () => {
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
      iconStyle: 'Outlined',
      action: () => {
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
      iconStyle: 'Outlined',
      action: () => {
        slideLesson.slides.splice(idx, 1);
        // confirm({
        //   headerText: 'Header',
        //   descriptionText: 'Description',
        //   acceptConfirm: () => Projects.update({ modules }),
        //   cancelConfirm: () => console.log('cancelled'),
        // });
        Projects.update({ modules });
      },
    },
  ];

  return (
    <div className={styles.treeViewSlide} key={idx}>
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
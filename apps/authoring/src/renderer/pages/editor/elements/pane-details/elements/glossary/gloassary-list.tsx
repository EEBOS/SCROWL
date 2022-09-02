import React from 'react';
import { GlossaryListEntriesProps, GlossaryListProps } from './glossary-types';
import * as styles from '../../editor-pane-details.module.scss';
import { ActionMenu, ActionMenuItem } from '../../../../../../components';

export const GlossaryListEntries = ({
  glossary,
  onEdit,
  onDelete,
}: GlossaryListEntriesProps) => {
  const entires = Object.keys(glossary).sort();
  const getEntryIndex = (ev: React.MouseEvent<Element, MouseEvent>) => {
    const target = ev.target as HTMLElement;
    const actionBtn = target.parentElement?.parentElement
      ?.parentElement as HTMLElement;

    if (!actionBtn || actionBtn.dataset.idx === undefined) {
      return;
    }

    const idx = parseInt(actionBtn.dataset.idx);

    if (isNaN(idx)) {
      return;
    }

    return idx;
  };
  const actionMenuItems: Array<ActionMenuItem> = [
    {
      label: 'Edit',
      icon: 'edit',
      iconStyle: 'Outlined',
      action: (ev: React.MouseEvent<Element, MouseEvent>) => {
        const idx = getEntryIndex(ev);

        if (idx === undefined) {
          console.error('unable to edit glossary term: idex not found');
          return;
        }

        onEdit(idx);
      },
    },
    {
      label: 'Delete',
      icon: 'delete',
      iconStyle: 'Outlined',
      action: (ev: React.MouseEvent<Element, MouseEvent>) => {
        const idx = getEntryIndex(ev);

        if (idx === undefined) {
          console.error('unable to delete glossary term: idex not found');
          return;
        }

        onDelete(idx);
      },
    },
  ];

  return (
    <>
      {entires.map((entry: string, idx: number) => {
        return (
          <div
            className={styles.tabGlossaryTerm}
            key={idx}
            id={`glossary-item-${entry}`}
          >
            <div className="d-flex justify-content-between">
              <dt className={styles.tabGlossaryTermWord}>{entry}</dt>
              <ActionMenu
                data-idx={glossary[entry].idx}
                menu-items={actionMenuItems}
                title="title"
                children={<></>}
              />
            </div>
            <dd className={styles.tabGlossaryTermDefinition}>
              {glossary[entry].description}
            </dd>
          </div>
        );
      })}
    </>
  );
};

export const GlossaryList = ({
  glossary,
  onEdit,
  onDelete,
}: GlossaryListProps) => {
  const headings = Object.keys(glossary).sort();

  if (!headings) {
    return <></>;
  }

  return (
    <>
      {headings.map((heading, idx: number) => {
        return (
          <div key={idx}>
            <header>{heading}</header>
            <GlossaryListEntries
              glossary={glossary[heading]}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        );
      })}
    </>
  );
};

export default {
  GlossaryListEntries,
  GlossaryList,
};
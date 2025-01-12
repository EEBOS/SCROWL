/* eslint-disable import/named */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { ActionMenuProps, ActionMenuItem } from './comp-action-menu.types';
import * as styles from './comp-action-menu.module.scss';
import {
  Dropdown,
  DropdownItemProps,
  DropdownDefaultProps,
  Icon,
} from '@owlui/lib';

const ActionMenuBtn = (
  <Icon display="rounded" icon="more_vert" opsz={20} filled />
);

const makeActionMenu = (
  items: Array<ActionMenuItem>
): Array<DropdownItemProps> => {
  const classes = `dropdown-item-wrapper left-pane-dropdown d-flex align-items-center`;
  return items.map(
    ({ actionHandler, label, ...props }: ActionMenuItem, idx: number) => {
      return {
        id: idx.toString(),
        label: (
          <div className={classes} onClick={actionHandler}>
            <Icon {...props} />
            <span>{label}</span>
          </div>
        ),
      };
    }
  );
};

export const ActionMenu = (props: ActionMenuProps) => {
  if (!props['menu-items']) {
    console.error('Menu Items are a required prop for Action Menu');
    return <></>;
  }

  const actionMenu = makeActionMenu(props['menu-items']);

  const locals = props;
  delete locals['menu-items'];

  const dropdownProps: DropdownDefaultProps = Object.assign(
    {
      items: actionMenu,
      title: props.title,
      size: undefined,
      button: ActionMenuBtn,
    },
    locals
  );

  return (
    <Dropdown
      align="end"
      className={styles.actionMenu}
      {...dropdownProps}
      showSelected={false}
    ></Dropdown>
  );
};

export default {
  ActionMenu,
};

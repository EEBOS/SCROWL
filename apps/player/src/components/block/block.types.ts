import React from 'react';
import { ButtonDefaultProps } from '@owlui/lib';
export interface BlockElement {
  id?: string;
  type: string;
  props: ButtonDefaultProps;
}

export interface BlockConfig {
  id?: string;
  elements: Array<BlockElement>;
}

export interface BlockCommons {
  elements: Array<BlockElement>;
}

export type BlockProps = BlockCommons & React.AllHTMLAttributes<HTMLDivElement>;
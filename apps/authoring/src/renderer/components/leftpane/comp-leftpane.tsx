import React from 'react';
import { Tabs, Input, InputProps } from '@owlui/lib';
import { Outline, topOutlineItems } from '../accordion';
import { GlossaryCard } from '../card';

const cards = [
  {
    id: '1',
    header: 'Agent',
    content:
      'One who acts for, or in the place of, another, by authority from him or her; one entrusted with the business of another; a substitute; a deputy. Managers and supervisors are agents of the employer.',
  },
  {
    id: '2',
    header: 'Circuit courts',
    content:
      'The name informally used to refer to the existing U.S. court of appeals, which are organized into thirteen circuits covering different geographical areas of the country. The term derives from an age before mechanized transit, when judges and lawyers rode “the circuit” of their territory to hold court in various places.',
  },
  {
    id: '4',
    header: 'Common Law Torts',
    content:
      'Legal actions against civil wrongs, including assault and battery, intentional infliction of emotional distress, interference with contract and defamation. Tort actions may provide more relief than the federal and state laws. Constructive Discharge.',
  },
  {
    id: '5',
    header: 'Discrimination',
    content:
      'Any action that unlawfully or unjustly results in unequal treatment of persons or groups based on race, color, gender, national origin, religion, age, disability or other factors protected under federal, state or local laws, such as marital status or gender identity.',
  },
  {
    id: '3',
    header: 'Coercion',
    content:
      'The use of authority or force to impose an unwanted advance. The act of compelling by force of authority.',
  },
  {
    id: '6',
    header: 'Assault',
    content:
      'Assault can be defined as any act in which a person is abused, threatened, intimidated or assaulted in his or her employment. While exact definitions vary in legislation, generally speaking workplace violence or harassment includes: Threatening behaviour – such as shaking fists, destroying property or throwing objects.',
  },
];

const items = [
  {
    id: '1',
    title: 'Outline',
    view: <Outline items={topOutlineItems} />,
  },
  {
    id: '2',
    title: 'Resources',
    view: (
      <ul className="resources">
        <li>Bill 168 Legislation</li>
        <li>Harrassment Report.pdf</li>
        <li>Harrassment Policy</li>
      </ul>
    ),
  },
  {
    id: '3',
    title: 'Glossary',
    view: (
      <>
        <GlossaryCard cards={cards} />
      </>
    ),
  },
];

const inputProps: InputProps = {
  label: {
    content: 'Search...',
    htmlFor: 'email',
  },
  control: {
    id: 'search',
    type: 'text',
    disabled: false,
    readOnly: false,
    plaintext: false,
    placeholder: 'Search...',
  },
};

export const LeftPane = () => {
  return (
    <>
      <Input inputProps={inputProps} style={{ padding: '1em' }} />
      <Tabs items={items} />
    </>
  );
};

export default {
  LeftPane,
};

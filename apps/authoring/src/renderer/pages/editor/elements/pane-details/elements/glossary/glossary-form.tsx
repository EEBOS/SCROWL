import React, { useState } from 'react';
import { Button, Form } from '@owlui/lib';
import { GlossaryFormProps } from './glossary-types';

export const GlossaryForm = ({ term, onHide, onSubmit }: GlossaryFormProps) => {
  const prefix = 'form-glossary-term';
  const [data, setData] = useState({
    name: term.name || '',
    description: term.description || '',
  });
  const handleFormChangeName = (ev: React.FormEvent<HTMLInputElement>) => {
    const name = ev.currentTarget.value;

    setData({ name, description: data.description });
  };
  const handleFormChangeDescription = (
    ev: React.FormEvent<HTMLInputElement>
  ) => {
    const description = ev.currentTarget.value;

    setData({ name: data.name, description: description });
  };
  const handleFormSubmit = () => {
    onSubmit(data);
  };
  const form = [
    {
      type: 'input',
      inputProps: {
        label: {
          content: 'Name',
          htmlFor: `${prefix}-name`,
        },
        control: {
          id: `${prefix}-name`,
          name: `${prefix}-name`,
          type: 'text',
          placeholder: 'Term...',
          value: data.name,
          onChange: handleFormChangeName,
        },
      },
    },
    {
      type: 'input',
      inputProps: {
        label: {
          content: 'Description',
          htmlFor: `${prefix}-description`,
        },
        control: {
          id: `${prefix}-description`,
          className: 'description',
          name: `${prefix}-description`,
          type: 'textarea',
          placeholder: 'Term Description...',
          value: data.description,
          onChange: handleFormChangeDescription,
        },
      },
    },
  ];

  return (
    <Form formData={form}>
      <div className="glossary-form-button-set d-flex justify-content-end">
        <Button
          className="glossary-cancel-button"
          onClick={onHide}
          variant="light"
        >
          Cancel
        </Button>
        <Button
          className="glossary-submit-button"
          variant="success"
          onClick={handleFormSubmit}
        >
          Save
        </Button>
      </div>
    </Form>
  );
};

export default {
  GlossaryForm,
};
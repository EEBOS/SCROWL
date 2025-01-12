import React from 'react';
import { Button } from '@owlui/lib';
import { SlidePosition } from '../../../page-editor.types';
import { Projects } from '../../../../../models';
import { FormBuilder, FormBuilderCommons } from '../../../../../components';
import { deepCopy } from './utils';
import {
  useActiveSlide,
  updateActiveSlide,
  useActiveSlidePosition,
} from '../../../page-editor-hooks';

export const RightPaneContentForm = () => {
  const project = Projects.useData();
  const slideData = useActiveSlide();
  const modules = deepCopy(project.modules);
  const position: SlidePosition = useActiveSlidePosition();

  const handleOnSubmit = () => {
    if (
      position.moduleIdx === -1 ||
      position.lessonIdx === -1 ||
      position.slideIdx === -1
    ) {
      console.error('Active slide position not set', position);
      return;
    }

    const module = modules[position.moduleIdx];

    if (!module || !module.lessons.length) {
      console.error('Unable to find active slide module', position, modules);
      return;
    }

    const lesson = module.lessons[position.lessonIdx];

    if (!lesson || !lesson.slides.length) {
      console.error('Unable to find active slide lesson', position, modules);
      return;
    }

    let slide = lesson.slides[position.slideIdx];

    if (!slide) {
      console.error('Unable to find active slide', position, modules);
      return;
    }

    slide = Object.assign(slide, slideData);
    Projects.update({ modules });
  };
  const SubmitAction = () => {
    return (
      <Button variant="success" onClick={handleOnSubmit}>
        Update
      </Button>
    );
  };

  const handleOnUpdate = (data: FormBuilderCommons['formData']) => {
    const slide = deepCopy(slideData);

    slide.template.elements = Object.assign(slide.template.elements, data);
    updateActiveSlide(slide);

    const targetFrame = document.getElementById(
      'template-iframe'
    ) as HTMLIFrameElement;

    if (!targetFrame || !targetFrame.contentWindow) {
      return;
    }

    targetFrame.contentWindow.postMessage(
      { updateManifest: slide.template },
      '*'
    );
  };

  if (
    !slideData.template ||
    !slideData.template.elements ||
    !Object.keys(slideData.template.elements).length
  ) {
    return <></>;
  }

  return (
    <div>
      <FormBuilder
        name={slideData.name}
        formData={slideData.template.elements}
        onUpdate={handleOnUpdate}
        SubmitAction={SubmitAction}
      />
    </div>
  );
};

export default {
  RightPaneContentForm,
};

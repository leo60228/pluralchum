import PKPencil from './pkPencil.svg';
import React from '@moonlight-mod/wp/react';
import HelpMessageClasses from '@moonlight-mod/wp/discord/components/common/HelpMessage.css';

export default function PKEditIcon() {
  return (
    <div className={(HelpMessageClasses as any).iconContainer}>
      <PKPencil className={HelpMessageClasses.icon}></PKPencil>
    </div>
  );
}

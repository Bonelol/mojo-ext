/**
 *
 * AttachmentList
 *
 */

import React, { useEffect } from 'react';
import { Modal, Checkbox } from 'antd';

import { Props } from 'src/types';
import './index.scss';
import { Attachment } from '@store/ticket/types';
import AttachmentView from './AttachmentView';
import { useSelections } from '@umijs/hooks';

export interface AttachmentsProps extends Props {
  token: string;
  attachments: Attachment[];
  onChange?: (attachments: Attachment[]) => void;
}

const AttachmentList = (props: AttachmentsProps) => {
  const { token, attachments, onChange } = props;
  const { selected, allSelected, isSelected, toggle, toggleAll, setSelected, partiallySelected } = useSelections(
    attachments || [],
  );

  const handleView = (url: string) => {
    Modal.info({
      style: {width: '90%'},
      className: 'attachment-preview-modal',
      width: '90%',
      maskClosable: true,
      content: <img src={url} style={{width: 'calc(100% - 40px)', maxWidth: '960px'}}></img>
    })
  }

  useEffect(() => {
    onChange && onChange(selected)
  }, [selected]);

  //Pre-select all
  useEffect(() => {  
    !allSelected && setSelected(attachments)
  }, [attachments]);

  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <div className="attachments">
      <div><Checkbox checked={allSelected} onClick={toggleAll} indeterminate={partiallySelected}>Select all</Checkbox></div>
      <div>
        {(attachments || []).map(a => (
          <AttachmentView key={a.id} token={token} attachment={a} onView={handleView} checked={isSelected(a)} onClick={() => toggle(a)}/>
        ))}
      </div>
    </div>
  );
}

export default AttachmentList;

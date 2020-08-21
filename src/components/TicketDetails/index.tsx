/**
 *
 * Ticket
 *
 */

import React, { useState, useEffect } from 'react';

import { Props } from 'src/types';
import './index.scss';
import { Input, Card } from 'antd';
import { Ticket, Attachment, Comment } from '@store/ticket/types';
import AttachmentList from '@components/AttachmentList';
import CommentList from '@components/CommentList';
import ContentEditor from '@components/ContentEditor';
import useLocalStorage from '@hooks/useLocalStorage';
import { getClient } from 'azure-devops-extension-api';
import { WorkItemTrackingRestClient } from 'azure-devops-extension-api/WorkItemTracking';

export interface TicketProps extends Props {
  ticket: Ticket;
  onChange: (value: Ticket) => void;
}

const TicketDetails = (props: TicketProps) => {
  const { ticket, onChange } = props;
  const [mojoToken] = useLocalStorage('mojoToken', '');
  const [internal, setInternal] = useState({} as Ticket);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternal({...internal, title: e.currentTarget.value})
    onChange({...ticket, title: e.currentTarget.value});
  }

  const handleChange = (value: string) => {
    setInternal({...internal, description: value})
    onChange({...ticket, description: value});
  }

  const handleImagePaste = (name: string, buffer: ArrayBuffer, resolve: (value?: string | PromiseLike<string>) => void) => {
    getClient(WorkItemTrackingRestClient).createAttachment(buffer, undefined, name).then(response => {
      resolve(response.url);
    })
  }

  const handleAttachmentsChange = (attachments: Attachment[]) => {
    onChange({...ticket, attachments});
  }

  const handleCommentsChange = (comments: Comment[]) => {
    onChange({...ticket, comments});
  }

  useEffect(() => {
    setInternal({...ticket})
  }, [ticket])

  return (
    <div className='ticket-details'>
      <Card title='Title & Description'>
        {ticket.title && <Input value={internal.title} onChange={handleInputChange} style={{ marginBottom: '6px' }}></Input>}
        {ticket.title && <ContentEditor content={internal.description} onChange={handleChange} onImagePaste={handleImagePaste}/>}
      </Card>
      <Card title='Attachments'>
        <AttachmentList attachments={internal.attachments} token={mojoToken} onChange={handleAttachmentsChange}/>
      </Card>
      <Card title='Comments'>
        <CommentList comments={internal.comments} onChange={handleCommentsChange}/>
      </Card>
    </div>
  );
}

export default TicketDetails;

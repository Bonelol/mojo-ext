/**
 *
 * CommentDetails
 *
 */

import React from 'react';

import { Props } from 'src/types';
import './index.scss';
import { Comment } from '@store/ticket/types';
import { useState as useMojoUserState } from '@store/mojoUser';


export interface CommentProps extends Props {
  comment: Comment;
}

const CommentDetails = (props: CommentProps) => {
  const { comment } = props;
  const users = useMojoUserState();
  const user = users.find(u => u.id === comment.user_id);

  return (
    <div className='comment'>
      <div>
        {user ? `${user.first_name} ${user.last_name}` : 'Unknown'}
        <span style={{margin: '2px 4px'}}>{comment.updated_on || comment.created_on}</span>
      </div>
      <div><pre style={{whiteSpace: 'pre-line', wordBreak: 'break-word'}} dangerouslySetInnerHTML={{__html: comment.body}}></pre></div>
    </div>
  );
}

export default CommentDetails;

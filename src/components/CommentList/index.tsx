/**
 *
 * CommentList
 *
 */

import React, { useEffect } from 'react';
import { useSelections } from '@umijs/hooks'
import { Props } from 'src/types';
import './index.scss';
import { Comment } from '@store/ticket/types';
import CommentDetails from '@components/CommentDetails';
import { Checkbox } from 'antd';

export interface CommentListProps extends Props {
  comments: Comment[];
  onChange?: (comments: Comment[]) => void;
}

const CommentList = (props: CommentListProps) => {
  const { comments, onChange } = props;
  const { selected, allSelected, isSelected, toggle, toggleAll, setSelected, partiallySelected } = useSelections(
    comments || [],
  );

  useEffect(() => {
    onChange && onChange(selected);
  }, [selected])

  //Pre-select all
  useEffect(() => {  
    !allSelected && setSelected(comments)
  }, [comments]);

  if(!comments || comments.length === 0) {
    return (<div className='comments'></div>);
  }

  return (
    <div className='comments'>
      <table>
        <thead>
          <tr>
            <td><Checkbox checked={allSelected} onClick={toggleAll} indeterminate={partiallySelected}></Checkbox></td>
            <td>Select All</td>
          </tr>
        </thead>
        <tbody>
          {(comments || []).map(s => (
          <tr key={s.id}>
            <td style={{verticalAlign: 'top'}}><Checkbox checked={isSelected(s)} onClick={() => toggle(s)}></Checkbox></td>
            <td><CommentDetails comment={s} key={s.id}></CommentDetails></td>
          </tr>))}
        </tbody>
      </table>
    </div>
  );
}

export default CommentList;

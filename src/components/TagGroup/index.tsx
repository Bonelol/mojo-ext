/**
 *
 * TagGroup
 *
 */

import React, { useState, ChangeEvent, useRef, useEffect } from 'react';

import { Props } from 'src/types';
import './index.scss';
import { Tag, Tooltip, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export interface TagGroupProps extends Props {
  value?: string[];
  onChange?: (value: string[]) => void;
}

const TagGroup = (props: TagGroupProps) =>{
  const { value, onChange } = props;
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const input = useRef<Input>(null);

  const handleClose = (removedTag: string) => {
    return () => onChange && onChange((value || []).filter(tag => tag !== removedTag));
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  };

  const handleInputConfirm = () => {
    if (inputValue && (value || []).indexOf(inputValue) === -1) {
      const added = [...(value || []), inputValue];
      onChange && onChange(added);
    }

    setInputVisible(false);
    setInputValue('')
  };

  useEffect(() => {
    input.current?.focus();
  }, [inputVisible])

  return (
    <div>
      {(value || []).map((tag) => {
        const isLongTag = tag.length > 20;
        const tagElem = (
          <Tag key={tag} closable={true} onClose={handleClose(tag)}>
            {isLongTag ? `${tag.slice(0, 20)}...` : tag}
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {inputVisible && (
        <Input
          ref={input}
          type="text"
          size="small"
          style={{ width: 78 }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!inputVisible && (
        <Tag className="site-tag-plus" onClick={showInput}>
          <PlusOutlined /> New Tag
        </Tag>
      )}
    </div>
  );
}

export default TagGroup;

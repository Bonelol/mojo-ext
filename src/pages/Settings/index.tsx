/**
 *
 * Settings
 *
 */

import React from 'react';

import './index.scss';
import { LoginForm } from '@components/LoginForm';
import { Divider } from 'antd';
import TagGroup from '@components/TagGroup';
import useExtensionStore from '@utils/useExtensionStore';

const Settings = () => {
  const [_, setMojo] = useExtensionStore('mojo');
  const [optionalFields, setOptionalFields] = useExtensionStore('optionalFields', [] as string[]);

  const handleSubmit = (value: any) => {
    setMojo(value);
  }

  const handleTagsChange = (value: string[]) => {
    setOptionalFields(value);
  }

  return (
  <div className="settings">
    <LoginForm onSubmit={handleSubmit} buttonTitle='Update'></LoginForm>
    <Divider />
    <div>
      <div className='settings-row'>
        <label className='mojo-label'>Optional Fields</label>
        <TagGroup value={optionalFields || []} onChange={handleTagsChange}/>
      </div>
    </div>
  </div>);
}

export default Settings;

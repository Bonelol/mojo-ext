import React, { ChangeEvent } from 'react';
import { Props } from 'src/types';
import { Input } from 'antd';

export interface OptionalFieldValue {
  name: string;
  referenceName: string;
  value: string;
}

export interface OptionalFieldsProps extends Props {
  value?: OptionalFieldValue[];
  onChange?: (value: OptionalFieldValue[]) => void;
}

const OptionalFields = (props: OptionalFieldsProps) => {
  const { value, onChange } = props;
  const handleChange = (field: OptionalFieldValue) => (event: ChangeEvent<HTMLInputElement>) => {
    const find = (value || []).find(v => v.referenceName === field.referenceName);
    find!.value = event.target.value;

    return onChange && onChange([...(value || [])])
  };

  return (
    <>
      {(value || []).map(field => (
        <div key={field.referenceName}>
          <label className="mojo-label">{field.name}</label>
          <Input value={field.value} onChange={handleChange(field)} />
        </div>
      ))}
    </>
  );
};

export default OptionalFields

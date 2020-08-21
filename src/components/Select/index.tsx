import React from 'react';
import { Select as AntdSelect } from 'antd';
import { SelectProps as AntdSelectProps, SelectValue } from 'antd/lib/select';

export interface SelectOption {
  value: string | number;
  text: string;
}

export interface SelectProps extends AntdSelectProps<SelectValue> {
  options: SelectOption[];
}

const Select = (props: SelectProps) => {
  const { options, onChange, ...otherProps } = props;
  let { defaultValue } = props;

  if(!options?.find(o => o.value === defaultValue)) {
    defaultValue = undefined;
    onChange && onChange('', options);
  } else {
    onChange && onChange(defaultValue as SelectValue, options);
  }

  return (
    <AntdSelect {...otherProps} onChange={onChange} defaultValue={defaultValue}>
      {(options || []).map(option => (
        <AntdSelect.Option key={option.value} value={option.value}>
          {option.text}
        </AntdSelect.Option>
      ))}
    </AntdSelect>
  );
};

export default Select

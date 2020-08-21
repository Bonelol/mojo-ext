import React, { useEffect, useState, useRef } from 'react';
import { Button } from "azure-devops-ui/Button";
import { Form, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Props, MojoSettings } from 'src/types';
import useLocalStorage from '@hooks/useLocalStorage';

import './index.scss';
import useExtensionStore from '@utils/useExtensionStore';
import { FormInstance } from 'antd/lib/form';

export interface LoginProps extends Props {
  buttonTitle?: string;
  onSubmit: (value: any) => void;
}

export const LoginForm = (props: LoginProps) => {
  const { onSubmit, buttonTitle } = props;
  const [form] = Form.useForm();
  const [mojo] = useExtensionStore<MojoSettings>('mojo');
  const [initialValues, setInitialValues] = useState({} as MojoSettings)

  const handleSubmit = (values: any) => {
    onSubmit(values)
  };

  useEffect(() => {
    setInitialValues(mojo);
  }, [mojo]);

  useEffect(() => {
    form.resetFields();
  }, [initialValues]);

  return (
    <>
      <div className="login-form-help">
        <div><a href='https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=preview-page'>How to generate personal access tokens?</a></div>
        <div>
          To grab your Mojo access key:
          <ul>
            <li>Login to your Mojo Helpdesk account</li>
            <li>Click the ‘profile’ link in the helpdesk navigation bar.</li>
            <li>Grab the access key listed in the Additional Information section.</li>
          </ul>
        </div>
      </div>        
      <Form form={form} onFinish={handleSubmit} className="login-form" initialValues={initialValues}>
        <Form.Item name="mojoEndpoint" rules={[{ required: true, message: 'Please input Mojo endpoint!' }]}>
          <Input
            prefix={<UserOutlined />}
            placeholder="Mojo Endpoint"
          />
        </Form.Item>
        <Form.Item name="mojoToken" rules={[{ required: true, message: 'Please input Mojo Personal Access Key!' }]}>
          <Input
            prefix={<LockOutlined />}
            placeholder="Mojo Token"
          />
        </Form.Item>
        <Form.Item>
          <Button primary={true} className="login-form-button" onClick={() => setInitialValues({} as any)}>Clear</Button>
          <Button primary={true} type="submit" className="login-form-button">{buttonTitle || 'Login'}</Button>
        </Form.Item>
      </Form>  
    </>);
  }
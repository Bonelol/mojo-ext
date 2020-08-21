import React from 'react';
import { useHistory } from 'react-router';

import './index.scss';
import { LoginForm } from '@components/LoginForm';
import useLocalStorage from '@hooks/useLocalStorage';

const Login = () => {
  const history = useHistory();
  const [, setMojoToken] = useLocalStorage('mojoToken', '');
  const [, setMojoEndpoint] = useLocalStorage('mojoEndpoint', '');

  const handleSubmit = (value: any) => {
    console.log(value);
    const {mojoToken, mojoEndpoint} = value;
    setMojoToken(mojoToken);
    setMojoEndpoint(mojoEndpoint);
    history.push('/mojo');
  }

  return (
  <div className="home">
    <LoginForm onSubmit={handleSubmit}></LoginForm>
  </div>);
};

export default Login;

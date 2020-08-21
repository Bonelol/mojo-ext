import React from 'react';
import { useHistory } from 'react-router';
import { Button, Affix } from 'antd';
import { SettingOutlined, CloseOutlined } from '@ant-design/icons';

import Header from '@components/Header';
import { Props } from 'src/types';
import './index.scss';

const Layout = (props: Props) => {  
  const history = useHistory();
  const { pathname } = history.location;
  const { event } = props;
  const getHeader = (path: string) => {
    switch (path) {
      case '/login' : {
        return <></>
      }
  
      case '/mojo' :
        return (
          <>
            <Button icon={<SettingOutlined />} onClick={() => history.push('/settings')}></Button>
            <span>Mojo</span>
            <Button onClick={() => history.push('/devOps')}>Next</Button>
          </>
        )
  
      case '/devOps' : 
        return (
          <>
            <Button icon={<SettingOutlined />} onClick={() => history.push('/settings')}></Button>
            <span>Azure DevOps</span>
            <Button onClick={() => event?.emit('create')}>Create</Button>
          </>
        )
  
      case '/settings' :  return <><Button icon={<CloseOutlined />} onClick={() => history.push('/mojo')}></Button></>

      default: {
        return <></>
      }
    }
  }

  return (
    <>
      {'/login' !== pathname &&        
        <Affix offsetTop={0}>        
          <Header children={getHeader(pathname)}/>
        </Affix>
      }
      <main className="layout">
        <div className="layout-main">{props.children}</div>
      </main>
    </>
  );
};

export default Layout;

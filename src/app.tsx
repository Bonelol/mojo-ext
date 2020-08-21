import React from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import 'antd/dist/antd.css';
import '@resource/css/base.css';
import '@resource/css/styles.css';
import history from './history';
import Layout from '@components/Layout/index';
import Login from '@pages/Login/index';
import NotFound from '@pages/NotFound/index';
import Mojo from "@pages/Mojo/index";
import DevOps from "@pages/DevOps/index";
import Settings from "@pages/Settings/index";
import { SyncEvent } from '@utils/SyncEvent';
import Final from "@pages/Final/index";
const App = () => {
    const event = new SyncEvent();
    return (<Router history={history}>
    <Layout event={event}>
      <Switch>
        <Redirect exact from="/" to="/mojo"/>
        <Redirect exact from="/index.html" to="/mojo"/>
        <Route path="/final" component={Final}/>
        <Route path="/settings" render={() => <Settings event={event}/>}/>
        <Route path="/devOps" render={() => <DevOps event={event}/>}/>
        <Route path="/mojo" render={() => <Mojo event={event}/>}/>
        <Route path="/login" component={Login}/>
        <Route component={NotFound}/>
      </Switch>
    </Layout>
  </Router>);
};
export default App;

import React from 'react';
import ReactDOM from 'react-dom';
import * as SDK from "azure-devops-extension-sdk";

import Provider from '@store/provider';
import App from './app';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import ErrorHandler from '@components/ErrorHandler';

SDK.init();

const Root = document.getElementById('Root');

ReactDOM.render(
  <Provider>
    <ErrorHandler>
      <App />
    </ErrorHandler>
  </Provider>,
  Root
);

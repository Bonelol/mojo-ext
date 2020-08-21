import { getHost } from 'azure-devops-extension-sdk';

export const mojoEndpoint = () => JSON.parse(window.localStorage.getItem('mojoEndpoint') || '""');
export const devOpsHost = () => `https://dev.azure.com/${getHost().name}`;
export const devOpsGraphApiHost = () => `https://dev.azure.com/${JSON.parse(window.localStorage.getItem('organization') || '""')}`;
export const BASE_NAME = 'index.html';

import { createMemoryHistory } from 'history';
import { BASE_NAME } from '@config/index';
import { isDev } from '@utils/isDev';

const history = createMemoryHistory; // isDev ? createHashHistory : createBrowserHistory;

export default history(); // default createBrowserHistory({basename: BASE_NAME});

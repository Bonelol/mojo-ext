import { Action, State, MojoToken } from './types';

const reducer = (state: State, action: Action) => {
  state = state || {};

  switch (action.type) {
    case 'MOJO_TOKEN_GET':
      return state;
    case 'MOJO_TOKEN_SET': {
      state = action.payload;
      return state;
    }
    default:
      return state;
  }
};

export default reducer;
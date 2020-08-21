import { Action, State, MojoUser } from './types';

const reducer = (state: State, action: Action) => {
  state = state || [];

  switch (action.type) {
    case 'MOJO_USER_FETCH':
      return state;
    case 'MOJO_USER_INIT':
      return [...(action.payload as MojoUser[])];
    case 'MOJO_USER_ADD': {
      return state;
    }
    case 'MOJO_USER_ADD_RANGE': {
      return [...state, ...(action.payload as MojoUser[])];
    }
    default:
      return state;
  }
};

export default reducer;
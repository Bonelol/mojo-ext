import { Action, State, Item } from './types';

const reducer = (state: State, action: Action) => {
  state = state || [];

  switch (action.type) {
    case 'ITEM_FETCH':
      return state;
    case 'ITEM_INIT':
      return [...(action.payload as Item[])];
    case 'ITEM_ADD': {
      return state;
    }
    default:
      return state;
  }
};

export default reducer;
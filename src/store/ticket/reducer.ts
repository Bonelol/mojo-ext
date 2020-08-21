import { Action, State, Ticket } from './types';

const reducer = (state: State, action: Action) => {
  state = state || [];

  switch (action.type) {
    case 'TICKET_FETCH':
      return state;
    case 'TICKET_INIT':
      return [...(action.payload as Ticket[])];
    case 'TICKET_ADD': {
      const { payload } = action;
      return [...state, payload];
    }
    default:
      return state;
  }
};

export default reducer;
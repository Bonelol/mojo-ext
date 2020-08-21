import { Provider as TicketProvider } from './ticket/index';
import { Provider as MojoTokenProvider } from './mojoToken/index';
import { Provider as ItemProvider } from './item/index';
import { Provider as MojoUserProvider } from './mojoUser/index';
const providers = [
  TicketProvider,
  MojoTokenProvider,
  ItemProvider,
  MojoUserProvider
];
export default providers;

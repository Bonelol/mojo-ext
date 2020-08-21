export type Reducer = (state: State, action: Action) => State;

export interface MojoToken {
  name: string;
  token: string;
  id: number;
}

export type State = MojoToken;

export type Action =
  | { type: 'MOJO_TOKEN_GET'; payload: MojoToken }
  | { type: 'MOJO_TOKEN_SET'; payload: MojoToken };
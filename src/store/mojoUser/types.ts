export type Reducer = (state: State, action: Action) => State;

export interface MojoUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  work_phone: string;
  cell_phone: string;
  home_phone: string;
  user_notes: string;
  company_id: number;
  password: string;
  is_active: boolean;
  role_id: number;
}

export type State = MojoUser[];

export type Action =
  | { type: 'MOJO_USER_INIT'; payload: MojoUser[] }
  | { type: 'MOJO_USER_FETCH'; payload: MojoUser[] }
  | { type: 'MOJO_USER_ADD'; payload: MojoUser }
  | { type: 'MOJO_USER_ADD_RANGE'; payload: MojoUser[] };
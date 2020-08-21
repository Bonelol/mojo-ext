export type Reducer = (state: State, action: Action) => State;

export interface Ticket {
  title: string;
  description: string;
  created_on: Date;
  update_on: Date;
  attachments: Attachment[];
  comments: Comment[];

  id: number;
}

export interface Comment {
  ticket_id: number;
  user_id: number;
  user_name: string;
  body: string;
  created_on: Date;
  updated_on: Date;
  id: number;
}

export interface Attachment {
  filename: string;
  ticket_id: number;
  content_type: string;
  id: number;
}

export interface User {
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

export type State = Ticket[];

export type Action =
  | { type: 'TICKET_INIT'; payload: Ticket[] }
  | { type: 'TICKET_FETCH'; payload: Ticket[] }
  | { type: 'TICKET_ADD'; payload: Ticket };
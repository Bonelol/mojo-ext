/**
 *
 * Mojo
 *
 */

import React, { useState, useEffect } from 'react';
import { Props } from 'src/types';
import './index.scss';
import { Ticket } from '@store/ticket/types';
import { get, getComments, getStaffNotes, getUser } from '@api/mojo';
import { Input, Button } from 'antd';
import TicketDetails from '@components/TicketDetails';
import  useLocalStorage from '@hooks/useLocalStorage';
import { useDispatch as useTicketDispatch, useState as useTicketState } from '@store/ticket';
import { useDispatch as useMojoUserDispatch, useState as useMojoUserState } from '@store/mojoUser';
import { MojoUser } from '@store/mojoUser/types';
import { Redirect } from 'react-router-dom';

const Mojo = (props: Props) => {
  const [mojoToken] = useLocalStorage('mojoToken', '');
  
  if(!mojoToken) {
    return <Redirect to='/login' />;
  }

  const [id, setId] = useState(0);
  const [ticket, setTicket] = useState<Ticket>({} as Ticket);
  const userDispatch = useMojoUserDispatch();
  const users = useMojoUserState();
  const ticketDisppatch = useTicketDispatch();
  const tickets = useTicketState();

  const onIdChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setId(parseInt(event.currentTarget.value));
  }

  const onClick = () => {
    Promise.all([get(id, mojoToken), getComments(id, mojoToken), getStaffNotes(id, mojoToken)]).then(values => {
      const [ticketR, commentsR, staffNotesR] = values;
      const comments = (commentsR.data || []).concat(staffNotesR.data || [])
      setTicket({...ticketR.data, comments: comments.reverse() });
      ticketDisppatch({type: 'TICKET_INIT', payload: [{...ticketR.data, comments: comments.sort((a, b) => a.updated_on > b.updated_on ? -1 : 1) }]});
    })
  }

  const onValueChange = (value: Ticket) => {
    ticketDisppatch({type: 'TICKET_INIT', payload: [value]});
  }

  useEffect(()=> {
    if (ticket && ticket.comments && ticket.comments.length > 0) {
      const userIds = users.map(c => c.id);
      const newUserIds = ticket.comments
        .filter(c => c.user_id > 0 && !userIds.includes(c.user_id))
        .map(c => c.user_id);

      Promise.all(newUserIds.map(id => getUser(id, mojoToken).catch(_ => Promise.resolve(null))))
      .then(users => {
        const newUsers = users.filter(u => u && u.data).map(u => u && u.data) as MojoUser[];
        userDispatch({type: 'MOJO_USER_ADD_RANGE', payload: newUsers});
      })
    }
  }, [ticket])

  return <div className="mojo">
    <div className='mojo-id'>
      <Input value={id} onChange={onIdChanged}></Input>
      <Button onClick={onClick}>Load Ticket</Button>
    </div>
    <TicketDetails ticket={ticket} onChange={onValueChange}></TicketDetails>
  </div>;
}

export default Mojo;

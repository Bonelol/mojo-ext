import axios from 'axios';

import { mojoEndpoint } from '@config/index';
import { PromiseReturn } from './types';
import { Ticket, Comment } from '@store/ticket/types';
import { MojoUser } from '@store/mojoUser/types';

export const get = async (id: number, token: string): PromiseReturn<Ticket> =>
    axios({
    url: `${mojoEndpoint()}/api/v2/tickets/${id}?access_key=${token}`,
    method: 'get'
    });

export const getComments = async (id: number, token: string): PromiseReturn<Comment[]> =>
    axios({
    url: `${mojoEndpoint()}/api/v2/tickets/${id}/comments?access_key=${token}`,
    method: 'get'
    });

export const getStaffNotes = async (id: number, token: string): PromiseReturn<Comment[]> =>
    axios({
    url: `${mojoEndpoint()}/api/v2/tickets/${id}/staff_notes?access_key=${token}`,
    method: 'get'
    });

export const postStaffNote = async (id: number, staffNote: string, token: string): PromiseReturn<Comment> =>
    axios({
    url: `${mojoEndpoint()}/api/v2/tickets/${id}/staff_notes?access_key=${token}`,
    method: 'post',
    data: { 'body': staffNote },
    
    });

export const modify = async (data: Ticket): PromiseReturn<Ticket> =>
    axios({
    url: `${mojoEndpoint()}/api/v2/todo/${data.id}`,
    method: 'PUT',
    data
    });

export const getUser = async (id: number, token: string): PromiseReturn<MojoUser> =>
    axios({
    url: `${mojoEndpoint()}/api/v2/users/${id}?access_key=${token}`,
    method: 'get'
    });

export const getAttachment = async (id: number, token: string): PromiseReturn<ArrayBuffer> =>
    axios({
    url: `${mojoEndpoint()}/api/v2/attachments/${id}?access_key=${token}`,
    method: 'get',
    responseType: 'arraybuffer'
    });

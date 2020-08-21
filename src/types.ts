/**
 * Global types
 */
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { SyncEvent } from '@utils/SyncEvent';

export interface Props {
  children?: JSX.Element[] | JSX.Element | React.ReactNode;
  className?: string;
  event?: SyncEvent;
}

export interface MojoSettings {
  mojoToken: string, 
  mojoEndpoint: string
}

export interface RoutedProps extends Props, RouteComponentProps {}

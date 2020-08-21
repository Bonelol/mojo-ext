import React, { ErrorInfo } from 'react';
import { Modal } from 'antd';

export interface ErrorHandlerProps {

}

export default class ErrorHandler extends React.Component<ErrorHandlerProps> {
  constructor(props: ErrorHandlerProps) {
    super(props);
  }

  handlePromiseError(ev: PromiseRejectionEvent) {
    console.log(ev);
    Modal.error({title: 'Error', content: ev.reason.message})
  }

  componentDidMount() {
    window.addEventListener('unhandledrejection', this.handlePromiseError)
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Modal.error({title: 'Error', content: error.message})
  }

  componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.handlePromiseError)
  }

  render() {
    return <div className='error-handler'>{this.props.children}</div>
  }
}
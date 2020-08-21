import React from 'react';
import cx from 'classnames';

import { Props } from 'src/types';

import './index.scss';

const Header = (props: Props) => {
  const {children} = props;

  return (
    <header className={cx(props.className, 'header')}>      
      <div className="header-content">
        {children}
      </div>
    </header>
  );
} 

export default Header;

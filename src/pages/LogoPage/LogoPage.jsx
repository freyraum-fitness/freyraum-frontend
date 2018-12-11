'use strict';
import React, {Component} from 'react';
import LogoAppBar from '../../components/LogoAppBar';
import './style.less';

class LogoPage extends Component {

  withBackButton() {
  };

  page() {
  };

  render() {
    return (
      <div>
        <LogoAppBar withBackButton={this.withBackButton()}>
          <div className='logo-page'>
            {this.page()}
          </div>
        </LogoAppBar>
      </div>
    );
  }

}

export default LogoPage;
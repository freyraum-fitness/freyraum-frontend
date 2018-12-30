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
        <div className='logo-page-container'>
          <LogoAppBar withBackButton={this.withBackButton()}/>
          <main className='logo-page'>
            {this.page()}
          </main>
        </div>
      </div>
    );
  }

}

export default LogoPage;
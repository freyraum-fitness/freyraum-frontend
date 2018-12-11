'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import connect from 'react-redux/es/connect/connect';
import {bindActionCreators} from 'redux';
import PageAppBar from './../../components/PageAppBar';
import Drawer from './../../components/Drawer';
import PageFooterNavigation from './../../components/PageFooterNavigation';
import './style.less';

class SimplePage extends Component {

  render() {
    const {currentUser, additionalActions, hideTitle, children} = this.props;
    return (
      <div>
        <PageAppBar additionalActions={additionalActions} hideTitle={hideTitle}/>
        <Drawer/>
        <main className='simple-page'>
          {children}
        </main>
        {
          currentUser
          ? <PageFooterNavigation/>
          : undefined
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.profile.user,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    // no actions needed so far
  }, dispatch),
  dispatch
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SimplePage);
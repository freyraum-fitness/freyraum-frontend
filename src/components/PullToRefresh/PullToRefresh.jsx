'use strict';
import React, {Component} from 'react';
import JsPullToRefresh from 'pulltorefreshjs';
import LoadingIndicator from './../LoadingIndicator';
import './styles.less';

class PullToRefresh extends Component {

  state = {
    updating: undefined
  };

  onRefresh = cb => {
    cb();
    this.props.onRefresh();
    this.setState({updating: true});
    setTimeout(() => this.setState({updating: false}), 500);
  };

  componentDidMount() {
    JsPullToRefresh.init({
      mainElement: '#pull-to-refresh',
      triggerElement: '#pull-to-refresh',
      refreshTimeout: 0,
      instructionsPullToRefresh: 'zum Aktualisieren herunterziehen',
      instructionsReleaseToRefresh: 'jetzt loslassen',
      onRefresh: this.onRefresh
    });
  }

  render() {
    const {pending, style} = this.props;
    const {updating} = this.state;
    let loading = undefined;
    if (pending || updating) {
      loading = <LoadingIndicator noLabel style={{paddingTop: '8px'}}/>;
    }
    return (
      <div style={style} id='pull-to-refresh' className='pull-to-refresh'>
        {loading}
        {this.props.children}
      </div>
    )
  }
}

export default PullToRefresh;
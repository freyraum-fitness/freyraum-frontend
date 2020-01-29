'use strict';
import React, {Component} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import './style.less'

class LoadingIndicator extends Component {

  render() {
    const {noLabel, label = 'lädt...', small, style} = this.props;
    return (
      <div className='loading-indicator'>
        <div className='table' style={style}>
          <div className='cell'>
            <CircularProgress
              color='primary'
              mode='indeterminate'
              className={small ? 'indicatorSmall' : 'indicator'}/>
            {
              noLabel
                ? undefined
                : <Typography color='primary'>{label}</Typography>
            }
          </div>
        </div>
      </div>
    );
  };
}

export default LoadingIndicator;

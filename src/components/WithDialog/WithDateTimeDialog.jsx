'use strict';
import React, {Component} from 'react';
import {GridDateTimeControl} from '../GridFormControl';
import IconButton from '@material-ui/core/IconButton';
import Edit from '@material-ui/icons/Edit';
import moment from 'moment';
import './style.less';
import * as Format from '../../utils/Format';

class WithDateTimeDialog extends Component {

  showDialog = () => {
    this.picker.open();
  };

  render() {
    const {value, editable, children, onChange} = this.props;
    return (
      <div>
        {
          editable
            ? <div className='with-dialog-children'>
                {children}
                <IconButton className='with-dialog-button' onClick={this.showDialog}>
                  <Edit color='inherit' className='with-dialog-edit-icon'/>
                </IconButton>
              </div>
            : children
        }

        {/* Invisible component - just used for date time selection */}
        <GridDateTimeControl
          ctrlRef={e => this.picker = e}
          style={{position: 'absolute', top: -9000, opacity: '0'}}
          id='news_validity_from'
          value={moment(value)}
          onChange={value => {
            if (!value.isValid()) {
              return;
            }
            onChange(value.format(Format.TIMESTAMP_FORMAT));
          }}
        />
      </div>
    );
  }
}

export default WithDateTimeDialog;
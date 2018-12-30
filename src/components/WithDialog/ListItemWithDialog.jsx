'use strict';
import React, {Component} from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Edit from '@material-ui/icons/Edit';
import {WithDialogDialog} from './WithDialog';
import {OnlyIf} from './../Auth';

class ListItemWithDialog extends Component {

  state = {
    show: false,
  };

  showDialog = () => {
    this.setState({show: true});
  };

  hideDialog = () => {
    this.setState({show: false});
  };

  render() {
    const {show} = this.state;
    const {icon, label, type, primary, editable, secondary, onChange, onCancel = () => {}, ...props} = this.props;
    return (
      <div>
        <ListItem onClick={editable ? this.showDialog : undefined} button={editable} {...props}>
          <ListItemIcon>
            {icon}
          </ListItemIcon>
          <ListItemText
            primary={primary}
            secondary={secondary}/>
          <OnlyIf isTrue={editable}>
            <ListItemSecondaryAction>
              <IconButton onClick={this.showDialog}>
                <Edit color='inherit'/>
              </IconButton>
            </ListItemSecondaryAction>
          </OnlyIf>
        </ListItem>

        <WithDialogDialog
          show={show}
          value={this.props.value}
          label={label}
          hideDialog={this.hideDialog}
          onChange={onChange}
          onCancel={onCancel}
          type={type}/>
      </div>
    );
  }
}

export default ListItemWithDialog;
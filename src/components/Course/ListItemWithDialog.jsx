'use strict';
import React, {Component} from 'react';
import ListItem from "@material-ui/core/ListItem";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import {GridInputControl} from "../GridFormControl";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {setPath} from "../../utils/RamdaUtils";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

class ListItemWithDialog extends Component {

  state = {
    show: false,
    value: undefined,
  };

  showDialog = () => {
    this.setState({show: true, value: this.props.value});
  };

  hideDialog = () => {
    this.setState({show: false, value: undefined});
  };

  render() {
    const {show, value} = this.state;
    const {icon, label, primary, secondary, onOk, onCancel = () => {}, ...props} = this.props;
    return (
      <div>
        <ListItem onClick={this.showDialog} button {...props}>
          <ListItemIcon>
            {icon}
          </ListItemIcon>
          <ListItemText
            primary={primary}
            secondary={secondary}/>
        </ListItem>

        <Dialog
          onClose={this.hideDialog}
          fullScreen={false}
          open={show}>
          <DialogTitle>
            {label + ' ändern'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={16}>
              <GridInputControl
                xs={12}
                label={label}
                type='number'
                value={value}
                onChange={(id, v) => this.setState(state => setPath(['value'], v, state))}
              />
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {onOk(value); this.hideDialog();}}
              color="primary">
              Ändern
            </Button>
            <Button
              onClick={() => {onCancel(); this.hideDialog();}}>
              Abbrechen
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default ListItemWithDialog;
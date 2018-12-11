'use strict';
import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import {GridTextControl} from './../GridFormControl';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import {togglePath} from '../../utils/RamdaUtils';

class ConfirmButton extends Component {

  state = {
    show: false
  };

  showDialog = () => {
    this.setState(state => togglePath(['show'], state));
  };

  hideDialog = () => {
    this.setState(state => togglePath(['show'], state));
  };

  render() {
    const {show} = this.state;
    const {onClick, confirmTitle, question, pending, children, fullScreen = false, iconButton = false, ...props} = this.props;

    return <div style={{display: 'inline-block', width: props.fullWidth ? '100%' : undefined}}>
      {
        iconButton
          ? <IconButton onClick={this.showDialog} {...props}>
            {children}
          </IconButton>
          : <Button onClick={this.showDialog} {...props}>
            {children}
          </Button>
      }

      <Dialog
        onClose={this.hideDialog}
        fullScreen={fullScreen}
        open={show}>
        <DialogTitle>
          {!!confirmTitle ? confirmTitle : 'Bist du sicher?'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={16}>
            <GridTextControl text={question}/>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {onClick(); this.hideDialog();}}
            color="primary"
            disabled={pending}>
            Ja
          </Button>
          <Button
            onClick={this.hideDialog}
            disabled={pending}>
            Nein
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  }

}

export default ConfirmButton;

'use strict';
import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import {GridTextControl} from './../GridFormControl';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import {setPath, togglePath} from '../../utils/RamdaUtils';
import {GridInputControl} from "../GridFormControl";
import OnlyIf from "../Auth/OnlyIf";
import {ValidationGroup} from "../Validation";

class ConfirmButton extends Component {

  state = {
    show: false,
    value: '',
  };

  showDialog = () => {
    this.setState(state => togglePath(['show'], state));
  };

  hideDialog = () => {
    this.setState(state => togglePath(['show'], state));
  };

  changeValue = value => {
    this.setState(state => setPath(['value'], value, state));
  };

  validateForm = () => {
    const result = this.validationGroup.validate();
    return result.valid;
  };

  setValidation = ref => {
    this.validationGroup = ref;
  };

  render() {
    const {show, value} = this.state;
    const {
      onClick,
      confirmTitle = 'Bist du sicher?',
      question,
      pending,
      children,
      fullScreen = false,
      iconButton = false,
      input = false,
      inputLabel,
      inputPlaceholder,
      inputValidators,
      yesValue = 'Ja',
      noValue = 'Nein',
      color,
      style,
      confirmStyle,
      variant,
      ...props
    } = this.props;

    return <div style={{display: 'inline-block', width: props.fullWidth ? '100%' : undefined}}>
      {
        iconButton
          ? <IconButton onClick={this.showDialog} color={color} style={style} variant={variant} {...props}>
            {children}
          </IconButton>
          : <Button onClick={this.showDialog} color={color} style={style} variant={variant} {...props}>
            {children}
          </Button>
      }

      <Dialog
        onClose={this.hideDialog}
        fullScreen={fullScreen}
        open={show}>
        <DialogTitle>{confirmTitle}</DialogTitle>
        <DialogContent>
          <Grid container spacing={16}>
            <GridTextControl text={question}/>
            <OnlyIf isTrue={input}>
              <ValidationGroup ref={this.setValidation}>
                <GridInputControl
                  multiline
                  variant='outlined'
                  label={inputLabel}
                  value={value}
                  validators={inputValidators}
                  onChange={(id, value) => this.changeValue(value)}/>
              </ValidationGroup>
            </OnlyIf>
            <Button
              fullWidth
              onClick={() => {
                if (!this.validationGroup || this.validateForm()) {
                  onClick(value);
                  this.hideDialog();
                }
              }}
              color={color}
              variant={variant}
              style={{...style, ...confirmStyle}}
              disabled={pending}>
              {yesValue}
            </Button>
            <Button
              fullWidth
              onClick={this.hideDialog}
              disabled={pending}>
              {noValue}
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  }

}

export default ConfirmButton;

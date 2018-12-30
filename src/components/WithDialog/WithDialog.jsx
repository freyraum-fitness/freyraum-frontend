'use strict';
import React from 'react';
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import {GridInputControl} from "../GridFormControl";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Edit from "@material-ui/icons/Edit";
import {setPath} from "../../utils/RamdaUtils";
import './style.less';

export class WithDialogDialog extends React.Component {

  state = {
    value: '',
  };

  componentWillReceiveProps(props) {
    this.state.value = props.value;
  }

  render() {
    const {value} = this.state;
    const {show, label, type, onChange, onCancel = () => {}, hideDialog, multiline} = this.props;

    return (
      <Dialog
        onClose={hideDialog}
        fullScreen={false}
        fullWidth
        open={show}>
        <DialogTitle>
          {label + ' ändern'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={16}>
            <GridInputControl
              xs={12}
              label={label}
              multiline={multiline}
              type={type}
              value={value}
              onChange={(id, v) => this.setState(state => setPath(['value'], v, state))}
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {onChange(value); hideDialog();}}
            color="primary">
            Ändern
          </Button>
          <Button
            onClick={() => {onCancel(); hideDialog();}}>
            Abbrechen
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

class WithDialog extends React.Component {

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
    const {label, editable, children, type, onChange, onCancel = () => {}, multiline} = this.props;
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

        <WithDialogDialog
          show={show}
          value={this.props.value}
          label={label}
          hideDialog={this.hideDialog}
          onChange={onChange}
          onCancel={onCancel}
          multiline={multiline}
          type={type}/>
      </div>
    );
  }
}

export default WithDialog;
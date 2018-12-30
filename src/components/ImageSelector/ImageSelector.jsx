'use strict';
import React from 'react';
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';
import {withRouter} from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import AvatarEditor from 'react-avatar-editor';
import {setPath} from '../../utils/RamdaUtils';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import IconAddPhotoAlternate from '@material-ui/icons/AddPhotoAlternate';
import IconZoomIn from '@material-ui/icons/ZoomIn';
import IconZoomOut from '@material-ui/icons/ZoomOut';
import IconRotateLeft from '@material-ui/icons/RotateLeft';
import IconRotateRight from '@material-ui/icons/RotateRight';
import IconCheck from '@material-ui/icons/Check';
import IconClose from '@material-ui/icons/Close';
import IconCrop from '@material-ui/icons/Crop';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Hammer from 'react-hammerjs';
import './style.less';
import LoadingIndicator from "../LoadingIndicator";
import {GridTextControl} from "../GridFormControl";

const options = {
  recognizers: {
    pinch: {enable: true}
  }
};

class ImageSelector extends React.Component {

  state = {
    rotate: 0,
    scale: 1,
    zoom: 1.5,
    ratio: {
      anchor: null,
      value: 1,
    },
    temp: {},
  };

  constructor(props) {
    super(props);
    this.state.ratio.value = props.ratio || 1;
  }

  handleUpload = e => {
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onload = (e) => {
      const temp = {
        file: file,
        dataUrl: e.target.result
      };
      this.setState(setPath(['temp'], temp, this.setState()));
    };
    this.setState(setPath(['error'], undefined, this.state));
    reader.readAsDataURL(file);
  };

  handleRequestSave = () => {
    const {file} = this.state.temp;
    if (!file) {
      this.setState(setPath(['error'], 'Bitte ein neues Bild auswählen', this.state));
      return;
    }

    // Upload the original image, transformation is done on the server to all required sizes
    const image = this.editor.getImage();
    image.toBlob(blob => {
      const formData = new FormData();
      formData.append('image', blob, file.name);
      this.props.onSave(formData);
    }, 'image/jpeg', 0.9);
  };

  handleRequestClose = () => {
    this.props.onClose();
    this.resetState();
  };

  setAvatarEditorRef = (editor) => {
    this.editor = editor;
  };

  resetState = () => {
    this.setState({acceptAGB: false, rotate: 0, error: undefined});
  };

  rotateLeft = () => {
    this.setState(setPath(['rotate'], this.state.rotate - 90, this.state));
  };

  rotateRight = () => {
    this.setState(setPath(['rotate'], this.state.rotate + 90, this.state));
  };

  zoomIn = () => {
    this.setState(setPath(['zoom'], this.state.zoom + 0.1, this.state));
  };

  zoomOut = () => {
    this.setState(setPath(['zoom'], Math.max(1, this.state.zoom - 0.1), this.state));
  };

  pinch = e => {
    this.setState(setPath(['scale'], e.scale, this.state));
  };

  pinchEnd = () => {
    const newState = setPath(['zoom'], Math.max(1, this.state.zoom * this.state.scale), this.state);
    this.setState(setPath(['scale'], 1, newState));
  };

  getInput = () => {
    return <input
      type={'file'}
      accept={'image/*'}
      name={'image'}
      style={{position: 'absolute', width: '100%', height: '100%', top: '0', left: '0', opacity: '0'}}
      onChange={this.handleUpload}
    />;
  };

  openMenu = event => {
    this.setState(setPath(['ratio', 'anchor'], event.currentTarget, this.state));
  };

  closeMenu = () => {
    this.setState(setPath(['ratio', 'anchor'], null, this.state));
  };

  getMenu = () => {
    const {anchor} = this.state.ratio;
    return <Menu
      open={!!anchor}
      anchorEl={anchor}
      onClose={this.closeMenu}>
      <MenuItem onClick={() => this.setState(setPath(['ratio', 'value'], 1, this.state), this.closeMenu)}>
        1:1
      </MenuItem>
      <MenuItem onClick={() => this.setState(setPath(['ratio', 'value'], 16 / 9, this.state), this.closeMenu)}>
        16:9
      </MenuItem>
    </Menu>
  };

  render() {
    const {open, pending, error, width, fullScreen} = this.props;
    const {rotate, zoom, scale, ratio, temp} = this.state;

    return (
      <Dialog open={open} fullScreen={fullScreen} onClose={this.handleRequestClose} className='image-selector'>
        <DialogTitle className='image-selector-title' disableTypography>
          <IconButton className='back-button' onClick={this.handleRequestClose}>
            <ArrowBack/>
          </IconButton>
          <Typography variant='h6' style={{flex: 1}}>
            Bild auswählen
          </Typography>
          <IconButton>
            <IconAddPhotoAlternate/>
            {this.getInput()}
          </IconButton>
        </DialogTitle>
        <DialogContent className='image-selector-content'>
          <Hammer options={options} onPinch={this.pinch} onPinchEnd={this.pinchEnd}>
            <div>
              <AvatarEditor
                ref={this.setAvatarEditorRef}
                image={temp.dataUrl}
                width={300 * ratio.value}
                height={300}
                border={[25, 300]}
                color={[255, 255, 255, 0.75]}
                scale={zoom * scale}
                rotate={rotate}
                style={{width: '100%', height: '100%'}}
              />
            </div>
          </Hammer>
          {
            temp.dataUrl
              ? undefined
              : <div className='image-selector-input-area'>
                  <IconButton>
                    <IconAddPhotoAlternate className='image-selector-input-area-icon'/>
                    {this.getInput()}
                  </IconButton>
                  {this.getInput()}
                </div>
          }
        </DialogContent>
        {
          pending
            ? <div style={{position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.75)'}}>
              <LoadingIndicator label='speichern...'/>
            </div>
            : undefined
        }
        <DialogActions className='image-selector-actions'>
          <Grid container justify={width === 'xs' ? 'center' : 'space-between'}>
            <Grid item>
              <IconButton onClick={this.zoomIn}>
                <IconZoomIn/>
              </IconButton>
              <IconButton onClick={this.zoomOut} disabled={zoom === 1}>
                <IconZoomOut/>
              </IconButton>
              <IconButton onClick={this.rotateLeft}>
                <IconRotateLeft/>
              </IconButton>
              <IconButton onClick={this.rotateRight}>
                <IconRotateRight/>
              </IconButton>
              <IconButton onClick={this.openMenu}>
                <IconCrop/>
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton onClick={this.handleRequestSave} color='primary' disabled={pending}>
                <IconCheck/>
              </IconButton>
              <IconButton onClick={this.handleRequestClose} color='secondary' disabled={pending}>
                <IconClose/>
              </IconButton>
            </Grid>
            {error ? <GridTextControl text={error} error={true}/> : undefined}
          </Grid>
        </DialogActions>
        {this.getMenu()}
      </Dialog>
    );
  };
}

export default compose(
  withRouter,
  withWidth(),
  withMobileDialog({breakpoint: 'xs'})
)(ImageSelector);
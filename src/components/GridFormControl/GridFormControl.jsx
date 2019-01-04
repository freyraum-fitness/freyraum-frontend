'use strict';
import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconVisibility from '@material-ui/icons/Visibility';
import IconVisibilityOff from '@material-ui/icons/VisibilityOff';
import {DatePicker, DateTimePicker} from 'material-ui-pickers';
import {view, setPath, assignPath, togglePath, findBy} from './../../utils/RamdaUtils';
import * as Format from './../../utils/Format';
import {ValidationControl} from './../Validation';
import LoadingIndicator from './../LoadingIndicator';
import Fuse from 'fuse.js';

import red from '@material-ui/core/colors/red';

const GridWrapper = ({children, xs = 12, sm, md, style, className}) =>
  <Grid item xs={xs} sm={sm} md={md}
        className={className}
        style={style}>
    {children}
  </Grid>;

export class GridTextControl extends Component {

  render() {
    const {text, error = false, xs, sm, md} = this.props;
    return <GridWrapper xs={xs} sm={sm} md={md}>
      <Typography style={{color: error ? red.A200 : undefined}}>
        {text}
        </Typography>
    </GridWrapper>;
  }
}

const GridFormControl = ({error, children, style, className, xs, sm, md}) =>
  <GridWrapper className={className} style={style} xs={xs} sm={sm} md={md}>
    <FormControl fullWidth error={error} margin='dense'>
      {children}
    </FormControl>
  </GridWrapper>;

export class GridInputControl extends ValidationControl {

  render() {
    const {valid, errors} = this.state;
    const {id, label, value, required, readonly, className,
      multiline, disableUnderline,
      type, endAdornment, onChange, xs, sm, md} = this.props;
    return <GridFormControl error={!valid} xs={xs} sm={sm} md={md} className={className}>
      <InputLabel htmlFor={id} required={required}>{label}</InputLabel>
      <Input
        id={id}
        value={value}
        type={type}
        multiline={multiline}
        disableUnderline={disableUnderline}
        rows={multiline ? 5 : undefined}
        readOnly={readonly}
        onChange={event => onChange(id, event.target.value)}
        endAdornment={endAdornment}/>
      {!valid ? <FormHelperText>{errors}</FormHelperText> : undefined}
    </GridFormControl>;
  }
}

export class GridCheckboxControl extends ValidationControl {

  render() {
    const {valid, errors} = this.state;
    const {id, value, onChange, label, xs, sm, md} = this.props;
    return <GridFormControl error={!valid} xs={xs} sm={sm} md={md}>
      <FormControlLabel
        control={
          <Checkbox
            id={id}
            checked={value} // has to be value, because of ValidationControl
            onChange={event => onChange(id, event.target.checked)}
          />
        }
        label={label}
      />
      {!valid ? <FormHelperText>{errors}</FormHelperText> : undefined}
    </GridFormControl>;
  }
}

export class GridSwitchControl extends ValidationControl {

  render() {
    const {valid, errors} = this.state;
    const {id, value, onChange, label, xs, sm, md} = this.props;
    return <GridFormControl error={!valid} xs={xs} sm={sm} md={md}>
      <FormControlLabel
        control={
          <Switch
            id={id}
            checked={value} // has to be value, because of ValidationControl
            onChange={event => onChange(id, event.target.checked)}
          />
        }
        label={label}
      />
      {!valid ? <FormHelperText>{errors}</FormHelperText> : undefined}
    </GridFormControl>;
  }
}

export class GridPasswordControl extends ValidationControl {

  constructor(props) {
    super(props);
    this.state = setPath(['showPassword'], false, this.state);
  }

  toggleShowPassword = () => {
    this.setState(togglePath(['showPassword'], this.state));
  };

  render() {
    const {showPassword, valid, errors} = this.state;
    const {id, className, label, required, value, onChange} = this.props;
    return <GridFormControl error={!valid} className={className}>
      <InputLabel htmlFor={id} required={required}>{label}</InputLabel>
      <Input
        id={id}
        value={value}
        type={showPassword ? 'text' : 'password'}
        onChange={event => onChange(id, event.target.value)}
        endAdornment={
          <InputAdornment position='end'>
            <IconButton onClick={this.toggleShowPassword}>
              {showPassword ? <IconVisibilityOff/> : <IconVisibility/>}
            </IconButton>
          </InputAdornment>
      }/>
      {!valid ? <FormHelperText>{errors}</FormHelperText> : undefined}
    </GridFormControl>;
  }
}

export class GridItemSelectControl extends ValidationControl {

  constructor(props) {
    super(props);
    this.state = assignPath([], {search: '', anchor: null}, this.state);
  }

  getValue = v => {
    const {valueProp = 'value'} = this.props;
    if (typeof valueProp === 'function') {
      return valueProp(v)
    }
    return view(valueProp, v);
  };

  openSelect = event => {
    this.setState(assignPath([], {search: '', anchor: event.currentTarget} , this.state));
  };

  closeSelect = () => {
    this.setState(setPath(['anchor'], null, this.state));
  };

  getSearchItem = () => {
    if (this.props.searchEnabled) {
      return (
        <MenuItem>
          <TextField
            value={this.state.search}
            onChange={event => this.setState(setPath(['search'], event.target.value, this.state))}
            placeholder='Suchen...'/>
        </MenuItem>
      );
    }
  };

  getFilteredData = () => {
    const {search} = this.state;
    let filtered = this.props.values;
    if (search !== '') {
      const options = {
        shouldSort: false,
        tokenize: true,
        threshold: 0.2,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
          'firstname',
          'lastname'
        ]
      };
      const fuse = new Fuse(filtered, options);
      filtered = fuse.search(search);
    }
    return filtered;
  };

  render() {
    const {valid, anchor, errors} = this.state;
    const {
      id,
      value = '',
      keyProp = 'key',
      valueProp = 'value',
      label,
      onChange,
      readonly,
      xs,
      sm,
      md
    } = this.props;
    const data = this.getFilteredData();
    let displayValue = '';
    let actualValue = findBy(keyProp, data, value);
    if (!!actualValue) {
      if (typeof(valueProp) === 'function') {
        displayValue = valueProp(actualValue);
      } else {
        displayValue = actualValue[valueProp];
      }
    }
    return <GridFormControl xs={xs} sm={sm} md={md} error={!valid}>
      <InputLabel shrink={true} htmlFor={id}>{label}</InputLabel>
      <Input
        value={displayValue}
        input={<Input id={id}/>}
        onClick={this.openSelect}
        disabled={readonly}/>
      <Menu open={!!anchor} anchorEl={anchor} onClose={this.closeSelect}>
        {this.getSearchItem()}
        {data.map((v, idx) =>
          <MenuItem key={v.id || idx} value={view(keyProp, v)} onClick={() => {onChange(view(keyProp, v)); this.closeSelect()}}>
            {this.getValue(v)}
          </MenuItem>
        )}
      </Menu>
      {!valid ? <FormHelperText>{errors}</FormHelperText> : undefined}
    </GridFormControl>
  }

}

export class GridDateControl extends ValidationControl {

  render() {
    const {valid, errors} = this.state;
    const {value, label, readonly, onChange, clearable, xs, md} = this.props;
    return <GridFormControl xs={xs} md={md} error={!valid}>
      <DatePicker
        value={value}
        onChange={onChange}
        label={label}
        format={Format.DATE_FORMAT_WITH_DAY}
        okLabel={'OK'}
        cancelLabel={'ABBRECHEN'}
        todayLabel={'HEUTE'}
        clearLabel={'LÖSCHEN'}
        showTodayButton={!clearable}
        allowKeyboardControl={false}
        disableOpenOnEnter={true}
        clearable={clearable}
        InputProps={{disabled: readonly, style: {marginTop: '13px'}}}
      />
      {!valid ? <FormHelperText>{errors}</FormHelperText> : undefined}
    </GridFormControl>;
  }
}

export class GridDateTimeControl extends ValidationControl {

  render() {
    const {valid, errors} = this.state;
    const {value, label, readonly, onChange, ctrlRef, style, xs, md} = this.props;
    return <GridFormControl xs={xs} md={md} error={!valid} style={style}>
      <DateTimePicker
        ref={ctrlRef}
        value={value}
        autoOk
        onChange={onChange}
        label={label}
        ampm={false}
        format={Format.TIMESTAMP_FORMAT_DE}
        okLabel={'OK'}
        cancelLabel={'ABBRECHEN'}
        todayLabel={'HEUTE'}
        showTodayButton
        disableOpenOnEnter={readonly}
        InputProps={{disabled: readonly, style: {marginTop: '13px'}}}
      />
      {!valid ? <FormHelperText>{errors}</FormHelperText> : undefined}
    </GridFormControl>;
  }
}

export class GridButtonControl extends Component {

  render() {
    const {
      variant = 'contained',
      size = 'medium',
      color = 'primary',
      className,
      label,
      icon,
      onClick,
      pending,
      disabled
    } = this.props;
    return <GridFormControl className={className}>
      <Button
        variant={variant}
        size={size}
        color={color}
        disabled={disabled || pending}
        onClick={onClick}>
        {label}
        {icon}
      </Button>
      {
        pending
          ? <div style={{position: 'absolute', width: '100%', height: '100%'}}>
            <LoadingIndicator noLabel small/>
          </div>
          : undefined
      }
    </GridFormControl>;
  }
}
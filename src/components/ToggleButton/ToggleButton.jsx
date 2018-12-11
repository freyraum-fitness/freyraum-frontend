'use strict';
import React, {Component} from 'react';
import Button from '@material-ui/core/Button';

class ToggleButton extends Component {

  render() {
    const {selected, label, onClick, style, color = 'secondary', customColor} = this.props;
    const customStyle = customColor
      ? {
          borderColor: selected ? 'unset' : customColor,
          color: 'black',
          backgroundColor: selected ? customColor : 'unset'
        }
      : {};
    return <Button
      style={{
        ...customStyle,
        ...style
      }}
      variant={selected ? 'raised' : 'outlined'}
      size='small'
      onClick={onClick}
      color={color}>
      {label}
    </Button>;
  }
}

export default ToggleButton;
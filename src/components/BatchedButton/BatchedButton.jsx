'use strict';
import React, {Component} from 'react';
import Badge from '@material-ui/core/Badge';
import ToggleButton from './../ToggleButton';

class BatchedButton extends Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.selected !== this.props.selected
      || nextProps.badgeContent !== this.props.badgeContent
      || nextProps.label !== this.props.label;
  }

  render() {
    const {selected, badgeContent, ...props} = this.props;
    const button = <ToggleButton selected={selected} {...props}/>;

    if (selected) {
      return button;
    }
    return (
      <Badge
        badgeContent={badgeContent}
        color='primary'>
        {button}
      </Badge>
    );
  }
}

export default BatchedButton;
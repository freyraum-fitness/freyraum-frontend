'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import {withStyles} from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LoadingIndicator from './../LoadingIndicator';

const sliderStyles = () => ({
  container: {
    position: 'relative'
  },
  stepper: {
    background: 'none',
    height: '32px',
    width: '100%',
    padding: '0',
    justifyContent: 'center',
  }
});

class Slider extends Component {

  state = {
    index: 0
  };

  handleChangeIndex = index => {
    this.setState({index: index});
  };

  render() {
    const {loading, classes, children = []} = this.props;
    const {index} = this.state;

    return (
      <div className={classes.container}>
        <SwipeableViews
          disableLazyLoading={true}
          index={index}
          slideStyle={{width: 'unset'}}
          onChangeIndex={this.handleChangeIndex}>
          {loading ? <LoadingIndicator/> : children}
        </SwipeableViews>

        <div>
          <MobileStepper
            type="dots"
            steps={children.length}
            activeStep={index % children.length}
            position='static'
            className={classes.stepper}
          />
        </div>
      </div>
    );
  };
}

export default compose(
  withStyles(sliderStyles)
)(Slider);
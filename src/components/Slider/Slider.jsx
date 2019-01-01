'use strict';
import React from 'react';
import SlickSlider from 'react-slick';
import {setPath} from './../../utils/RamdaUtils';
import './style.less';

class Slider extends React.Component {

  appendDots = dots => {
    let updated = Object.assign([], dots);
    for (const i in dots) {
      const idx = Number(i);
      const dot = dots[idx];
      if (dot.props.className === 'slick-active') {
        if (idx >= 1) {
          updated = setPath([idx - 1, 'props', 'className'], 'slick-active-m1', updated);
        }
        if (idx >= 2) {
          updated = setPath([idx - 2, 'props', 'className'], 'slick-active-m2', updated);
        }
        if (idx >= 3) {
          updated = setPath([idx - 3, 'props', 'className'], 'slick-active-m3', updated);
        }
        if (idx < dots.length - 1) {
          updated = setPath([idx + 1, 'props', 'className'], 'slick-active-p1', updated);
        }
        if (idx < dots.length - 2) {
          updated = setPath([idx + 2, 'props', 'className'], 'slick-active-p2', updated);
        }
        if (idx < dots.length - 3) {
          updated = setPath([idx + 3, 'props', 'className'], 'slick-active-p3', updated);
        }
        break;
      }
    }
    return <ul>{updated}</ul>;
  };

  render() {
    const {children, ...props} = this.props;
    return (
      <SlickSlider dots swipeToSlide variableWidth infinite={false} arrows={false}
                   className={'slider variable-width'}
                   appendDots={this.appendDots}
                   slidesToShow={1} slidesToScroll={1} {...props}>
        {children}
      </SlickSlider>
    );
  }
}

export default Slider;
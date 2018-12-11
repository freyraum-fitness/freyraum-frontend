'use react';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import withRouter from 'react-router-dom/withRouter';

class NotFound extends Component {
  render() {
    const {location} = this.props;
    console.warn(location);
    return (
      <div>
        <h1>404</h1>
        <p>Die angeforderte Seite '{location.pathname}' existiert nicht.</p>
        <p>zurück</p>
      </div>
    );
  }
}

export default compose(
  withRouter
)(NotFound);

'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {CookiesProvider} from 'react-cookie';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import MomentUtils from '@date-io/moment';
import {MuiPickersUtilsProvider} from 'material-ui-pickers';
import moment from 'moment';
import deLocale from 'moment/locale/de';
import App from './App.jsx';
import {Store} from './model';
import {Theme} from './theme';
import './style.less';

moment.updateLocale("de", deLocale);

ReactDOM.render(
  <Provider store={Store}>
    <CookiesProvider>
      <HashRouter>
        <MuiThemeProvider theme={Theme}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <App/>
          </MuiPickersUtilsProvider>
        </MuiThemeProvider>
      </HashRouter>
    </CookiesProvider>
  </Provider>,
  document.getElementById("app")
);

if (process.env.NODE_ENV !== 'production') {
  module.hot.accept();
}

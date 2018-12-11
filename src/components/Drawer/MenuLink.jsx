'use strict';
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {Link} from 'react-router-dom';
import './style.less';

const MenuLink = ({to, label, icon, onClick}) => (
  <Link to={to} className='not-decorated' onClick={onClick}>
    <ListItem button>
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      <ListItemText primary={label}/>
    </ListItem>
  </Link>
);

export default MenuLink;
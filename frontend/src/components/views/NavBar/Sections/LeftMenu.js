import React from 'react';
import { Menu, Tooltip } from 'antd';
import { Link } from 'react-router-dom';

function LeftMenu(props) {
  return (
    <Menu mode={props.mode}>
      <Menu.Item key="home">
        <Tooltip title="Home">
          <Link to="/">Home</Link>
        </Tooltip>
      </Menu.Item>
    </Menu>
  )
}

export default LeftMenu
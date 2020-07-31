/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Menu, Tooltip } from 'antd';
import { withRouter, Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from '../../../../_actions/user_actions';

function RightMenu(props) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user)

  const logoutHandler = () => {
    dispatch(logoutUser())
      .then(response => {
        if (response.payload.success) {
          props.history.push('/login')
        } else {
          alert('로그아웃에 실패했습니다.')
        }
      })
  };

  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="login" style={{ maxWidth: '120px' }}>
          <Tooltip title="Log In">
            <Link to="/login">Log In</Link>
          </Tooltip>
        </Menu.Item>
      </Menu>
    )
  } else {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="profile" style={{ maxWidth: '120px' }}>
          <Tooltip title="Profile">
            <Link to={`/userProfile/${user.userData && user.userData._id}`}> Profile</Link>
          </Tooltip>
        </Menu.Item>
        <Menu.Item key="logout">
          <Tooltip title="Log Out">
            <a onClick={logoutHandler}>Log Out</a>
          </Tooltip>
        </Menu.Item>
      </Menu>
    )
  }
}

export default withRouter(RightMenu);
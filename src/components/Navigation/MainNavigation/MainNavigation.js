import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import MobileToggle from '../MobileToggle/MobileToggle';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';

import './MainNavigation.css';

class mainNavigation extends Component {

  render() {
    return (
      <nav className="main-nav">
        <MobileToggle onOpen={this.props.onOpenMobileNav} />
        <div className="main-nav__logo">
          <NavLink to="/">
            <Logo />
          </NavLink>
        </div>
        <div className="spacer" />
        <ul className="main-nav__items">
          <NavigationItems
            isAuth={this.props.isAuth}
            onLogout={this.props.onLogout}
            isLoading={this.props.isLoading}
            userId={this.props.userId}
            token={this.props.token}
            state={this.props.state} />
        </ul>
      </nav>
    );
  }
}

export default mainNavigation;

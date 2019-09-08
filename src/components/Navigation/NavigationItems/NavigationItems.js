import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';
import {Dropdown} from 'react-bootstrap';

import './NavigationItems.css';

const navItems = [
  { id: 'feed', text: 'Feed', link: '/', auth: true },
  { id: 'my-profile', text: 'Profile', link: '/posts', auth: true},
  { id: 'my-bucket', text: 'Bucket', link: '/my-bucket', auth: true},
  { id: 'my-map', text: 'Map', link: '/my-map', auth: true},
  { id: 'rankings', text: 'Rank', link: '/rankings', auth: true},
  { id: 'login', text: 'Login', link: '/', auth: false},
  { id: 'signup', text: 'Signup', link: '/signup', auth: false}
];


class navigationItems extends Component {
  state = this.props.state;

  getUserName = () => {
    let userId = localStorage.getItem('userId');
    let token = localStorage.getItem('token');
    fetch('http://localhost:8080/auth/user/' + userId, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Fetching user name failed!');
        }
        return res.json();
      })
      .then(resData => {
        this.setState({
          name: resData.userObj.name
        });
      })
      .catch(err => {
        console.log(err);
      });
    }
    
  componentDidMount() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (userId && token){
      this.setState({
        loaded: true,
        name:  this.getUserName()
      })
    }
  }
  
  render () {
    if (this.props.isAuth && (!this.state)){
      this.componentDidMount();
    }
    return ([
        ...navItems.filter(item => item.auth === this.props.isAuth).map(item => (
          <li
            key={item.id}
            className={['navigation-item', this.props.mobile ? 'mobile' : ''].join(' ')}
          >
            <NavLink to={item.link} exact onClick={this.props.onChoose}>
              {item.text}
            </NavLink>
          </li>
        )),
        this.props.isAuth && this.state && this.state.name && (
          <li className="navigation-item" key="logout">
            <Dropdown>
              <Dropdown.Toggle variant="Warning" id="dropdown-basic">
                Hello {this.state.name}!
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item 
                  style={{color: "purple"}} 
                  onClick={this.props.onLogout}>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        )]);
  }
}

export default navigationItems;

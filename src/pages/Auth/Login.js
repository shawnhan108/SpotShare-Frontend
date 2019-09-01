import React, { Component } from 'react';

import Input from '../../components/Form/Input/Input';
import Button from '../../components/Button/Button';
import { required, length, email } from '../../util/validators';
import Auth from './Auth';
import { Form, Carousel} from 'react-bootstrap';
import './Auth.css';

class Login extends Component {
  state = {
    loginForm: {
      email: {
        value: '',
        valid: false,
        touched: false,
        validators: [required, email]
      },
      password: {
        value: '',
        valid: false,
        touched: false,
        validators: [required, length({ min: 5 })]
      },
      formIsValid: false
    }
  };

  inputChangeHandler = (input, value) => {
    this.setState(prevState => {
      let isValid = true;
      for (const validator of prevState.loginForm[input].validators) {
        isValid = isValid && validator(value);
      }
      const updatedForm = {
        ...prevState.loginForm,
        [input]: {
          ...prevState.loginForm[input],
          valid: isValid,
          value: value
        }
      };
      let formIsValid = true;
      for (const inputName in updatedForm) {
        formIsValid = formIsValid && updatedForm[inputName].valid;
      }
      return {
        loginForm: updatedForm,
        formIsValid: formIsValid
      };
    });
  };

  inputBlurHandler = input => {
    this.setState(prevState => {
      return {
        loginForm: {
          ...prevState.loginForm,
          [input]: {
            ...prevState.loginForm[input],
            touched: true
          }
        }
      };
    });
  };

  render() {
    return (
      <div>
      <Carousel style={{paddingBottom: '2rem'}} slide={true}>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="Norway.jpg"
              alt="Iceland"
            />
            <Carousel.Caption>
              <h1>Welcome to SpotShare</h1>
              <p style={{fontSize: '120%'}}>Showcase your breathtaking landscape photos</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="Aletsch Glacier.jpg"
              alt="Norway"
            />
            <Carousel.Caption>
              <h1>Welcome to SpotShare</h1>
              <p style={{fontSize: '120%'}}>Share your favourate locations with others</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="French Polynesia.jpg"
              alt="Switzerland"
            />
            <Carousel.Caption>
              <h1>Welcome to SpotShare</h1>
              <p style={{fontSize: '120%'}}>Map your own bucket list for photo trips</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
        <div style={{paddingBottom: '2rem'}}>
        <Auth>
        <Form
          onSubmit={e =>
            this.props.onLogin(e, {
              email: this.state.loginForm.email.value,
              password: this.state.loginForm.password.value
            })
          }
        >
          <div className="login_input">
            <Input
              id="email"
              label="Email"
              type="email"
              control="input"
              onChange={this.inputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, 'email')}
              value={this.state.loginForm['email'].value}
              valid={this.state.loginForm['email'].valid}
              touched={this.state.loginForm['email'].touched}
              placeholder = "username@example.ca"
              className="login_input"
            />
          </div>
          <div className="login_input">
            <Input
              id="password"
              label="Password"
              type="password"
              control="input"
              onChange={this.inputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, 'password')}
              value={this.state.loginForm['password'].value}
              valid={this.state.loginForm['password'].valid}
              touched={this.state.loginForm['password'].touched}
            />
          </div>
          <div className="login_input">
            <Button  design="raised" type="submit" loading={this.props.loading}>
              Login
            </Button>
          </div>
          
        </Form>
      </Auth>
      </div>
      </div>
    );
  }
}

export default Login;

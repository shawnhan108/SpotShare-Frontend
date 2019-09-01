import React, { Component } from 'react';

import Input from '../../components/Form/Input/Input';
import Button from '../../components/Button/Button';
import { required, length, email } from '../../util/validators';
import Auth from './Auth';
import './Auth.css';
import { Form, Carousel} from 'react-bootstrap';

class Signup extends Component {
  state = {
    signupForm: {
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
      name: {
        value: '',
        valid: false,
        touched: false,
        validators: [required]
      },
      formIsValid: false
    }
  };

  inputChangeHandler = (input, value) => {
    this.setState(prevState => {
      let isValid = true;
      for (const validator of prevState.signupForm[input].validators) {
        isValid = isValid && validator(value);
      }
      const updatedForm = {
        ...prevState.signupForm,
        [input]: {
          ...prevState.signupForm[input],
          valid: isValid,
          value: value
        }
      };
      let formIsValid = true;
      for (const inputName in updatedForm) {
        formIsValid = formIsValid && updatedForm[inputName].valid;
      }
      return {
        signupForm: updatedForm,
        formIsValid: formIsValid
      };
    });
  };

  inputBlurHandler = input => {
    this.setState(prevState => {
      return {
        signupForm: {
          ...prevState.signupForm,
          [input]: {
            ...prevState.signupForm[input],
            touched: true
          }
        }
      };
    });
  };

  render() {
    return (
      <div>
        <Carousel style={{paddingBottom: '2rem'}}>
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
        <Form onSubmit={e => this.props.onSignup(e, this.state)}>
        <div className="login_input">
          <Input
            id="email"
            label="Email"
            type="email"
            control="input"
            onChange={this.inputChangeHandler}
            onBlur={this.inputBlurHandler.bind(this, 'email')}
            value={this.state.signupForm['email'].value}
            valid={this.state.signupForm['email'].valid}
            touched={this.state.signupForm['email'].touched}
            placeholder="username@example.ca"
          />
          <Form.Text className="text-muted">
              We'll never share your email with anyone else.
          </Form.Text>
        </div>
        <div className="login_input">
          <Input
            id="name"
            label="Full Name"
            type="text"
            control="input"
            onChange={this.inputChangeHandler}
            onBlur={this.inputBlurHandler.bind(this, 'name')}
            value={this.state.signupForm['name'].value}
            valid={this.state.signupForm['name'].valid}
            touched={this.state.signupForm['name'].touched}
            placeholder="John Smith"
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
            value={this.state.signupForm['password'].value}
            valid={this.state.signupForm['password'].valid}
            touched={this.state.signupForm['password'].touched}
          />
        </div>
        <div className="login_input">
          <Button design="raised" type="submit" loading={this.props.loading}>
            Signup
          </Button>
          </div>
        </Form>
      </Auth>
      </div>
      </div>
    );
  }
}

export default Signup;

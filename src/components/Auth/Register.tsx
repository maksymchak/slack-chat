import React, { useState } from 'react';
import md5 from 'md5';
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase';

const Register = () => {
  const [validate, setValidate] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    errors: [],
    loading: false,
  });

  const isFormValid = () => {
    const errors = [];
    // @ts-ignore
    let error;

    if (isFormEmpty(validate)) {
      error = { message: 'Fill in all fields' };
      // @ts-ignore
      setValidate({
        ...validate,
        errors: errors.concat(error),
      });

      return false;
    }
    if (!isPasswordValid(validate)) {
      error = { message: 'Password is invalid' };

      setValidate(prevState => ({
        ...prevState,
        errors: prevState.errors.concat(error),
      }));
      return false;
    }
    return true;
  };

  const isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };

  const isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    }
    if (password !== passwordConfirmation) {
      return false;
    }
    return true;
  };

  const displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  const handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (isFormValid()) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(createdUser => {
          console.log(createdUser);
          createdUser.user
            .updateProfile({
              displayName: username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUser.user.email,
              )}?d=identicon`,
            })
            .then(() => {
              saveUser(createdUser).then(() => {
                console.log('user saved');
              });
            })
            .catch(err => {
              console.error(err);
              this.setState(prevState => ({
                errors: prevState.errors.concat(err),
                loading: false,
              }));
            });
        })
        .catch(err => {
          console.error(err);
          this.setState(prevState => ({
            errors: prevState.errors.concat(err),
            loading: false,
          }));
        });
    }
  };

  const saveUser = createdUser => {
    return firebase
      .database()
      .ref('users')
      .child(createdUser.user.uid)
      .set({
        name: createdUser.user.displayName,
        avatar: createdUser.user.photoURL,
      });
  };

  const handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName))
      ? 'error'
      : '';
  };

  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" icon color="orange" textAlign="center">
          <Icon name="puzzle piece" color="orange" />
          Register for DevChat
        </Header>
        <Form onSubmit={handleSubmit} size="large">
          <Segment size="large">
            <Form.Input
              fluid
              name="username"
              icon="user"
              iconPosition="left"
              placeholder="Username"
              onChange={handleChange}
              value={username}
              type="text"
            />
            <Form.Input
              fluid
              name="email"
              icon="mail"
              iconPosition="left"
              placeholder="Email Address"
              onChange={handleChange}
              value={email}
              className={handleInputError(errors, 'email')}
              type="email"
            />
            <Form.Input
              fluid
              name="password"
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              onChange={handleChange}
              value={password}
              className={handleInputError(errors, 'password')}
              type="password"
            />
            <Form.Input
              fluid
              name="passwordConfirmation"
              icon="repeat"
              iconPosition="left"
              placeholder="Password Confirmation"
              onChange={handleChange}
              value={passwordConfirmation}
              className={handleInputError(errors, 'password')}
              type="password"
            />
            <Button
              disabled={loading}
              className={loading ? 'loading' : ''}
              color="orange"
              fluid
              size="large"
            >
              Submit
            </Button>
          </Segment>
        </Form>
        {errors.length > 0 && (
          <Message error>
            <h3>Error</h3>
            {displayErrors(errors)}
          </Message>
        )}
        <Message>
          Already a user? <Link to="/login">Login</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Register;

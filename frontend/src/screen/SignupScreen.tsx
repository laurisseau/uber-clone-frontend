import { Button, Form } from 'react-bootstrap';
import NavbarComp from '../components/NavbarComp';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Context } from '../Provider';

const SignupScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [number, setNumber] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const { state } = useContext(Context);
  const { userInfo } = state;

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const { data } = await axios.post('/api/auth/signup', {
        username,
        number,
        email,
        password,
      });
      if (data) {
        alert('user created');
        window.location.href = '/login';
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (userInfo) {
      window.location.href = '/';
    }
  }, [userInfo]);

  return (
    <div>
      <NavbarComp />
      <div
        className="d-flex align-items-center justify-content-center mt-3"
        style={{ height: '100vh' }}
      >
        <div style={{ width: '350px' }}>
          <h1 className="mb-4" style={{ fontWeight: '400' }}>
            Signup to request a ride.
          </h1>
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-4" controlId="username">
              <Form.Control
                type="username"
                placeholder="Enter your username"
                className="address-form-height"
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUsername(e.target.value)
                }
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="number">
              <Form.Control
                type="number"
                placeholder="Enter your number"
                className="address-form-height"
                value={number}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNumber(e.target.value)
                }
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="email">
              <Form.Control
                type="email"
                placeholder="Enter your email"
                className="address-form-height"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="password">
              <Form.Control
                type="password"
                placeholder="Enter your password"
                className="address-form-height"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="confirmPassword">
              <Form.Control
                type="password"
                placeholder="Confirm your password"
                className="address-form-height"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value)
                }
              />
            </Form.Group>

            <Button
              type="submit"
              variant="dark"
              className="mb-4 w-100"
              size="lg"
            >
              Sign up
            </Button>

            <div className="text-center">
              <p>
                Already a member? <a href="/login">Login</a>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignupScreen;

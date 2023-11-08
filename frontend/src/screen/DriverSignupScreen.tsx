import { Button, Form } from 'react-bootstrap';
import NavbarComp from '../components/NavbarComp';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Context } from '../Provider';
import { Link } from 'react-router-dom';

const DriverSignupScreen: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [number, setNumber] = useState<string>('');
  const [firstname, setFirstname] = useState<string>('');
  const [lastname, setLastname] = useState<string>('');
  const [car, setCar] = useState<string>('');
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
      const { data } = await axios.post('/api/auth/driver/signup', {
        username,
        number,
        firstname,
        lastname,
        car,
        password,
      });
      if (data) {
        window.location.href = '/';
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
        
      >
        <div style={{ width: '350px' }}>
          <h1 className="mb-4" style={{ fontWeight: '400' }}>
            Signup to drive.
          </h1>
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-4" controlId="firstname">
              <Form.Control
                type="firstname"
                placeholder="Enter your firstname"
                className="address-form-height"
                value={firstname}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFirstname(e.target.value)
                }
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="lastname">
              <Form.Control
                type="lastname"
                placeholder="Enter your lastname"
                className="address-form-height"
                value={lastname}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setLastname(e.target.value)
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
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUsername(e.target.value)
                }
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="car">
              <Form.Control
                type="car"
                placeholder="Enter your car color, year, make, and model"
                className="address-form-height"
                value={car}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCar(e.target.value)
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
                Already a member? <Link to="/LoginOptions/Driver/Login">Login</Link>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default DriverSignupScreen;

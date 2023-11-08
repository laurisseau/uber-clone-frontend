import { Button, Form } from 'react-bootstrap';
import NavbarComp from '../components/NavbarComp';
import { useContext, useState, useEffect } from 'react';
import { Context } from '../Provider';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DriverLoginScreen: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { state, dispatch: ctxDispatch } = useContext(Context);
  const { userInfo } = state;

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/auth/driver/login', {
        username,
        password,
      });

      if (data) {
        ctxDispatch({ type: 'USER_SIGNIN', payload: data });
        localStorage.setItem('userInfo', JSON.stringify(data));
        window.location.href = '/driverhome';
      }
    } catch (err: any) {
      console.log(err.response.data);
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
        className="d-flex align-items-center justify-content-center"
        style={{ height: '100vh' }}
      >
        <div style={{ width: '350px' }}>
          <h1 className="mb-4" style={{ fontWeight: '400' }}>
            Login to start driving.
          </h1>
          <Form onSubmit={submitHandler}>
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

            <Button
              type="submit"
              variant="dark"
              className="mb-4 w-100"
              size="lg"
            >
              Sign in
            </Button>

            <div className="text-center">
              <p>
                Not a member?{' '}
                <Link to="/SignupOptions/Driver/Signup">Register</Link>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default DriverLoginScreen;

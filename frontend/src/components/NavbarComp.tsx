import { Nav, Navbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '../Provider';

const NavbarComp: React.FC = () => {
  const { state, dispatch: ctxDispatch } = useContext(Context);
  const { userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({
      type: 'USER_SIGNOUT',
      payload: null,
    });
    localStorage.removeItem('userInfo');
    window.location.href = '/';
  };

  return (
    <Navbar className="nav-bg">
      <Container className="justify-content-end">
        {userInfo ? (
          <Nav>
            <div className="user-nav me-1">Hello, {userInfo.username}!</div>
            <button onClick={signoutHandler} className="nav-button-active">
              Sign out
            </button>
          </Nav>
        ) : (
          <Nav className="mt-2 mb-2">
            <Link to="/login" className="nav-button-not-active me-1">
              Log in
            </Link>
            <Link to="/signup" className="nav-button-active">
              Sign up
            </Link>
          </Nav>
        )}
      </Container>
    </Navbar>
  );
};

export default NavbarComp;

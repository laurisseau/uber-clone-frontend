import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface OptionsProps {
  driverText?: string;
  userText?: string;
  driverLink?: string;
  userLink?: string;
}

const Options: React.FC<OptionsProps> = (props) => {
  const { driverText, userText, userLink, driverLink } = props;
  const validDriverLink = driverLink || '';
  const validUserLink = userLink || '';
  return (
    <div>
      <Container
        className="d-flex justify-content-around align-items-end"
        style={{ height: '75vh' }}
      >
        <div className="text-center" style={{ width: '375px' }}>
          <Link className="link" to={validDriverLink}>
            <h2 style={{ fontWeight: '700', fontSize: '36px' }}>
              {driverText}
            </h2>
          </Link>
          <div className="border-bottom border-dark mt-5"></div>
        </div>
        <div className="text-center" style={{ width: '375px' }}>
          <Link className="link" to={validUserLink}>
            <h2 style={{ fontWeight: '700', fontSize: '36px' }}>{userText}</h2>
          </Link>
          <div className="border-bottom border-dark mt-5"></div>
        </div>
      </Container>
    </div>
  );
};

export default Options;

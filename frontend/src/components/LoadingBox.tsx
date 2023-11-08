import Spinner from 'react-bootstrap/Spinner';

interface LoadingBoxProps {
  size?: number; 
}

const LoadingBox: React.FC<LoadingBoxProps> = ({ size = 50 }) => {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{ width: size, height: size }}
    >
      <span className="visually-hidden"></span>
    </Spinner>
  );
};

export default LoadingBox;

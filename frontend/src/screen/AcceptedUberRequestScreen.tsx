import NavbarComp from '../components/NavbarComp';
import profileImg from '../img/profile_pic.jpg';
import driverCarLogo from '../img/driver_car.png';
import { Button } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Context } from '../Provider';

const AcceptedUberRequestScreen: React.FC = () => {
  const { state } = useContext(Context);
  const { userInfo } = state;
  const params = useParams();
  const { id } = params;

  const [uberRequest, setUberRequest] = useState<any>({});
  const [token, setToken] = useState<String | undefined>('');
  const duration: string = uberRequest?.duration;
  const [lng, setLng] = useState<number>(0);
  const [lat, setLat] = useState<number>(0);

  useEffect(() => {
    const getUberRequest = async () => {
      try {
        setToken(userInfo?.token);
        if (id && token) {
          const { data } = await axios.get(`/api/user/uberRequest/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(data);

          console.log(data.driver);

          if (data) {
            setUberRequest(data);
            setLng(data.origin?.lng || 0);
            setLat(data.origin?.lat || 0);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    getUberRequest();
  }, [id, token, userInfo?.token]);

  function formatPhoneNumber(phoneNumber: any) {
    // Remove non-digit characters from the phone number
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Check if the cleaned phone number is empty
    if (cleaned.length === 0) {
      return ''; // Return an empty string if the phone number is empty
    }

    // Format the phone number with parentheses and dashes
    const formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(
      3,
      6
    )}-${cleaned.slice(6)}`;

    return formatted;
  }

  return (
    <div>
      <NavbarComp />
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{
          backgroundImage: 'linear-gradient(to bottom, #000, #EA8953)',
          height: '100vh',
          color: 'white',
        }}
      >
        <div className="text-center">
          <div className="" style={{ position: 'relative' }}>
            <img
              src={profileImg}
              alt="profileImg"
              className="rounded-circle"
              style={{ width: '250px', height: '250px' }}
            />
            <img
              src={driverCarLogo}
              alt="profileImg"
              className="rounded-circle"
              style={{
                width: '80px',
                height: '80px',
                position: 'absolute',
                top: '79%',
                left: '35%',
              }}
            />
          </div>
          <div className="mt-5">
            <h2>You are picking up Devin</h2>

            <p className="mb-2">Phone: 407-236-3478</p>
            <p className="mb-2">Location: 601 wood dr.</p>

            <Button variant="dark" className="mt-3" size="lg">
              Arrived
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptedUberRequestScreen;

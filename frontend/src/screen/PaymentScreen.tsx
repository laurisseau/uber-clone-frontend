import { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/PaymentForm';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/esm/Container';
import { Context } from '../Provider';
import NavbarComp from '../components/NavbarComp';

const PaymentScreen: React.FC = () => {
  const [token, setToken] = useState<String | undefined>('');
  const params = useParams();
  const { id } = params;
  const { state } = useContext(Context);
  const { userInfo } = state;
  const [clientData, setClientData] = useState('');
  const stripePromise = loadStripe(
    'pk_test_51O7anbFCF4jieceDq2NUjzKx6bcLyRhGQgCVvyIwXUqkcdoTvn4Vs3MpzJN4y3IEPdogaiVmGgf991RwJfeWZZEY00cbG7cMhc'
  );

  useEffect(() => {
    const getUberRequest = async () => {
      try {
        setToken(userInfo?.token);
        if (id && token) {
          const { data } = await axios.get(`/api/user/uberRequest/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (data) {
            setClientData(data.payment.clientSecret);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    getUberRequest();
  }, [id, token, userInfo?.token]);

  return (
    <div>
      <NavbarComp />
      <Container className="vh-100 d-flex align-items-center justify-content-center">
        <div>
          {stripePromise && clientData && (
            <Elements
              options={{ clientSecret: clientData }}
              stripe={stripePromise}
            >
              <PaymentForm />
            </Elements>
          )}
        </div>
      </Container>
    </div>
  );
};

export default PaymentScreen;

import { useContext, useState } from 'react';
import axios from 'axios';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { PaymentElement } from '@stripe/react-stripe-js';
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router-dom';
import { Context } from '../Provider';

const PaymentForm: React.FC = () => {
  const params = useParams();
  const { id } = params;
  const { state } = useContext(Context);
  const { userInfo } = state;

  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: '',
      },
      redirect: 'if_required',
    });

    if (error) {
      console.log(error);
      alert('Payment failed');
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/payment/paidUberRequest/${id}`,
          {
            headers: { Authorization: `Bearer ${userInfo?.token}` },
          }
        );

        if (data) {
          window.location.href = `/uberRequest/${id}`;
        }
      } catch (err) {
        console.log(err);
      }
    }
    setIsProcessing(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement />

      {isProcessing ? (
        <Button className="w-100 mt-4 p-2" variant="dark" size="lg" disabled>
          Processing...
        </Button>
      ) : (
        <Button
          type="submit"
          className="w-100 mt-4 p-2"
          variant="dark"
          size="lg"
        >
          Pay
        </Button>
      )}
    </form>
  );
};

export default PaymentForm;

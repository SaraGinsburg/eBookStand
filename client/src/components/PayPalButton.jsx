import { Spinner, Stack } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PayPalButton = ({ total, onPaymentError, onPaymentSuccess, disabled }) => {
  const [payPalClient, setPayPalClient] = useState(null);

  useEffect(() => {
    const paypalKey = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal');
      setPayPalClient(clientId);
    };
    paypalKey();
  }, [payPalClient]);

  return !payPalClient ? (
    <Stack direction='row' spacing={4} alignSelf='center'>
      <Spinner mt={20} thickness='2px' speed='0.65s' emptyColor='gray.200' color='orange.500' size='xl' />
    </Stack>
  ) : (
    <PayPalScriptProvider options={{ clientId: payPalClient }}>
      <PayPalButtons
        disabled={disabled}
        forceReRender={[total(), payPalClient]}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: total(),
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then((details) => {
            onPaymentSuccess(data);
          });
        }}
        onError={(err) => {
          onPaymentError(err);
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;

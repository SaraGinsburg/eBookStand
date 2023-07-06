import {
  Badge,
  Box,
  Flex,
  Divider,
  Heading,
  Link,
  Stack,
  Text,
  useColorModeValue as mode,
  useToast,
  useDisclosure,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as ReactLink, useNavigate } from 'react-router-dom';
import { PhoneIcon, EmailIcon, ChatIcon } from '@chakra-ui/icons';
import { createOrder, resetOrder } from '../redux/actions/orderActions.js';
import { useState, useEffect, useCallback } from 'react';
import CheckoutItem from './CheckoutItem';
import PayPalButton from './PayPalButton';
import { resetCart } from '../redux/actions/cartActions.js';
import PaymentErrorModal from './PaymentErrorModal.jsx';
import PaymentSuccessModal from './PaymentSuccessModal.jsx';

const CheckoutOrderSummary = () => {
  const { onOpen: onErrorOpen, onClose: onErrorClose, isOpen: isErrorOpen } = useDisclosure();
  const { onOpen: onSuccessOpen, onClose: onSuccessClose, isOpen: isSuccessOpen } = useDisclosure();
  const colorMode = mode('gray.600', 'gray.400');
  const cartItems = useSelector((state) => state.cart);
  const { cart, subtotal, expressShipping } = cartItems;
  const user = useSelector((state) => state.user);
  const { userInfo } = user;
  const shippingInfo = useSelector((state) => state.order);
  const { error, shippingAddress } = shippingInfo;
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const shipping = useCallback(
    () => (expressShipping === 'true' ? 14.99 : subtotal <= 1000 ? 4.99 : 0),
    [expressShipping, subtotal]
  );

  const total = useCallback(
    () => Number(shipping() === 0 ? Number(subtotal) : Number(subtotal) + shipping()).toFixed(2),
    [shipping, subtotal]
  );

  useEffect(() => {
    if (!error) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [error, shippingAddress, total, expressShipping, shipping, dispatch]);

  const onPaymentSuccess = async (data) => {
    onSuccessOpen();
    dispatch(
      createOrder({
        orderItems: cart,
        shippingAddress,
        paymentMethod: data.paymentSource,
        paymentDetails: data,
        shippingPrice: shipping(),
        totalPrice: total(),
        userInfo,
      })
    );
    dispatch(resetOrder());
    dispatch(resetCart());
    //openSuccess()
  };

  const onPaymentError = () => {
    onErrorOpen();
  };

  return (
    <Stack spacing='8' rounded='xl' padding='8' width='full'>
      <Heading size='md'> Order Summary</Heading>
      {cart.map((item) => (
        <CheckoutItem key={item.id} cartItem={item} />
      ))}

      <Stack spacing='6'>
        <Flex justify='space-between'>
          <Text fontWeight='medium' color={colorMode}>
            Subtotal
          </Text>
          <Text fontWeight='medium' color={colorMode}>
            ${subtotal}
          </Text>
        </Flex>
        <Flex justify='space-between'>
          <Text fontWeight='medium' color={colorMode}>
            Shipping
          </Text>
          <Text fontWeight='medium' color={colorMode}>
            {shipping() === 0 ? (
              <Badge rounded='full' px='2' fontSize='0.8em'>
                Free
              </Badge>
            ) : (
              `$${shipping()}`
            )}
          </Text>
        </Flex>
        <Flex justify='space-between'>
          <Text fontSize='lg' fontWeight='semibold'>
            Total
          </Text>
          <Text fontSize='xl' fontWeight='semibold'>
            ${Number(total())}
          </Text>
        </Flex>
      </Stack>
      <PayPalButton
        total={total}
        onPaymentError={onPaymentError}
        onPaymentSuccess={onPaymentSuccess}
        disabled={buttonDisabled}
      />
      <Box align='center'>
        <Text fontSize='sm'>Have questions or need help to complete order?</Text>
        <Flex direction='row' align='center' justifyContent='space-between' color={mode('orange.500', 'orange.100')}>
          <Flex align='center'>
            <ChatIcon />
            <Text m='2'>Live Chat</Text>
          </Flex>
          <Flex align='center'>
            <PhoneIcon />
            <Text m='2'>Phone</Text>
          </Flex>
          <Flex align='center'>
            <EmailIcon />
            <Text m='2'>Email</Text>
          </Flex>
        </Flex>
      </Box>
      <Divider bg={mode('gray.400', 'gray.800')} />
      <Flex justifyContent='center'>
        <p>or </p>
        <Link as={ReactLink} to='/products' ml='1' fontWeight='semibold'>
          continue shopping
        </Link>
      </Flex>
      <PaymentErrorModal onClose={onErrorClose} onOpen={onErrorOpen} isOpen={isErrorOpen} />
      <PaymentSuccessModal onClose={onSuccessClose} onOpen={onSuccessOpen} isOpen={isSuccessOpen} />
    </Stack>
  );
};

export default CheckoutOrderSummary;

import {
  Box,
  Button,
  Td,
  Th,
  Tr,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Text,
  Alert,
  Stack,
  Spinner,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Spacer,
  Wrap,
  Accordion,
  AccordionButton,
  AccordionPanel,
  Flex,
  Textarea,
  AccordionItem,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeReview } from '../redux/actions/adminActions';
import { getProducts, resetProductError } from '../redux/actions/productActions';

const ReviewsTab = () => {
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.admin);
  const { error, loading } = admin;
  const productInfo = useSelector((state) => state.products);
  const { products, reviewRemoval } = productInfo;
  const toast = useToast();

  useEffect(() => {
    dispatch(getProducts());
    dispatch(resetProductError());
    if (reviewRemoval) {
      toast({ description: 'Review has been removed.', status: 'success', isClosable: true });
    }
  }, [reviewRemoval, dispatch, toast, loading]);

  const onRemoveReview = (productId, reviewId) => {
    dispatch(removeReview(productId, reviewId));
  };

  return (
    <Box>
      {error && (
        <Alert status='error'>
          <AlertIcon />
          <AlertTitle>Oops!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {loading ? (
        <Wrap justify='center'>
          <Stack direction='row' spacing='4'>
            <Spinner mt='20' thickness='2px' speed='0.65s' emptyColor='gray.200' color='orange.500' size='xl' />
          </Stack>
        </Wrap>
      ) : (
        <Box>
          {products.length > 0 &&
            products.map((product) => (
              <Box id={product._id}>
                <Accordion allowToggle>
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box flex='1'>
                          <Flex>
                            <Text mr='8px' fontWeight='semibold'>
                              {product.name}
                            </Text>
                            <Spacer />
                            <Text mr='8px' fontWeight='semibold'>
                              ({product.reviews.length} Reviews)
                            </Text>
                          </Flex>
                        </Box>
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb='4'>
                      <TableContainer>
                        <Table size='sm'>
                          <Thead>
                            <Tr>
                              <Th>Username</Th>
                              <Th>Rating</Th>
                              <Th>Title</Th>
                              <Th>Comment</Th>
                              <Th>Created</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {product.reviews.map((rev) => (
                              <Tr key={rev._id}>
                                <Td>{rev.name}</Td>
                                <Td>{rev.rating}</Td>
                                <Td>{rev.title}</Td>
                                <Td>
                                  <Textarea isDisabled value={rev.comment} size='sm' />
                                </Td>
                                <Td>{new Date(rev.createdAt).toDateString()}</Td>
                                <Td>
                                  <Button
                                    variant='outline'
                                    colorScheme='red'
                                    onClick={() => onRemoveReview(product._id, rev._id)}>
                                    Remove Review
                                  </Button>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </Box>
            ))}
        </Box>
      )}
    </Box>
  );
};

export default ReviewsTab;

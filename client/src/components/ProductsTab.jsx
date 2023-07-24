import {
  Box,
  Th,
  Tr,
  Table,
  Thead,
  Tbody,
  useDisclusure,
  Text,
  Alert,
  Stack,
  Spinner,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Wrap,
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, resetProductError } from '../redux/actions/productActions';

import ProductTableItem from './ProductTableItem';
import AddNewProduct from './AddNewProduct';

const ProductsTab = () => {
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.admin);
  const { error, loading } = admin;
  const productInfo = useSelector((state) => state.products);
  const { products, productUpdate } = productInfo;
  const toast = useToast();

  useEffect(() => {
    dispatch(getProducts());
    dispatch(resetProductError());
    if (productUpdate) {
      toast({ description: 'Product has been updated.', status: 'success', isClosable: true });
    }
  }, [productUpdate, dispatch, toast]);

  return (
    <Box>
      <Accordion allowToggle>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex='1' textAlign='right'>
                <Box>
                  <Text mr='8px' fontWeight='semibold'>
                    Add a new Product
                  </Text>
                </Box>
              </Box>
            </AccordionButton>
          </h2>
          <AccordionPanel pb='4'>
            <Table>
              <Tbody>
                <AddNewProduct />
              </Tbody>
            </Table>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Table variant='simple' size='lg'>
        <Thead>
          <Tr>
            <Th>Image</Th>
            <Th>Description</Th>
            <Th>Brand & Name</Th>
            <Th>Category & Price</Th>
            <Th>Stock & new Badge</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.length > 0 && products.map((p) => <ProductTableItem key={p._id} id={p._id} product={p} />)}
        </Tbody>
      </Table>
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
        <Box></Box>
      )}
    </Box>
  );
};

export default ProductsTab;

import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "./context/GlobalWrapper";
import {
  Button,
  Container,
  Box,
  FormControl,
  Input,
  Text,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'
import { AiOutlineSearch, AiOutlinePlus } from "react-icons/ai";
import Row from "./components/Row";
import DrawerExample from "./components/DrawerExample";

function App() {
  const { FetchUsers, events, search, onOpen, totalEvents } = useContext(GlobalContext);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5); // Nombre d'éléments par page

  const onChangeHandler = (e) => {
    search(e.target.value);
  };

  const fetchPaginatedUsers = (page) => {
     FetchUsers(page, pageSize)     
  };

  useEffect(() => {
    fetchPaginatedUsers(page); // Charge les utilisateurs pour la page actuelle
  }, [page]);

  const totalPages = Math.ceil(totalEvents / pageSize) !== 0 ? Math.ceil(totalEvents / pageSize) : 1; // Nombre total de pages

  const handleNextPage = () => {
    console.log('page < totalPages : ', page < totalPages);
    console.log('page : ', page, ' - total pages', totalPages);
    
    
    if (page < totalPages) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="App">
      <Container maxW={'full'} p="4" fontSize={'18px'}>
        <Box rounded="lg" boxShadow="base" p="4">
          <Box mt="2" gap={'2'} mb="4" display={'flex'}>
            <FormControl>
              <Input type="text" onKeyUp={onChangeHandler} placeholder="Search events" />
            </FormControl>
          </Box>
        </Box>

        <Box mt="5" rounded={'lg'} boxShadow="base">
          <Box p="4" display={'flex'} justifyContent="space-between">
            <Text fontSize="xl" fontWeight="bold">
              List Events
            </Text>
            <Button
              colorScheme="teal"
              variant="outline"
              maxW="3000px"
              minW="150px"
              leftIcon={<AiOutlinePlus fontSize={'20px'} />}
              onClick={onOpen}
            >
              Add Event
            </Button>
          </Box>
          <TableContainer>
            <Table variant="simple">
              <TableCaption>Events list</TableCaption>
              <Thead>
                <Tr>
                  <Th>Avatar</Th>
                  <Th>Title</Th>
                  <Th>Description</Th>
                  <Th>Date</Th>
                  <Th>Category</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {events?.map(({ id, title, description, date, category }) => {
                  return <Row key={id} id={id} title={title} description={description} date={date} category={category} />;
                })}
              </Tbody>
            </Table>
          </TableContainer>

          {/* Pagination Controls */}
          <Box p="4" display="flex" justifyContent="space-between" alignItems="center">
            <Button
              colorScheme="teal"
              variant="outline"
              onClick={handlePreviousPage}
              isDisabled={page === 1}
            >
              Previous
            </Button>
            <Text>
              Page {page} of {totalPages}
            </Text>
            <Button
              colorScheme="teal"
              variant="outline"
              onClick={handleNextPage}
              isDisabled={page === totalPages}
            >
              Next
            </Button>
          </Box>

          <DrawerExample />
        </Box>
      </Container>
    </div>
  );
}

export default App;
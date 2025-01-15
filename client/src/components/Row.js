import React from 'react'
import {
    Tr,
    Td,
    Box,
    Button, 
    Avatar
  } from '@chakra-ui/react'
  import { AiFillEdit, AiFillDelete } from "react-icons/ai";
  import { GlobalContext } from "./../context/GlobalWrapper";
  import { useContext } from "react";



function Row({ id, title, description, date, category}) {
    const { deleteEvent, onOpen, findOne } = useContext(GlobalContext);

  return (
  <Tr>
    <Td><Avatar name={title} /></Td>
    <Td>{title}</Td>
    <Td>{description}</Td>
    <Td>{date}</Td>
    <Td>{category}</Td>
    <Td>
        <Box display="flex" gap="1">
          <Button colorScheme='blue'>
            <AiFillEdit onClick={() => {
              onOpen()
              findOne(id)
            }}/>
          </Button>
          <Button colorScheme='red' onClick={() => deleteEvent(id)}>
            <AiFillDelete  />
          </Button>
        </Box>
    </Td>
  </Tr>
  )
}

export default Row

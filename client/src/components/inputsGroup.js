import React from 'react'
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input
  } from '@chakra-ui/react'

function InputsGroup({name, onChangeHandler, errors, value}) {
  return (
    <FormControl isInvalid={errors}>
        <FormLabel>{name}</FormLabel>
        <Input type='text' name={name} value={value} onChange={onChangeHandler}/>
        {
            errors && errors?.map((err) => { 
                return <FormErrorMessage>{err}</FormErrorMessage>
            })
        }
    </FormControl>
  )
}

export default InputsGroup

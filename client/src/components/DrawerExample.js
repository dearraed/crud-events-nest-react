import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "./../context/GlobalWrapper";

import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    Stack
  } from '@chakra-ui/react'
import InputsGroup from "./inputsGroup";

export default function DrawerExample() {
    const { isOpen, onClose, add, errors, event, setErrors, update } = useContext(GlobalContext);
    const [form, setForm] = useState({})
    const onChangeHandler = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const onAdd = () => {
        add(form, setForm)
    }
    const onUpdate = (eventId) => {
      update(form, eventId, setForm)
    }

    useEffect(() => {
        setForm(event)
    }, [event])


    return (
      <>
        <Drawer
          isOpen={isOpen}
          placement='right'
          onClose={onClose}
                  >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton onClick={() => {
              setForm({});
              onClose();
              setErrors();
            }            
            }/>
            <DrawerHeader>Create / Update event</DrawerHeader>
  
            <DrawerBody>
                <Stack spacing={"24px"}>
                    <InputsGroup name="title" onChangeHandler={onChangeHandler} value={form?.title} errors={errors?.title}/>
                    <InputsGroup name="description" onChangeHandler={onChangeHandler} value={form?.description} errors={errors?.description}/>
                    <InputsGroup name="date" onChangeHandler={onChangeHandler} value={form?.date} errors={errors?.date}/>
                    <InputsGroup name="category" onChangeHandler={onChangeHandler} value={form?.category} errors={errors?.category}/>

                </Stack>
            </DrawerBody>
  
            <DrawerFooter>
              <Button variant='outline' mr={3} onClick={() => {
              setForm({});
              onClose();
              setErrors();
            }            
            }>
                Cancel
              </Button>
              <Button colorScheme='blue' onClick={() => (form.id ? onUpdate(form.id): onAdd())}>Save</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    )
  }
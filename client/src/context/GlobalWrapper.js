import { createContext, useState } from "react";
import axios from 'axios'
import { useToast, useDisclosure } from '@chakra-ui/react'


export const GlobalContext = createContext();

export default function Wrapper({ children }) {
    const [events, setEvents] = useState([])
    const [event, setEvent] = useState({})

    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [errors, setErrors] = useState({})
    const [totalEvents, setTotalEvents] = useState(0);



    const FetchUsers = (page, pageSize) => {
        axios.get(`/api/events?page=${page}&pageSize=${pageSize}`)
           .then(res => { 
                           
               setEvents(res.data.data)
               setTotalEvents(res.data.total)
           })
           .catch((err) => {
              console.log(err);
           })
    }

    const search = (query) => {
        console.log("query axios: ", query);
        
        axios.post(`/api/events/search?key=${query}`)
        .then((res) => setEvents(res.data))
        .catch((err) => {
            console.log(err);
         })
    }

    const deleteEvent = (id) => {
        axios.delete(`/api/events/${id}`)
        .then((res) => {
            setEvents(events.filter(x => x.id !== id))
            toast({
                title: 'Event deleted',
                status: 'success',
                duration: 4000,
                isClosable: true,
              })
        })
        .catch((err) => {
            console.log(err);
         })

    }

    const add = (form, setForm) => {
        axios.post('/api/events', form)
        .then(res => {
            const newEvent = {...res.data, id: events.length +1 }
            
            setEvents([newEvent, ...events]);
            toast({
                title: 'Event Added',
                status: 'success',
                duration: 4000,
                isClosable: true,
              });
              setErrors({})
              setForm({})
              onClose()
        })
        .catch(err => {
            setErrors(err.response.data.error)
        })
    }

    const findOne = async (userId) => {
       await axios.get('/api/events/' + userId)
           .then(res => {
            console.log("find one : ", res.data);
             setEvent(res.data)
        })
           .catch((err) => {
                setErrors(err.response.data.error)
        })
    }

    const update = (form, userId, setForm) => {
        axios.put('/api/events/' + userId, form)
        .then(res => {
            console.log('updated data : ', res.data)
            setEvents([res.data, ...events.filter(x=> x.id !== userId)])
            toast({
                title: 'Event Updated',
                status: 'success',
                duration: 4000,
                isClosable: true,
              });
              setErrors({})
              setForm({})
              onClose()
              //or fetchUsers()
        })
        .catch(err => {
            setErrors(err.response.data.error)
        })
    }
    return <GlobalContext.Provider value={{totalEvents, FetchUsers, search, events, deleteEvent, onOpen, isOpen, onClose, errors, setErrors, add, findOne, event, setEvent, update}}>{children}</GlobalContext.Provider>
}
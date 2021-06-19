import React, {useState, useEffect} from 'react'
import {TextField, TextareaAutosize, Typography, Card, CardContent, CardActionArea, Select, Checkbox} from '@material-ui/core'
import {Button} from 'uikit-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {useLocation} from 'wouter'
import Cookies from 'js-cookie'
import axios from 'axios'
import moment from 'moment'
import queryString from 'query-string'

const Create = () => {
    const [loc, setLoc] = useLocation()
    const [user, setUsers] = useState(null)
    const [fors, setFors] = useState(['Offline', 'Online (ZOOM)'])
    const [daten, setDaten] = useState({
        title: '',
        description: '',
        category: '',
        duration: '',
        price: '',
        format: '',
        address: '',
        zoomPersonalId: ''
    })

    const {title, description, category, duration, price, format, address, zoomPersonalId} = daten

    useEffect(() => {
        let item = Cookies.get('user')   

        if (item !== null && item !== undefined) {
            setUsers(JSON.parse(item))
        } else {
            setUsers(null)
        }
    }, [])  

    const createConsultationM = gql`
        mutation createConsultation($name: String!, $title: String!, $description: String!, $category: String!, $duration: String!, $price: Int!, $format: String!, $address: String!, $zoomPersonalId: String!) {
            createConsultation(name: $name, title: $title, description: $description, category: $category, duration: $duration, price: $price, format: $format, address: $address, zoomPersonalId: $zoomPersonalId)
        }
    `

    const [createConsultation] = useMutation(createConsultationM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.createConsultation !== undefined) {
                console.log(result.data.createConsultation)
            }
        }
    })

    const onCreatenCon = () => {
        if (user !== null) {
            createConsultation({
                variables: {
                    name: user.name, title, description, category, duration, price, format, address, zoomPersonalId
                }
            })
        }
    }

    return (
        <div className="con">
            <h2>Create own consultation</h2>
            <TextField value={title} onChange={e => setDaten({...daten, title: e.target.value})} placeholder="Enter title of consultation" />
            <TextareaAutosize value={description} onChange={e => setDaten({...daten, description: e.target.value})} placeholder="Enter description of consultation" rowsMin={5} />
            <TextField value={category} onChange={e => setDaten({...daten, category: e.target.value})} placeholder="Enter category of consultation" />
            <TextField value={duration} onChange={e => setDaten({...daten, duration: e.target.value})} placeholder="Enter duration of consultation" />
            <TextField value={price} onChange={e => setDaten({...daten, price: parseInt(e.target.value)})} placeholder="Enter price of consultation" />
            <h3>Choose format</h3>
            <Select onChange={e => setDaten({...daten, format: e.target.value})}>
                {fors.map(el => <option value={el}>{el}</option>)}
            </Select>
            {format === 'Offline'  &&
                <TextField value={address} onChange={e => setDaten({...daten, address: e.target.value})} placeholder="Enter address of consultation" />
            }
            {format === 'Online (ZOOM)'  &&
                <TextField value={zoomPersonalId} onChange={e => setDaten({...daten, zoomPersonalId: e.target.value})} placeholder="Enter zoomPersonalId of consultation" />
            }
            <Button onClick={onCreatenCon}>Create</Button>
        </div>
    )
}

export default Create
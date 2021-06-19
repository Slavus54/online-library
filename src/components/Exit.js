import React, {useState, useEffect} from 'react'
import {TextField, TextareaAutosize, Typography, Card, CardContent, CardActionArea, Select} from '@material-ui/core'
import {Button} from 'uikit-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {useLocation} from 'wouter'
import Cookies from 'js-cookie'
import axios from 'axios'
import moment from 'moment'

const Exit = () => {
    const [loc, setLoc] = useLocation()
    const [user, setUsers] = useState(null)
    const [flag, setFlag] = useState(null)

    useEffect(() => {
      let itemU = Cookies.get('user')       
      let itemB = Cookies.get('biker')    
  
      if (itemU !== undefined && JSON.parse(itemU) !== null) {
          setUsers(JSON.parse(itemU))
          setFlag(true)
      } 
      if (itemB !== undefined && JSON.parse(itemB) !== null) {
          setUsers(JSON.parse(itemB))
          setFlag(false)
      } 
    }, [])

    const onLogout = () => {
        Cookies.set('user', null)
        Cookies.set('biker', null)
        setLoc('/')
        window.location.reload()
    }

    return (
        <div className="con">
            <Button onClick={onLogout}>Logout</Button>
            <Button onClick={() => setLoc('/')}>Back</Button>
        </div>
    )
}

export default Exit
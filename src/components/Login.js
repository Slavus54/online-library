import React, {useState, useEffect} from 'react'
import {TextField, TextareaAutosize, Checkbox} from '@material-ui/core'
import {Button} from 'uikit-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {useLocation} from 'wouter'
import Cookies from 'js-cookie'

const Login = () => {
    const [isUser, setIsUser] = useState(null)
    const [flag, setFlag] = useState(null)
    const [user, setUsers] = useState(null)
    const [loc, setLoc] = useLocation()
    const [daten, setDaten] = useState({
        email: '',
        password: '',
    })

    const {email, password} = daten

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

    const loginUM = gql`
        mutation loginU($email: String!, $password: String!) {
            loginU(email: $email, password: $password) {
                id
                name
                email
                password
                confirmPassword
                tel
                city
                country
                age
            }
        }
    `

    const loginBM = gql`
        mutation loginB($email: String!, $password: String!) {
            loginB(email: $email, password: $password) {
                id
                name
                email
                password
                confirmPassword
                tel
                city
                country
                age
            }
        }
    `

    const [loginU] = useMutation(loginUM, {
        variables: {email, password},
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.loginU !== undefined) {
                document.cookie = `user=${JSON.stringify(result.data.loginU)}`
                setLoc('/')
                window.location.reload()
            }
        }
    })

    const [loginB] = useMutation(loginBM, {
        variables: {email, password},
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.loginB !== undefined) {
                document.cookie = `biker=${JSON.stringify(result.data.loginB)}`
                setLoc('/')
                window.location.reload()
            }
        }
    })

    const onLog = () => {
        if (isUser === true) {
            loginU()
        } else {
            loginB()
        }
        
        console.log(daten)
        setDaten({email: '', password: ''})
    }

    return (
        <div className="con">
                <div className="formen">
                <h3>Login</h3>
                <h3>Are you client?</h3>
                <Checkbox value={isUser} onChange={e => setIsUser(e.target.checked)}></Checkbox>
                <TextField value={email} onChange={(e) => setDaten({...daten, email: e.target.value})} placeholder="Enter your email" />
                <TextField value={password} onChange={(e) => setDaten({...daten, password: e.target.value})} placeholder="Enter your password" />
                <Button onClick={onLog}>Login</Button>
                </div>
               
        </div>
    )
}

export default Login
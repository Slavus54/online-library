import React, {useState, useEffect} from 'react'
import {TextField, TextareaAutosize, Typography, Card, CardContent, CardActionArea, Checkbox} from '@material-ui/core'
import {Button} from 'uikit-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {useLocation} from 'wouter'
import Cookies from 'js-cookie'
import axios from 'axios'

const Profile = () => {
    const [loc, setLoc] = useLocation()
    const [user, setUsers] = useState(null)
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        let item = JSON.parse(Cookies.get('user'))
  
        if (item !== null) {
            setUsers(item)
        } else {
            setUsers(null)
        } 
    }, [])

    const getUserInfoM = gql`
        mutation getUserInfo($name: String!) {
            getUserInfo(name: $name) {
                id
                name
                email
                password
                confirmPassword
                tel
                city
                country
                age
                card,
                tasks {
                    shortid
                    creator
                    tel
                    title
                    description
                    category
                    tags
                    price
                    time
                    candidates {
                        name
                        accepted
                    }
                    accepter
                    accepted
                    completed
                }
                skills {
                    shortid
                    creator
                    tel
                    title
                    category
                    price
                    measure
                }
                reviews {
                    shortid
                    creator
                    task
                    category
                    price
                    time
                    completed
                    rate
                }
            }
        }
    `

    const acceptTaskM = gql`
        mutation acceptTask($name: String!, $shortid: String!, $accep: String!) {
            acceptTask(name: $name, shortid: $shortid, accep: $accep) 
        }
    `

    const [getUserInfo] = useMutation(getUserInfoM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.getUserInfo !== undefined) {
                console.log(result.data.getUserInfo)
                setProfile(result.data.getUserInfo)
            }
        }
    })

    const [acceptTask] = useMutation(acceptTaskM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.acceptTask !== undefined) {
                console.log(result.data.acceptTask)
            }
        }
    })

    useEffect(() => {
        if (user !== null) {
            getUserInfo({
                variables: {
                    name: user.name
                }
            })
        }
    }, [user])

    const onAcceptenTask = (name, id) => {
        if (user !== null) {
            acceptTask({
                variables: {
                    name: user.name, shortid: id, accep: name
                }
            })
        }
    }

    return (
        <div className="con">
            <h2>Profile</h2>
            {user !== null && profile !== null && profile.tasks.filter(e => e.creator === user.name).length > 0 && profile.tasks.filter(e => e.creator === user.name).map(e => (
                <Card className="inv">
                    <CardContent>
                        <Typography>{e.title}</Typography>
                        <Typography>{e.category}</Typography>
                        <Typography>{e.time}</Typography>
                        <Typography>{e.price}</Typography>
                        <Typography>accepted: {e.accepted.toString()}</Typography>
                    </CardContent>
                    <CardActionArea>
                        {e.accepter === '' && e.candidates.filter(e => e.accepted === false).map(ev => (
                        <>
                            <Typography>{ev.name}</Typography>
                            <Button onClick={() => onAcceptenTask(ev.name, e.shortid)}>Accept</Button>
                        </>
                        ))}
                    </CardActionArea>
                </Card>
            ))}
        </div>
    )
}

export default Profile
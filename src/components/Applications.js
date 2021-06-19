import React, {useState, useEffect} from 'react'
import {TextField, TextareaAutosize, Typography, Card, CardContent, CardActionArea, Select} from '@material-ui/core'
import {Button} from 'uikit-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {useLocation} from 'wouter'
import Cookies from 'js-cookie'
import axios from 'axios'
import moment from 'moment'

const Applications = () => {
    const [loc, setLoc] = useLocation()
    const [user, setUsers] = useState(null)
    const [apps, setApps] = useState(null)

    useEffect(() => {
        let item = Cookies.get('user')     
    
        if (item !== undefined) {
          if (JSON.parse(item) !== null) {
            setUsers(JSON.parse(item))
          }
        } else {
            setUsers(null)
        }
    }, [])

    const getUserInfoM = gql`
        mutation getUserInfo($name: String!) {
            getUserInfo(name: $name) {
                name 
                applications {
                    shortid
                    creator
                    doctorEmail
                    title
                    description,
                    category
                    duration
                    price
                    format
                    address
                    zoomPersonalId
                    zoomAccessId
                    time
                    date
                    chat {
                        name
                        msg
                    }
                    accepted
                    paid
                }
            }
        }
    `

    const acceptApplicationM = gql`
        mutation acceptApplication($name: String!, $shortid: String!, $creat: String!) {
            acceptApplication(name: $name, shortid: $shortid, creat: $creat)
        }
    `

    const acceptPaidApplicationM = gql`
        mutation acceptPaidApplication($name: String!, $shortid: String!, $creat: String!) {
            acceptPaidApplication(name: $name, shortid: $shortid, creat: $creat)
        }
    `

    const [getUserInfo] = useMutation(getUserInfoM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.getUserInfo !== undefined) {
                console.log(result.data.getUserInfo)
                setApps(result.data.getUserInfo.applications)
            }
        }
    })
    
    const [acceptApplication] = useMutation(acceptApplicationM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.acceptApplication !== undefined) {
                console.log(result.data.acceptApplication)
            }
        }
    })

    const [acceptPaidApplication] = useMutation(acceptPaidApplicationM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.acceptPaidApplication !== undefined) {
                console.log(result.data.acceptPaidApplication)
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

    const onAcceptenApp = app => {
        if (user !== null) {
            acceptApplication({
                variables: {
                    name: user.name, shortid: app.shortid, creat: app.creator
                }
            })
        }
    }

    const onAcceptenPaidApp = app => {
        if (user !== null) {
            acceptPaidApplication({
                variables: {
                    name: user.name, shortid: app.shortid, creat: app.creator
                }
            })
        }
    }

    return (
        <div className="con">
            <h2>Applications</h2>
            <h2>My own apps</h2>
            <div className="invs">
            {user !== null &&apps !== null && apps.filter(el => el.creator === user.name).map(el => (
                <Card className="inv">
                    <CardContent>
                        <Typography>{el.title}</Typography>
                        <Typography>{el.date}</Typography>
                        <Typography>{el.time}</Typography>
                        <Typography>{el.format}</Typography>
                        {el.paid === true && el.format === 'Offline' &&
                            <Typography>{el.address}</Typography>
                        }
                        {el.paid === true && el.format === 'Online (ZOOM)' &&
                        <>
                            <Typography>{el.zoomPersonalId}</Typography>
                            <Typography>{el.zoomAccessId}</Typography>
                        </>
                        }
                        <Typography>{el.accepted.toString()}</Typography>
                        <Typography>{el.paid.toString()}</Typography>
                    </CardContent>
                    <CardActionArea>
                        <Button onClick={() => setLoc(`/chat/${el.shortid}`)}>Chat</Button>
                    </CardActionArea>
                </Card>
            ))}
            </div>
            <h2>My clients apps</h2>
            <div className="invs">
            {user !== null &&apps !== null && apps.filter(el => el.creator !== user.name).map(el => (
                <Card className="inv">
                    <CardContent>
                        <Typography>{el.title}</Typography>
                        <Typography>{el.date}</Typography>
                        <Typography>{el.time}</Typography>
                        <Typography>{el.format}</Typography>
                        {el.format === 'Offline' &&
                            <Typography>{el.address}</Typography>
                        }
                        {el.format === 'Online (ZOOM)' &&
                        <>
                            <Typography>{el.zoomPersonalId}</Typography>
                            <Typography>{el.zoomAccessId}</Typography>
                        </>
                        }
                        <Typography>{el.accepted.toString()}</Typography>
                        <Typography>{el.paid.toString()}</Typography>
                    </CardContent>
                    <CardActionArea>
                        <Button onClick={() => setLoc(`/chat/${el.shortid}`)}>Chat</Button>
                        {el.accepted === false && <Button onClick={() => onAcceptenApp(el)}>Accept</Button>}
                        {el.paid === false && <Button onClick={() => onAcceptenPaidApp(el)}>Accept paid</Button>}
                    </CardActionArea>
                </Card>
            ))}
            </div>
        </div>
    )
}

export default Applications
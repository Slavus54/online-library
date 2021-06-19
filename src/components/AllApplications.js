import React, {useState, useEffect} from 'react'
import {TextField, TextareaAutosize, Typography, Card, CardContent, CardActionArea, Select} from '@material-ui/core'
import {Button} from 'uikit-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {useLocation} from 'wouter'
import Cookies from 'js-cookie'
import axios from 'axios'
import moment from 'moment'

const AllApplications = () => {
    const [loc, setLoc] = useLocation()
    const [user, setUsers] = useState(null)
    const [flag, setFlag] = useState(null)
    const [apps, setApps] = useState(null)

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

    const getAllApplicationsM = gql`
        mutation getAllApplications($name: String!) {
            getAllApplications(name: $name) {
                shortid
                creator
                bookId
                bookTitle
                bookAuthor
                bookCategory
                days
                dateUp
                dateDown
                timeDown
                accepted
                completed
                returned
            }
        }
    `

    const acceptApplicationM = gql`
        mutation acceptApplication($name: String!, $shortid: String!, $creat: String!, $bookId: String!) {
            acceptApplication(name: $name, shortid: $shortid, creat: $creat, bookId: $bookId)
        }
    `

    const [getAllApplications] = useMutation(getAllApplicationsM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.getAllApplications !== undefined) {
                console.log(result.data.getAllApplications)
                setApps(result.data.getAllApplications)
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

    useEffect(() => {
        if (user !== null) {
            getAllApplications({
                variables: {
                    name: user.name
                }
            })
        }
    }, [user])

    const onAccept = el => {
        if (user !== null && apps !== null) {
            acceptApplication({
                variables: {
                    name: user.name, shortid: el.shortid, creat: el.creator, bookId: el.bookId
                }
            })
        }
    }

    return (
        <div className="con">
            <h2>AllApplications</h2>
            <div className="invs">
            {apps !== null && apps.map(el => (
                <Card className="inv">
                    <CardContent>
                        <Typography>{el.bookTitle}</Typography>
                        <Typography>{el.bookAuthor}</Typography>
                        <Typography>{el.dateUp}</Typography>
                        <Typography>{el.dateDown}</Typography>
                        <Typography>{el.timeDown}</Typography>
                        <Typography>{el.creator}</Typography>
                        <Typography>accepted: {el.accepted.toString()}</Typography>
                        <Typography>completed: {el.completed.toString()}</Typography>
                        <Typography>returned: {el.returned.toString()}</Typography>
                    </CardContent>
                    <CardActionArea>
                        <Button onClick={() => onAccept(el)}>Accept</Button>
                    </CardActionArea>
                </Card>
            ))}
            </div>
        </div>
    )
}

export default AllApplications
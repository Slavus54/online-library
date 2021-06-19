import React, {useState, useEffect} from 'react'
import {TextField, TextareaAutosize, Typography, Card, CardContent, CardActionArea, Select} from '@material-ui/core'
import {Button} from 'uikit-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {useLocation} from 'wouter'
import Cookies from 'js-cookie'
import axios from 'axios'
import moment from 'moment'

const OwnApplications = () => {
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

    const getBikerInfoM = gql`
        mutation getBikerInfo($name: String!) {
            getBikerInfo(name: $name) {
                name 
                applications {
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
        }
    `

    const competeApplicationM = gql`
        mutation competeApplication($name: String!, $shortid: String!, $creat: String!) {
            competeApplication(name: $name, shortid: $shortid, creat: $creat) 
        }
    `

    const returnApplicationM = gql`
        mutation returnApplication($name: String!, $shortid: String!, $creat: String!, $bookId: String!) {
            returnApplication(name: $name, shortid: $shortid, creat: $creat, bookId: $bookId)
        }
    `

    const [getBikerInfo] = useMutation(getBikerInfoM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.getBikerInfo !== undefined) {
                console.log(result.data.getBikerInfo)
                setApps(result.data.getBikerInfo.applications)
            }
        }
    })

    const [competeApplication] = useMutation(competeApplicationM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.competeApplication !== undefined) {
                console.log(result.data.competeApplication)
            }
        }
    })

    const [returnApplication] = useMutation(returnApplicationM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.returnApplication !== undefined) {
                console.log(result.data.returnApplication)
            }
        }
    })

    useEffect(() => {
        if (user !== null) {
            getBikerInfo({
                variables: {
                    name: user.name
                }
            })
        }
    }, [user])

    const onCompletenApp = el => {
        if (user !== null && apps !== null) {
            competeApplication({
                variables: {
                    name: user.name, shortid: el.shortid, creat: el.creator
                }
            })
        }
    }

    const onReturnenApp = el => {
        if (user !== null && apps !== null) {
            returnApplication({
                variables: {
                    name: user.name, shortid: el.shortid, creat: el.creator, bookId: el.bookId
                }
            })
        }
    }

    return (
        <div className="con">
            <h2>OwnApplications</h2>
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
                        {el.completed === false &&
                            <Button onClick={() => onCompletenApp(el)}>Complete</Button>
                        }
                         {el.returned === false &&
                            <Button onClick={() => onReturnenApp(el)}>Return</Button>
                        }
                    </CardActionArea>
                </Card>
            ))}
            </div>
        </div>
    )
}

export default OwnApplications
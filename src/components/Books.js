import React, {useState, useEffect} from 'react'
import {TextField, TextareaAutosize, Typography, Card, CardContent, CardActionArea, Select} from '@material-ui/core'
import {Button} from 'uikit-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {useLocation} from 'wouter'
import Cookies from 'js-cookie'
import axios from 'axios'
import moment from 'moment'

const Books = () => {
    const [loc, setLoc] = useLocation()
    const [user, setUsers] = useState(null)
    const [flag, setFlag] = useState(null)
    const [books, setBooks] = useState(null)

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

    const getBooksM = gql`
        mutation getBooks($name: String!) {
            getBooks(name: $name) {
                bookId
                bookTitle
                bookAuthor
                bookCategory
                bookImage
                taken
            }
        }
    `

    const [getBooks] = useMutation(getBooksM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.getBooks !== undefined) {
                console.log(result.data.getBooks)
                setBooks(result.data.getBooks)
            }
        }
    })

    useEffect(() => {
        if (user !== null) {
            getBooks({
                variables: {
                    name: user.name
                }
            })
        }
    }, [user])

    return (
        <div className="con">
            <h2>Books</h2>
            <div className="invs">
            {books !== null && books.map(el => (
                <Card className="inv">
                    <CardContent>
                        <img src={el.bookImage} className="photo" />
                        <Typography>{el.bookTitle}</Typography>
                        <Typography>{el.bookAuthor}</Typography>
                        <Typography>{el.bookCategory}</Typography>
                        <Typography>taken: {el.taken.toString()}</Typography>
                    </CardContent>
                    <CardActionArea>
                        <Button onClick={() => setLoc(`/book/${el.bookId}`)}>Choose</Button>
                    </CardActionArea>
                </Card>
            ))}
            </div>
        </div>
    )
}

export default Books
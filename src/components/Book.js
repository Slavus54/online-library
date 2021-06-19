import React, {useState, useEffect} from 'react'
import {TextField, TextareaAutosize, Typography, Card, CardContent, CardActionArea, Select} from '@material-ui/core'
import {Button} from 'uikit-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {useLocation} from 'wouter'
import Cookies from 'js-cookie'
import axios from 'axios'
import moment from 'moment'

const Book = ({params}) => {
    const [loc, setLoc] = useLocation()
    const [user, setUsers] = useState(null)
    const [flag, setFlag] = useState(null)
    const [book, setBook] = useState(null)
    const [iterT, setIterT] = useState(0)
    const [iterD, setIterD] = useState(0)
    const [timesu, setTimesU] = useState([])
    const [daysu, setDaysU] = useState([])
    const [sdays, setSDays] = useState([15, 30, 60])
    const [daten, setDaten] = useState({
        days: 0,
        dateUp: '',
        dateDown: '',
        timeDown: ''
    })

    const {days, dateUp, dateDown, timeDown} = daten

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

    const createApplicationM = gql`
        mutation createApplication($name: String!, $bookId: String!, $bookTitle: String!, $bookAuthor: String!, $bookCategory: String!, $days: Int!, $dateUp: String!, $dateDown: String!, $timeDown: String!) {
            createApplication(name: $name, bookId: $bookId, bookTitle: $bookTitle, bookAuthor: $bookAuthor, bookCategory: $bookCategory, days: $days, dateUp: $dateUp, dateDown: $dateDown, timeDown: $timeDown)
        }
    `

    const [getBooks] = useMutation(getBooksM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.getBooks !== undefined) {
                console.log(result.data.getBooks.find(el => el.bookId === params.id))
                setBook(result.data.getBooks.find(el => el.bookId === params.id))
            }
        }
    })

    const [createApplication] = useMutation(createApplicationM, {
        optimisticResponse: true,
        update(proxy, result) {
            if (result.data.createApplication !== undefined) {
                console.log(result.data.createApplication)
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

    useEffect(() => {
        if (iterD < 14) {
            setDaysU([...daysu, moment().add('days', iterD).format('DD.MM.YYYY')])
            setIterD(iterD + 1)
        }
    }, [iterD])

    
    useEffect(() => {
        if (iterT < 11) {
            setTimesU([...timesu, `${7 + iterT}:00`])
            setIterT(iterT + 1)
        }
    }, [iterT])

    useEffect(() => {
        if (dateUp !== null && days !== null && iterD !== null) {
        
            let index = ''
            daysu.find((el, i) => {
                if (el === dateUp) {
                    index = i
                }
            })
            console.log(index)
            setDaten({...daten, dateDown: moment().add('days', index + days).format('DD.MM.YYYY')})
        }
    }, [days])

    const onCreatenApp = () => {
        if (user !== null && book !== null) {
            createApplication({
                variables: {
                    name: user.name, bookId: book.bookId, bookTitle: book.bookTitle, bookAuthor: book.bookAuthor, bookCategory: book.bookCategory, days, dateUp, dateDown, timeDown
                }
            })
        }
    }

    return (
        <div className="con">
            <h2>Book</h2>
            {book !== null &&
            <>
                <h2>{book.bookTitle}</h2>
                <img src={book.bookImage} className="photo" />
                <Typography>{book.bookAuthor}</Typography>
                <Typography>{book.bookCategory}</Typography>
                <Typography>taken: {book.taken.toString()}</Typography>
                {book.taken === false &&
                <>
                    <h3>You can create application</h3>
                    <h4>Choose pickup day</h4>
                    <Select onChange={e => setDaten({...daten, dateUp: e.target.value})}>
                        {daysu.map(e => <option value={e}>{e}</option>)}
                    </Select>
                    <h4>Choose days</h4>
                    <Select onChange={e => setDaten({...daten, days: e.target.value})}>
                        {sdays.map(e => <option value={e}>{e}</option>)}
                    </Select>
                    <h4>Choose time return</h4>
                    <Select onChange={e => setDaten({...daten, timeDown: e.target.value})}>
                        {timesu.map(e => <option value={e}>{e}</option>)}
                    </Select>
                    <Button onClick={onCreatenApp}>Create</Button>
                </>
                }
            </>
            }
        </div>
    )
}

export default Book
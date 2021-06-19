import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import {Link, Route} from 'wouter'
import {TextField, TextareaAutosize, Typography, Card, CardContent, CardActionArea, Checkbox} from '@material-ui/core'
import {Button} from 'uikit-react'
import Main from './components/Main'
import Welcommen from './components/Welcommen'
import Books from './components/Books'
import Book from './components/Book'
import AllApplications from './components/AllApplications'
import OwnApplications from './components/OwnApplications'
import './App.css'

function App() {
  const [user, setUsers] = useState(null)
  const [flag, setFlag] = useState(null)

  const onGet = async (data) => {
    let dat = await axios.get(data)
    console.log(dat.data)
  }

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

  return (
    <div className="App">
      {user === null && 
        <nav>
          <Link href="/">Home</Link>
          <Link href="/reg">Register/Login</Link>
        </nav>
      }

       {user !== null && flag === true &&
        <nav>
          <Link href="/">Home</Link>
          <Link href="/books">Books</Link>
          <Link href="/myapplications">My Applications</Link>
          <Link href="/profile">Profile</Link>
        </nav>
       }

       {user !== null && flag === false &&
        <nav>
          <Link href="/">Home</Link>
          <Link href="/applications">Applications</Link>
          <Link href="/ownapplications">Own Applications</Link>
          <Link href="/profile">Profile</Link>
        </nav>
       }
      <Route path="/" component={user !== null ? Main: Welcommen} /> 
      <Route path="/reg" component={Welcommen} /> 
      <Route path="/books" component={Books} /> 
      <Route path="/book/:id" component={Book} /> 
      <Route path="/applications" component={AllApplications} /> 
      <Route path="/ownapplications" component={OwnApplications} /> 
      {/* <Route path="/reg" component={Welcommen} /> */}
      {/* <Route path="/create" component={Create} /> 
      <Route path="/frequencies" component={Frequencies} /> 
      <Route path="/frequency/:id" component={Frequency} />  */}
      {/* <audio autoPlay={true} controls={true} src="https://cdns-preview-c.dzcdn.net/stream/c-cca63b2c92773d54e61c5b4d17695bd2-8.mp3"></audio> */}
    </div>
  );
}

export default App;
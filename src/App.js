import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

function App() {

  const [user, setUser] = useState(null)
    const [newUsername, setNewUsername] =useState([])
    const [message, setMessage] = useState("hello World")
    const [newMessage, setNewMessage] = useState([])
    useEffect(authentication, [])

 // user
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
 function authentication() {
      if (getCookie("authToken")){
          axios.post("https://api.messenger.codecolliders.com/getUser",
              {
                  authKey: getCookie("authToken")
              }
          ).then(response => {
              setUser(response.data);
            })
      } else {
          axios.post("https://api.messenger.codecolliders.com/createUser",
              {}
          ).then(response => {
              console.log(response);
              setCookie("authToken", response.data.authKey, 1)
              setUser(response.data)
          })
      }
 }

    function inputUser(event) {
        setNewUsername(event.target.value)
    }

    function changeUsername(event) {
        event.preventDefault()
        axios.post("https://api.messenger.codecolliders.com/changeUsername",
            {
                authKey: getCookie("authToken"),
                username: newUsername
            }).then(response => {
            setUser(response.data)
            console.log(user)
        })
    }

    function getUser() {
        if (user) {
            return <h1>{user.username}</h1>
        }
    }


    // Message
function inputMessage(event) {
    setNewMessage(event.target.value)
}

 function sendMessage (event) {
      event.preventDefault()
        axios.post("https://api.messenger.codecolliders.com/sendMessage",
             {
                 authKey: getCookie("authToken"),
                 text: newMessage,
                 to: 0
         }).then(response => {
             setMessage(response.data)
            console.log(message)
         })
 }

    function getMessage() {
        if (user) {
            return <div>{user.message}</div>
        }
    }

  return (
      <div className="App">
        <header className="App-header">
          {getUser()}
            <form onSubmit={sendMessage}>
              <input type="text" value={newMessage} onChange={inputMessage}/>
              <input type="submit" value="Envoyer" />
            </form>
            <form onSubmit={changeUsername}>
                <input type="text" value={newUsername} onChange={inputUser}/>
                <input type="submit" value="Envoyer" />
            </form>

        </header>
      </div>
  );
}

export default App;

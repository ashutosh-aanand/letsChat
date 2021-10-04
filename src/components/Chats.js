import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { ChatEngine } from 'react-chat-engine';
import axios from "axios";
import LoadingScreen from 'react-loading-screen';

import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

let Chats = () => {
    let history = useHistory();
    let { user } = useAuth();
    let [loading, setLoading] = useState(true);

    // console.log(user);

    let handleLogout = async ()=> {
        await auth.signOut();
        history.push('/');
    }

    let getFile = async (url)=> {
        let response = await fetch(url);
        let data = await response.blob();

        return new File([data], 'userPhoto.jpeg',{type: 'image/jpeg'});
    }

    useEffect(()=>{
        if(!user || user === null){
            history.push('/');
            return;
        }

        axios.get('https://api.chatengine.io/users/me/', {
            headers:{
                "Project-ID": process.env.REACT_APP_projectID,
                "User-Name": user.email,
                "User-Secret": user.uid
            }
        })
        .then(()=>{
            setLoading(false);
        })
        .catch(async (e)=>{
            // console.log(e);
            
            // creating a new user
            let formdata = new FormData();
            formdata.append('email', user.email);
            formdata.append('username', user.email);
            formdata.append('secret', user.uid);

            await getFile(user.photoURL)
            .then((avatar)=> formdata.append('avatar', avatar, avatar.name))
            // .catch((e)=> console.log(e));

            axios.post('https://api.chatengine.io/users/',
                formdata,
                { headers: { 'private-key': process.env.REACT_APP_privateKey } }
            )
            .then(()=> setLoading(false))
            .catch((error)=> console.log(error.response));
        })
    },[user, history]);

    if(!user || loading){
        return (
            <LoadingScreen
                loading={true}
                bgColor='#f1f1f1'
                spinnerColor='#9ee5f8'
                textColor='#676767'
                // logoSrc='/logo.png'
                text='logging you in...'
            >
            </LoadingScreen>
        );
    }

    return (
        <div className="chats-page">
            <div className="nav-bar">
                <div className="logo-tab">
                    letsChat
                </div>
                <div onClick={handleLogout} className="logout-tab">
                    Logout
                </div>
            </div>
            <ChatEngine
                height="calc(100vh - 66px)"
                projectID={process.env.REACT_APP_projectID}
                userName={user.email}
                userSecret={user.uid}
            />
        </div>
    );
}
 
export default Chats;

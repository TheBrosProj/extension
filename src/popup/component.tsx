import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyA4JsIV-WevFvSRXfQWRpKUpvqWCheIxlQ",
    authDomain: "thebrosproj.firebaseapp.com",
    projectId: "thebrosproj",
    storageBucket: "thebrosproj.appspot.com",
    messagingSenderId: "197012732766",
    appId: "1:197012732766:web:b7a52e33bce7c5e9be6dcf"
  };

function Popup(){

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const auth = firebase.auth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loggedIn,setLoggedIn] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            auth.signInWithEmailAndPassword(email, password).then((res)=>{
                chrome.storage.sync.set({ userId: res.user?.uid },() => {
                    console.log("Value is set");
                    setLoggedIn(true);
                });
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(()=>{
        (function (){
            chrome.storage.sync.get('userId', function(data) {
                if (typeof data.userId === 'undefined') {
                    setLoggedIn(false);
                } else {
                    setLoggedIn(true);
                }
            });
        })()
    },[])
    return (
        <>
        {loggedIn ?
            <p className='block text-center text-gray-700 font-medium mt-5 h-16 w-64'>You are logged in and can send your notes now. If you want to use another account remove the extension and install it again</p>
            :
            <div className="max-w-sm mx-auto p-4 h-64 w-64">
                <h1 className="text-lg font-semibold mb-4">Login</h1>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border border-gray-300 p-2 w-full rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-gray-300 p-2 w-full rounded"
                        />
                    </div>
                    <button
                        aria-label='Log in'
                        disabled={isLoading}
                        type="submit"
                        className={`bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ${isLoading ? 'cursor-not-allowed' : ''}`}
                    >
                        Log In
                    </button>
                </form>
            </div>
        }
        </>
    );
};
export {Popup};


/**
 * login and blocklist
 * TODO: add menu options to 
 * block list, login and upcoming features
 */

import React, { useState, useEffect } from 'react';
import { Login } from './login';
import { openURL } from './lib';
import BlocklistComponent from './blocklist';

function Popup() {
    const [loggedIn, setLoggedIn] = useState(false);
    useEffect(() => {
        (function () {
            chrome.storage.sync.get('userId', function (data) {
                if (typeof data.userId === 'undefined') {
                    setLoggedIn(false);
                } else {
                    setLoggedIn(true);
                }
            });
        })()
    }, []);
    return (
        <>
            {loggedIn ?
                <>
                    {/* <div className='h-32 block text-center text-gray-700 font-medium mt-5 w-64'>
                        You are logged in and can send your notes now.
                        If you want to use another account remove the extension and install it again
                    </div> */}
                    <button onClick={() => { openURL("https://prod.nandanvarma.com") }} className='my-4 bg-gray-500 text-white w-full px-4 py-2 hover:bg-gray-600'>Go to the Webpage to know more</button>
                    <BlocklistComponent />
                </>
                :
                <Login handleSuccessfulLogin={() => { setLoggedIn(true); }} />
            }
        </>
    );
};
export default Popup;
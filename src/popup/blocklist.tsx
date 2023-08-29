/**
 * BlockList: disable usage of selected websites
 */

import React, { useState, useEffect } from 'react';

const BlocklistComponent: React.FC = () => {
    const [blocklist, setBlocklist] = useState<string[]>([]);
    const [newItem, setNewItem] = useState('');
    const [modified, setModified] = useState(false);
    const [status, setStatus] = useState(true);

    const fetchBlocklistFromAPI = () => {
        chrome.storage.sync.get("userId", async (result) => {
            fetch(`https://prod.nandanvarma.com/api/blocklist/${result.userId}`)
                .then((response) => response.json())
                .then((data) => {
                    if(data!==blocklist){
                        setBlocklist(data);
                    }
                    chrome.storage.sync.set({ "blocklist": data }, () => { });
                })
                .catch((error) => console.error('Error fetching blocklist:', error));
        });
    };

    useEffect(() => {
        chrome.storage.sync.get("blocklistStatus", ({ "blocklistStatus": storedBlocklistStatus }) => {
            setStatus(storedBlocklistStatus);
        });
        chrome.storage.sync.get("blocklist", ({ blocklist: storedBlocklist }) => {
            if (storedBlocklist != null || storedBlocklist != undefined) {
                setBlocklist(storedBlocklist);
            }
            fetchBlocklistFromAPI();
        });
        chrome.storage.sync.set({ blocklistStatus: status }, () => { });
    }, []);

    const handleStatusChange = () => {
        setStatus(prev => {
            chrome.storage.sync.set({ blocklistStatus: !prev }, () => { });
            return !prev;
        });
    }

    const addItem = () => {
        const newUrl = new URL(newItem);
        if (!blocklist.includes(newUrl.hostname)) {
            setBlocklist(prev=>{
                chrome.storage.sync.set({ blocklist: prev }, () => { });
                return [...prev, newUrl.hostname];
            });
            setNewItem('');
            setModified(true);
        }
    };

    const removeItem = (index: number) => {
        const updatedBlocklist = [...blocklist];
        updatedBlocklist.splice(index, 1);
        setBlocklist(updatedBlocklist);
        setModified(true);
    };

    const saveBlocklist = () => {
        chrome.storage.sync.set({ "blocklist": blocklist }, () => {
            setModified(false);
        });

        chrome.storage.sync.get("userId", async (result) => {
            fetch(`https://prod.nandanvarma.com/api/blocklist/${result.userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ blocklist }),
            })
                .then((response) => {
                    if (response.ok) {
                        console.log('Blocklist updated successfully');
                    } else {
                        console.error('Failed to update blocklist');
                    }
                })
                .catch((error) => console.error('Error updating blocklist:', error));
        });
    };

    return (
        <div className="p-4 h-50 text-center">
            <label className="relative inline-flex items-center mb-5 cursor-pointer">
                <input checked={status} onChange={handleStatusChange} type="checkbox" value="" className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium">Block List</span>
            </label>
            <ul>
                {blocklist.map((item, index) => (
                    <li key={index} className="flex justify-between items-center my-2">
                        <span className='ml-4'>{item}</span>
                        <button
                            className="bg-gray-500 text-white font-extrabold w-8 py-2 rounded hover:bg-gray-600"
                            onClick={() => removeItem(index)}
                        >
                            -
                        </button>
                    </li>
                ))}
                <li className="flex justify-between items-center my-2">
                    <span className='ml-3'>
                        <input
                            type="text"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            className="border border-gray-300 p-2 rounded"
                        />
                    </span>
                    <button
                        className="bg-gray-500 text-white font-extrabold w-8 py-2 rounded hover:bg-gray-600"
                        onClick={addItem}
                    >
                        +
                    </button>
                </li>
            </ul>
            {modified && (
                <button
                    className="bg-gray-500 text-white px-4 py-2 my-4 w-full rounded hover:bg-gray-600"
                    onClick={saveBlocklist}
                >
                    Save
                </button>
            )}
        </div>
    );
};

export default BlocklistComponent;

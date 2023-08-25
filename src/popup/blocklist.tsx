import React, { useState, useEffect } from 'react';

const BlocklistComponent: React.FC = () => {
    const [blocklist, setBlocklist] = useState<string[]>([]);
    const [newItem, setNewItem] = useState('');
    const [modified, setModified] = useState(false);

    const fetchBlocklistFromAPI = () => {
        chrome.storage.sync.get("userId", async (result) => {
            fetch(`https://prod.nandanvarma.com/api/blocklist/${result.userId}`)
                .then((response) => response.json())
                .then((data) => {
                    setBlocklist(data);
                })
                .catch((error) => console.error('Error fetching blocklist:', error));
        });
    };

    useEffect(() => {
        // Load blocklist from storage on component mount
        chrome.storage.sync.get("blocklist", ({ blocklist: storedBlocklist }) => {
            if (storedBlocklist) {
                setBlocklist(storedBlocklist);
            }

            // Fetch the latest blocklist from the API
            fetchBlocklistFromAPI();
        });
    }, []);

    const addItem = () => {
        if(!blocklist.includes(newItem)){
            setBlocklist([...blocklist, newItem]);
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
            console.log("blocklist is set");
            setModified(false);
        });

        // Also update the blocklist via API
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
        <div className="p-4 h-50">
            <h2 className='text-center'>Block List</h2>
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
            </ul>
            <div className="flex mt-4">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    className="border border-gray-300 p-2 mx-2 rounded"
                />
                <button className="bg-gray-500 text-white font-extrabold w-8 py-2 rounded hover:bg-gray-600" onClick={addItem}>
                    +
                </button>
            </div>
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

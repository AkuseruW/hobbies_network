'use client'
import { WebSocketContext } from '@/providers/ws_provider';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Avatar, AvatarImage } from '../ui/avatar';
import { User } from '@/types/user_types';
import { ScrollArea } from '../ui/scroll-area';
import Link from 'next/link';


const CurrentUserOnline = () => {
    const socket = useContext(WebSocketContext);
    const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

    // Function to fetch online users with the WebSocket
    const fetchOnlineUsers = useCallback(() => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ action: 'get_online_users' })); // Send a message to the server
        }
    }, [socket]);

    useEffect(() => {
        // Add an event listener for the WebSocket's "open" event
        const handleSocketOpen = () => {
            fetchOnlineUsers(); // Fetch online users when the socket opens
        };

        if (socket) {
            socket.addEventListener('message', (event) => {
                const dataArray = JSON.parse(event.data); // Parse the received data
            
                if (Array.isArray(dataArray)) {
                    // If the received data is an array, update the onlineUsers state
                    const userInfos = dataArray.filter((data) => data.action === 'user_info');
                    setOnlineUsers((prevUsers) => [...prevUsers, ...userInfos]);
                }
            
                if (dataArray.action === 'new_user_connected') {
                    // Add the new user to the onlineUsers list
                    const newUser = dataArray.user_info;
                    setOnlineUsers((prevUsers) => {
                        // Check if the user is not already in the list
                        if (!prevUsers.some((user) => user.user_id === newUser.user_id)) {
                            return [...prevUsers, newUser];
                        }
                        return prevUsers;
                    });
                }
            
                if (dataArray.action === 'user_disconnected') {
                    // Remove the disconnected user from the onlineUsers list
                    const disconnectedUser = dataArray.user_info;
                    setOnlineUsers((prevUsers) => {
                        return prevUsers.filter((user) => user.user_id !== disconnectedUser.user_id);
                    });
                }
            });
            

            if (socket.readyState === WebSocket.OPEN) {
                // If the socket is already open, fetch online users immediately
                fetchOnlineUsers();
            } else {
                // If the socket is not open yet, add the event listener
                socket.addEventListener('open', handleSocketOpen);
            }
        }

        // Cleanup: Remove the event listener when the component unmounts
        return () => {
            if (socket) {
                socket.removeEventListener('open', handleSocketOpen);
            }
        };
    }, [socket, fetchOnlineUsers]);

    return (
        <div className='fixed aside-size p-6 bg-white dark:bg-secondary_dark rounded-lg overflow-hidden shadow-md mt-5'>
            <h2>Contacts en ligne :</h2>
            <ul className='w-full flex'>
                <ScrollArea className='w-full h-[300px]'>
                    {onlineUsers.map((user: User) => (
                        <li className='flex items-center justify-center mt-4' key={user.user_id}>
                            <Avatar className='mr-2 h-8 w-8'>
                                <AvatarImage
                                    src={user.profile_picture}
                                    alt="Profile picture"
                                    className="h-8 w-8 rounded-full"
                                />
                            </Avatar>
                            <Link href={`/profil/${user.user_id}`} className='flex items-center '>
                                {user.username}
                            </Link>
                        </li>
                    ))}
                </ScrollArea>
            </ul>
        </div>
    );
};

export default CurrentUserOnline;

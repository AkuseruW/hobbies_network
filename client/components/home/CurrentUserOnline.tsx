'use client'
import { WebSocketContext } from '@/providers/ws_provider';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Avatar, AvatarImage } from '../ui/avatar';
import { User } from '@/types/user_types';

const CurrentUserOnline = () => {
    const socket = useContext(WebSocketContext);
    const [onlineUsers, setOnlineUsers] = useState([]);

    const fetchOnlineUsers = useCallback(() => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ action: 'get_online_users' }));
        }
    }, [socket]);

    useEffect(() => {
        // Add an event listener for the WebSocket's "open" event
        const handleSocketOpen = () => {
            fetchOnlineUsers();
        };

        if (socket) {
            socket.addEventListener('message', (event) => {
                const dataArray = JSON.parse(event.data);
                console.log(dataArray);
                if (Array.isArray(dataArray)) {
                    const userInfos = dataArray.filter((data) => data.action === 'user_info');
                    //@ts-ignore
                    setOnlineUsers((prevUsers) => [...prevUsers, ...userInfos]);
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
        <div className='fixed right-16 p-6 bg-white dark:bg-gray-800 rounded-lg border-l border-t border-b border-gray-300 dark:border-gray-800 transition-all duration-300 ease-in-out mt-5 '>
            <h2>Utilisateurs en ligne :</h2>
            <ul>
                {onlineUsers.map((user: User) => (
                    <li className='flex items-center justify-center mt-4' key={user.user_id}>
                        <Avatar className='mr-2 h-8 w-8'>
                            <AvatarImage
                                src={user.profile_picture}
                                alt="Profile picture"
                                className="h-8 w-8 rounded-full"
                            />
                        </Avatar>
                        <span className='flex items-center '>
                            {user.username}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CurrentUserOnline;

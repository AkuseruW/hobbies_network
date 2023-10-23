'use client'
import { WebSocketContext } from '@/providers/ws_provider';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Avatar, AvatarImage } from '../ui/avatar';
import { User } from '@/types/user_types';
import { ScrollArea } from '../ui/scroll-area';


const CurrentUserOnline = () => {
    const socket = useContext(WebSocketContext);
    const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

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
                            <span className='flex items-center '>
                                {user.username}
                            </span>
                        </li>
                    ))}
                </ScrollArea>
            </ul>
        </div>
    );
};

export default CurrentUserOnline;

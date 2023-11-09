'use client';
import React, { KeyboardEvent, useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { sendChatMessage } from '@/utils/requests/_chats';
import Image from 'next/image';
import { User } from '@/types/user_types';
import { Icons } from '../icons';
import { WebSocketContext } from '@/providers/ws_provider';
import { ScrollArea } from '../ui/scroll-area';
import { useToggleChat } from '@/providers/chatToogle';
import Link from 'next/link';

// Define the Message type
interface Message {
    author: string;
    content: string;
    sender_id: number;
    sender_name: string;
    sender_profile_picture: string;
}

// Define props for the ChatHeader component
interface ChatHeaderProps {
    roomName: string;
    room_profile_picture: string;
    userid: number;
}

// ChatHeader component displays the header of the chat room
const ChatHeader: React.FC<ChatHeaderProps> = ({ roomName, room_profile_picture, userid }) => (
    <header className="bg-white dark:bg-secondary_dark dark:text-white p-4 text-gray-700 flex items-center space-x-2">
        <Image width={40} height={40} src={room_profile_picture} alt={roomName} className="w-10 h-10 rounded-full" />
        <Link href={`/profil/${userid}`} className="text-2xl font-semibold">{roomName}</Link>
    </header>
);

// Define props for the MessageItem component
interface MessageItemProps {
    message: Message;
    currentUser: User;
}

// MessageItem component displays individual chat messages
const MessageItem: React.FC<MessageItemProps> = ({ message, currentUser }) => (
    <div className={`message-container ${message.sender_id === currentUser.id ? 'justify-end' : 'justify-start'} flex items-center space-x-2 mb-4`}>
        {message.sender_id !== currentUser.id && (
            <Image width={40} height={40} src={message.sender_profile_picture} alt={message.sender_name} className="w-10 h-10 rounded-full" />
        )}
        <p className={`message ${message.sender_id === currentUser.id ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} p-2 rounded-lg text-sm w-fit max-w-full break-words`}>
            {message.content}
        </p>
    </div>
);

// Define props for the ChatInput component
interface ChatInputProps {
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    handleSendMessage: () => void;
    handleKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
}

// ChatInput component is responsible for input and sending messages
const ChatInput: React.FC<ChatInputProps> = ({ message, setMessage, handleSendMessage, handleKeyDown }) => (
    <footer className="border-t border-gray-300 p-4 w-full">
        <div className="message-input  flex relative">
            <textarea
                className="w-full p-1 border border-gray-300 rounded bg-transparent"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                onKeyDown={handleKeyDown}
            />
            <button
                className="py-2 px-4 absolute right-0 top-0 h-full flex items-center justify-center text-gray-500"
                disabled={message.trim() === ''}
                onClick={handleSendMessage}
            >
                <Icons.send className="w-4 h-4" />
            </button>
        </div>
    </footer>
);

// Define props for the ChatSection component
interface ChatSectionProps {
    initialMessages: Message[];
    currentUser: User;
    other_user: User;
}

const ChatSection: React.FC<ChatSectionProps> = ({ initialMessages, currentUser, other_user }) => {
    const { isUserListOpen } = useToggleChat();
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const params = useParams<{ room_id: string }>();
    const socket = useContext(WebSocketContext);
    const scrollAreaRef = useRef<HTMLDivElement | null>(null);

    // Listen for incoming messages via WebSocket
    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                const messageData = JSON.parse(event.data);
                if (messageData.room_id === params.room_id) {
                    const newMessages = [...messages, messageData.data];
                    setMessages(newMessages);

                    setMessage('');
                }
            };
        }
    }, [socket, messages, params.room_id]);

    useEffect(() => {
        // Scroll to the bottom of the chat
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Handle sending a message
    const handleSendMessage = async () => {
        if (message.trim() !== '') {
            try {
                await sendChatMessage({
                    room_id: params.room_id,
                    content: message,
                });
            } catch (error) {
                console.error('Erreur lors de l\'envoi du message:', error);
            }
        }
    };

    // Handle Enter key press to send the message
    const handleKeyDown = async (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className={`flex flex-col h-[95vh] lg:h-[100vh] relative w-full ${isUserListOpen ? 'hidden lg:block' : 'block '}`}>
            <div className="flex-1 flex-col overflow-hidden relative">
                <ChatHeader roomName={other_user.username} userid={other_user.id} room_profile_picture={other_user.profile_picture} />
                <div className="flex-1 p-4 pb-0 overflow-y-auto">
                    <div className=" overflow-y-auto h-[70vh] max-sm:h-[68vh] md:h-[68vh] lg:h-[70vh]">
                        {messages.map((message, index) => (
                            <MessageItem key={index} message={message} currentUser={currentUser} />
                        ))}
                        <div ref={scrollAreaRef}></div>
                    </div>
                </div>
            </div>
            <div className='absolute bottom-0 w-full'>
                <ChatInput message={message} setMessage={setMessage} handleSendMessage={handleSendMessage} handleKeyDown={handleKeyDown} />
            </div>
        </div>

    );
};

export default ChatSection;

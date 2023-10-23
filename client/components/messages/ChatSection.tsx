'use client'
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { sendChatMessage } from '@/utils/requests/_chats';
import Image from 'next/image';

interface Message {
    author: string;
    content: string;
    sender_id: number;
    sender_name: string;
    sender_profile_picture: string;
}

interface ChatSectionProps {
    messages: Message[];
    currentUser: { id: number };
}

const ChatSection: React.FC<ChatSectionProps> = ({ messages, currentUser }) => {
    const [message, setMessage] = useState<string>('');
    const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
    const params = useParams<{ room_id: string }>();

    console.log(messages)

    const handleSendMessage = async () => {
        if (message.trim() !== '') {
            try {
                const newMessage = await sendChatMessage({
                    room_id: params.room_id,
                    content: message,
                });
                setMessage('');
            } catch (error) {
                console.error('Erreur lors de l\'envoi du message :', error);
            }
        }
    };

    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow-lg">
            <div className="messages">
                {messages.map((message, index) => (
                    <div key={index} className={`message-container ${message.sender_id === currentUser.id ? 'justify-end' : 'justify-start'} flex items-center space-x-2`}>
                        {message.sender_id !== currentUser.id && (
                            <Image width={40} height={40} src={message.sender_profile_picture} alt={message.sender_name} className="w-10 h-10 rounded-full" />
                        )}
                        <div className={`message ${message.sender_id === currentUser.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}  p-2 rounded-lg`}>
                            <div className="text-sm">{message.content}</div>
                        </div>
                    </div>
                ))}
            </div>


            <div className="message-input mt-4">
                <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Écrivez votre message..."
                />
                <button
                    className="mt-2 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    onClick={handleSendMessage}
                >
                    Envoyer
                </button>
            </div>
        </div>
    );
};

export default ChatSection;

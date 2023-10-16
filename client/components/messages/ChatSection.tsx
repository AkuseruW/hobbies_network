'use client'
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { sendChatMessage } from '@/utils/requests/_chats';

interface Message {
    author: string;
    content: string;
}

interface ChatSectionProps {
    messages: Message[];
    currentUser: { id: number };
}

const ChatSection: React.FC<ChatSectionProps> = ({ messages, currentUser }) => {
    const [message, setMessage] = useState<string>('');
    const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
    const params = useParams<{ room_id: string }>();

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
                    //@ts-ignore
                    <div key={index} className={`mb-2 ${message.author === currentUser.id ? 'text-right' : 'text-left'}`}>
                        <div className="font-semibold text-blue-600">{message.author}</div>
                        <div className="text-gray-700">{message.content}</div>
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

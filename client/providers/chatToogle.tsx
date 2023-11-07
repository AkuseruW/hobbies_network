'use client';
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Define the props for the ToggleChat component
type ToggleChatProps = {
    children: ReactNode;
};

// Define the context type, including the toggleIsUserListOpen function and isUserListOpen state
type ChatToggleContextType = {
    toggleIsUserListOpen: () => void;
    isUserListOpen: boolean;
};

export const ChatToggleContext = createContext<ChatToggleContextType | null>(null);

// Custom hook to access the ChatToggleContext
export const useToggleChat = () => {
    const context = useContext(ChatToggleContext);
    // Check if the context is null and throw an error if it is
    if (context === null) {
        throw new Error('useToggleChat must be used within a ToggleChatProvider');
    }
    return context;
};

export const ToggleChat = ({ children }: ToggleChatProps) => {
    // Initialize the isUserListOpen state using useReducer
    const [isUserListOpen, setIsUserListOpen] = useReducer((isUserListOpen) => !isUserListOpen, true);

    // Toggle the isUserListOpen state
    const toggleIsUserListOpen = () => {
        setIsUserListOpen();
    };

    // Create the context value that includes both the function and state
    const contextValue: ChatToggleContextType = {
        toggleIsUserListOpen,
        isUserListOpen,
    };

    // Provide the context value to the children of the component
    return <ChatToggleContext.Provider value={contextValue}>{children}</ChatToggleContext.Provider>;
};

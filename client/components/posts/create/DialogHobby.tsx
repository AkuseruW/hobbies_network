import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from '@/components/ui/scroll-area';

interface Hobby {
    id: number;
    name: string;
}

interface Props {
    hobbies: Hobby[];
    selectedHobby: number | null;
    handleHobbyChange: (hobbyId: number) => void;
    setIsValid: (isValid: boolean) => void;
    error: boolean;
}

export const HobbiesSelect: React.FC<Props> = ({ hobbies, selectedHobby, handleHobbyChange, setIsValid, error }) => {
    const [hobbyVisible, setHobbyVisible] = useState(false);

    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const [hobbySelectedName, setHobbySelectedName] = useState(
        hobbies.find((hobby) => hobby.id === selectedHobby)?.name || 'Ajouter un hobby'
    );

    // Function to toggle the visibility of the emoji picker.
    const handleToggleHobby = () => {
        setHobbyVisible((prevVisibility) => !prevVisibility);
    };

    // Function to handle hobby change and update hobbySelectedName.
    const handleHobbySelection = (hobbyId: number) => {
        const selectedHobby = hobbies.find((hobby) => hobby.id === hobbyId);
        if (selectedHobby) {
            setHobbySelectedName(selectedHobby.name);
            setIsValid(true);
        } else {
            setHobbySelectedName('Ajouter un hobby');
            setIsValid(false);
        }
        handleHobbyChange(hobbyId);
    };

    return (
        <div className="text-center relative z-1">
            <Button variant="outline" onClick={handleToggleHobby} className={`w-42 max-w-42 ${error? 'border-red-500': 'border-accent-color'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={`${error? 'red' : 'currentColor'} `} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-tag"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" /><path d="M7 7h.01" /></svg>
                <span className={`ml-2 ${error? 'text-red-500': 'text-accent-color'}`}>{hobbySelectedName}</span>
            </Button>
            {hobbyVisible && (
                <div className="absolute top-12 right-0 mb-4 z-10" ref={emojiPickerRef}>
                    <div className="py-4 rounded-[20px] shadow-lg bg-zinc-200/[.5] dark:bg-gray-800 border border-zinc-200 dark:border-gray-700 w-[190px]">
                        <div className="w-full flex justify-center items-center dark:bg-gray-800">
                            <div className="flex flex-wrap justify-center max-w-[300px]">
                                <RadioGroup
                                    defaultValue={selectedHobby !== null ? selectedHobby.toString() : ''}
                                >
                                    <ScrollArea className='w-full h-[130px]'>
                                        {hobbies.map((hobby) => (
                                            <div className="flex items-center space-x-2 mt-2" key={hobby.id}>
                                                <RadioGroupItem value={hobby.id.toString()} id={hobby.id.toString()} onClick={() => handleHobbySelection(hobby.id)} />
                                                <Label htmlFor={hobby.id.toString()}>{hobby.name}</Label>
                                            </div>
                                        ))}
                                    </ScrollArea>
                                </RadioGroup>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

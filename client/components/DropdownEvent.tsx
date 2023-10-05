import { useCallback, useEffect, useState } from "react";

export const useDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return { isOpen, toggleDropdown };
};

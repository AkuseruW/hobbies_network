'use client'
import { useTheme } from 'next-themes';
import React from 'react'

const IconColor = ({ icone_white, icone_black }: { icone_white: string, icone_black: string }) => {
    const { resolvedTheme } = useTheme();
    const isDarkTheme = resolvedTheme === "dark";
    return (
        <div>
            <svg id="hexa" data-name="Calque 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 650.83 572" className="svg h-10 w-10" fill="none" stroke={isDarkTheme ? `white` : `black`} strokeWidth="10">
                <path className="cls-1"
                    d="M1089,228.5H794.79a28.7,28.7,0,0,0-24.86,14.35L622.82,497.65a28.73,28.73,0,0,0,0,28.7l147.11,254.8a28.7,28.7,0,0,0,24.86,14.35H1089a28.7,28.7,0,0,0,24.86-14.35L1261,526.35a28.73,28.73,0,0,0,0-28.7l-147.11-254.8A28.7,28.7,0,0,0,1089,228.5Z"
                    transform="translate(-616.48 -226)"
                />
                <path className="cls-1" d="M639.5,145.5" transform="translate(-616.48 -226)" />
                <image
                    x="225.415"
                    y="186"
                    width="200"
                    height="200"
                    xlinkHref={isDarkTheme ? icone_white : icone_black}
                />
            </svg>
        </div>
    )
}

export default IconColor

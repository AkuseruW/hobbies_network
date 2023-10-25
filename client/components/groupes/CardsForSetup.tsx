"use client";
import { useInView } from 'react-intersection-observer';
import { Suspense, useCallback, useEffect, useState } from "react";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import { useTheme } from 'next-themes';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { Hobby } from '@/types/hobby_types';
import { getHobbies } from '@/utils/requests/_hobbies_requests';
import { UserHobbies } from '@/utils/_setupProfileCookies';
// import { UserHobbies } from '@/utils/_setupProfileCookies';

type Props = {
    search?: string | undefined;
    initialHobbies: Hobby[];
    hobbiesCookie?: Hobby[];
};

const CardGroupeSetup: React.FC<Props> = ({ search, initialHobbies, hobbiesCookie }: Props) => {
    const router = useRouter();
    const [hobbies, setHobbies] = useState<Hobby[]>(initialHobbies);
    const [page, setPage] = useState<number>(1);
    const [ref, inView] = useInView();
    const { resolvedTheme } = useTheme();
    const isDarkTheme = resolvedTheme === "dark";
    const [mounted, setMounted] = useState<boolean>(false);
    const [selectedHobbies, setSelectedHobbies] = useState<Hobby[]>(
        initialHobbies.filter((hobby) =>
            hobbiesCookie?.some((cookieHobby) => cookieHobby.id === hobby.id)
        )
    );


    const loadMoreHobbies = useCallback(async () => {
        const next = page + 1;
        const newHobbies = await getHobbies({ search, page: next });

        if (newHobbies?.length) {
            setPage(next);
            setHobbies((prev) => [...(prev?.length ? prev : []), ...newHobbies]);
        }
    }, [page, search]);

    const handleHobbyClick = (hobby: Hobby) => {
        const isHobbySelected = selectedHobbies.some(
            (selectedHobby) => selectedHobby.id === hobby.id
        );
        if (isHobbySelected) {
            setSelectedHobbies((prevSelectedHobbies) =>
                prevSelectedHobbies.filter(
                    (selectedHobby) => selectedHobby.id !== hobby.id
                )
            );
        } else {
            setSelectedHobbies((prevSelectedHobbies) => [...prevSelectedHobbies, hobby]);
        }
    };

    const saveSelectedHobbiesToCookie = async () => {
        const selectedHobbyIds = selectedHobbies.map((hobby) => hobby.id);
        await UserHobbies({ hobbies: selectedHobbies });
        router.refresh();
        router.push('/setup/confirmation');
    };

    useEffect(() => {
        if (inView && hobbies.length > 10) {
            loadMoreHobbies();
        }
    }, [inView, loadMoreHobbies, hobbies.length]);

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return null;
    }

    return (
        <>
            <ScrollArea className="h-[500px] ">
                {hobbies.map((hobby) => (
                    <Suspense fallback={<p>Loading...</p>}>
                        <div
                            key={hobby.id}
                            className={`col-span-1 bg-white p-4 relative w-full h-full cursor-pointer overflow-hidden rounded-xl border my-4
                                ${selectedHobbies.some(
                                (selectedHobby) => selectedHobby.id === hobby.id)
                                    ? 'border-blue-50 border-opacity-75 bg-blue-50 dark:bg-gray-700 dark:border-accent_dark'
                                    : 'border-gray-300 dark:bg-primary_dark dark:text-white'
                                } hover:border-gray-500 hover:shadow-lg transition-all duration-300 ease-in-out  dark:border-gray-300  hover:bg-gray-100 dark:hover:bg-gray-700`}
                            onClick={() => handleHobbyClick(hobby)}
                        >
                            <div className=" space-y-4 lg:space-y-0 h-full">
                                <div key={hobby.name} className="group relative h-full">
                                    <div className="flex items-center gap-2">
                                        <svg
                                            id="hexa"
                                            data-name="Calque 1"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 650.83 572"
                                            className="svg h-10 w-10"
                                            fill="none"
                                            stroke={isDarkTheme ? `white` : `black`}
                                            strokeWidth="10"
                                        >
                                            <path
                                                className="cls-1"
                                                d="M1089,228.5H794.79a28.7,28.7,0,0,0-24.86,14.35L622.82,497.65a28.73,28.73,0,0,0,0,28.7l147.11,254.8a28.7,28.7,0,0,0,24.86,14.35H1089a28.7,28.7,0,0,0,24.86-14.35L1261,526.35a28.73,28.73,0,0,0,0-28.7l-147.11-254.8A28.7,28.7,0,0,0,1089,228.5Z"
                                                transform="translate(-616.48 -226)"
                                            />
                                            <path className="cls-1" d="M639.5,145.5" transform="translate(-616.48 -226)" />
                                            <image
                                                x="225.415"
                                                y="186"
                                                width="200"
                                                height="200"
                                                xlinkHref={isDarkTheme ? hobby.icone_white : hobby.icone_black}
                                            />
                                        </svg>

                                        {/* {hobby.url} */}
                                        <div className="ml-4 flex-grow">
                                            <h2 className="text-lg font-medium dark:text-white">{hobby.name}</h2>
                                        </div>
                                    </div>
                                    <p className="mt-5 text-sm text-gray-600 dark:text-gray-400">{hobby.description}</p>
                                </div>
                            </div>
                        </div>
                    </Suspense>
                ))}

                {/* loading spinner */}
                {hobbies.length > 10 && (
                    <div
                        ref={ref}
                        className='col-span-1 mt-16 flex items-center justify-center sm:col-span-2 md:col-span-3 lg:col-span-4'
                    >
                        <Icons.spinner />
                        <span className='sr-only'>Loading...</span>
                    </div>
                )}
            </ScrollArea>
            <Button className="self-end mt-4" onClick={saveSelectedHobbiesToCookie} >Valider</Button>
        </>
    );
};

export default CardGroupeSetup;

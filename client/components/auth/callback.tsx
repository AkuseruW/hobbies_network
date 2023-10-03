'use client'
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setAuthCookies } from '@/utils/_auth_cookies';

const CallbackPage = () => {
    const router = useRouter();
    const params = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            let url
            if (params.get('provider') === 'github') {
                url = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/callback_github?code=${params.get('code')}`
            } else {
                url = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/callback_google?code=${params.get('code')}`
            }
            try {
                const response = await fetch(url);

                if (response.ok) {
                    const { token, lastname, firstname, profile_picture, id, role } = await response.json();

                    await setAuthCookies(token, lastname, firstname, profile_picture, id, role);
                    router.push("/");
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des données de GitHub:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [params, router]);

    return (
        <>
            <h1 className="text-2xl font-semibold mb-4">Connexion en cours...</h1>
            {isLoading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
            ) : (
                <p className="text-gray-600 dark:text-white">La connexion a réussi. Redirection en cours...</p>
            )}
        </>
    );
};

export default CallbackPage;


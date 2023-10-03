import { NextResponse, NextRequest } from 'next/server'

export const middleware = async (request: NextRequest) => {
    // Exclude requests for static files
    if (request.nextUrl.pathname.startsWith('/_next/static')) {
        return
    }
    // Retrieve the session token from cookies
    const token = request.cookies.get('access_token')?.value
    const session = request.cookies.get('auth')?.value

    // Check if the current page is the login page or register page
    const isLoginPage = request.nextUrl.pathname.startsWith('/connexion');
    const isRegisterPage = request.nextUrl.pathname === '/inscription';

    if (!token && !isLoginPage && !isRegisterPage) {
        return NextResponse.redirect(new URL('/connexion', request.url))
    }

    if (token && session) {
        const user = JSON.parse(session);
        // Check if the session data for lastname and firstname is missing
        const isMissingSessionData = !user.lastname || !user.firstname
        // Check if the current page is "setup", "login", or "register"
        // const isExcludedPage = request.nextUrl.pathname === '/setup' || 'setup/hobbies' || 'setup/confirmation'
        const isExcludedPage = request.nextUrl.pathname.startsWith('/setup');

        if (isMissingSessionData && !isExcludedPage) {
            // Redirect the user to the setup page
            return NextResponse.redirect(new URL('/setup', request.url))
        }

        const adminPage = request.nextUrl.pathname.startsWith('/dashboard')

        if (adminPage && user.role !== 'ROLE_ADMIN') {
            return NextResponse.redirect(new URL('/error/forbidden-access', request.url)) 
        }
    }


}
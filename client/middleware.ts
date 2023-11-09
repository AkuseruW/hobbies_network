import { NextResponse, NextRequest } from 'next/server'
import { me } from './utils/requests/_auth_requests'

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
    const isPrivacyPage = request.nextUrl.pathname.startsWith('/privacy');
    const isTermsPage = request.nextUrl.pathname.startsWith('/terms');
    const isForgotPasswordPage = request.nextUrl.pathname.startsWith('/forgot-password');
    const isBannedPage = request.nextUrl.pathname.startsWith('/error/banned');


    if (!token && !isLoginPage && !isRegisterPage && !isPrivacyPage && !isTermsPage && !isForgotPasswordPage) {
        return NextResponse.redirect(new URL('/connexion', request.url))
    }

    if (token && session) {
        const user = JSON.parse(session);
        // check if the user is already logged in
        if (isLoginPage || isRegisterPage || isForgotPasswordPage) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        // Check if the session data for lastname and firstname is missing
        const isMissingSessionData = !user.lastname || !user.firstname
        // Check if the current page is "setup", "login", or "register"
        const isExcludedPage = request.nextUrl.pathname.startsWith('/setup');

        if (isMissingSessionData && !isExcludedPage) {
            // Redirect the user to the setup page
            return NextResponse.redirect(new URL('/setup', request.url))
        }

        // Check if the user is an admin
        const adminPage = request.nextUrl.pathname.startsWith('/dashboard')
        if (adminPage && user.role !== 'ROLE_ADMIN') {
            return NextResponse.redirect(new URL('/error/forbidden-access', request.url))
        }
    }

    const isUserValid = await me()

    if (isUserValid.detail === 'Your account is banned.' && !isBannedPage) {
        return NextResponse.redirect(new URL('/error/banned', request.url))
    }

}
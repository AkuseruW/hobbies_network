import type { Metadata } from 'next'
import { ThemeProvider } from '@/providers/theme_provider';
import { Toaster } from '@/components/ui/toaster';
import { CookieSettings } from '@/components/CookieSettings';
import { cookies } from 'next/headers'
import './globals.css'
import { Inter, Poppins } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})


export const metadata: Metadata = {
  title: 'Hobbies',
  openGraph: {
    title: 'Hobbies',
    description: "Hobbies est un réseau social qui vous permet de connecter avec d'autres personnes qui partagent vos mêmes passe-temps. Que vous soyez passionné de cuisine, de sport, de musique, de voyages, de jeux vidéo, ou de toute autre activité, vous trouverez sur Hobbies une communauté de personnes avec qui partager votre passion.",
    images: ['/octagon.svg'],
    type: 'website',
  },
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const isApprovedCokkie = cookies().get('_cookie_settings')
  return (
    <html lang="fr" className={`min-h-screen ${inter.className}`} suppressHydrationWarning >
      <body className=' bg-background_light dark:bg-background_dark p-0 m-0'>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          {!isApprovedCokkie && <CookieSettings />}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
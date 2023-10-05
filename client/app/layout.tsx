import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/providers/theme_provider';
import { Toaster } from '@/components/ui/toaster';


export const metadata: Metadata = {
  title: 'Hobbies',
  // openGraph: {
  //   title: 'Hobbies',
  //   description: "Hobbies est un réseau social qui vous permet de connecter avec d'autres personnes qui partagent vos mêmes passe-temps. Que vous soyez passionné de cuisine, de sport, de musique, de voyages, de jeux vidéo, ou de toute autre activité, vous trouverez sur Hobbies une communauté de personnes avec qui partager votre passion.",
  //   images: ['/octagon.svg'],
  // },
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="fr" className='min-h-screen' suppressHydrationWarning>
      <body className='min-h-screen bg-[#f0f2f5] dark:bg-gray-900 p-0 m-0'>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
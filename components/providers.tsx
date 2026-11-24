'use client';
import {ThemeProvider} from 'next-themes';
import {AtlasLanguageProvider} from '@/lib/atlas-i18n';
export default function Providers({children}:{children:React.ReactNode}){return <ThemeProvider attribute="class" defaultTheme="system" enableSystem><AtlasLanguageProvider>{children}</AtlasLanguageProvider></ThemeProvider>}

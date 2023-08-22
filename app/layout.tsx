"use client";

import './globals.css'
import {Inter} from 'next/font/google'
import {ToastProvider} from "@/components/providers/toast-provider";
import {ThemeProvider} from "@/components/providers/theme-provider";
import React from "react";
import {SessionProvider} from "next-auth/react";
import {CalendarEventProvider} from "@/components/providers/calendar-event-provider";

const inter = Inter({subsets: ['latin']})

export default function RootLayout({children,}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
            <link rel="icon" href="/favicon.ico"/>
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
            <link rel="manifest" href="/site.webmanifest"/>
        </head>
        <body className={inter.className}>
        <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                <ToastProvider/>
                {children}
                <CalendarEventProvider/>
            </ThemeProvider>
        </SessionProvider>
        </body>
        </html>
    )
}

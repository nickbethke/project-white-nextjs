"use client";

import './globals.css'
import {Inter} from 'next/font/google'
import {ToastProvider} from "@/lib/providers/toast-provider";
import {ThemeProvider} from "@/lib/providers/theme-provider";
import React from "react";
import {SessionProvider} from "next-auth/react";
import {CalendarEventProvider} from "@/lib/providers/calendar-event-provider";

const inter = Inter({subsets: ['latin']})

export default function RootLayout({children,}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <title>Project White</title>
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

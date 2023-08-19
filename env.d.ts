// Description: This file contains the type definitions for the environment variables.
declare namespace NodeJS {
    interface ProcessEnv {
        APP_HOST: string
        DATABASE_URL: string
        JWT_SECRET_KEY: string
        JWT_EXPIRES_IN: string
        SMTP_HOST: string
        SMTP_PORT: string
        SMTP_USER: string
        SMTP_PASSWORD: string
        SMTP_FROM: string
        SMTP_FROM_NAME: string
        NEXTAUTH_SECRET: string
        NEXTAUTH_URL: string
        PROJECT_WHITE_DATE_FORMAT: string
        PROJECT_WHITE_TIME_FORMAT: string
        PROJECT_WHITE_DATETIME_FORMAT: string
    }
}

import {SMTPClient} from "emailjs";

export class Mail {
    private static client = new SMTPClient({
        user: process.env.SMTP_USER,
        password: process.env.SMTP_PASSWORD,
        host: process.env.SMTP_HOST,
        ssl: true,
    });

    static async sendEmail({to, subject, html}: { to: string, subject: string, html: string }) {
        const message = {
            text: subject,
            from: process.env.SMTP_FROM as string,
            to,
            subject,
            attachment: [{data: html, alternative: true}],
        };
        console.log(message);
        await this.client.sendAsync(message);
    }

}

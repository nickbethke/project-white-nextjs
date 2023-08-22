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
            from: `Project White <${process.env.SMTP_FROM}>`,
            to,
            subject,
            attachment: [{data: html, alternative: true}],
        };
        await this.client.sendAsync(message);
    }

}

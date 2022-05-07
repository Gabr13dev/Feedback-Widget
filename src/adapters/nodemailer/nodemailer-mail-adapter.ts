import { SendMailData } from "../mail.adapter";
import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "8e81da79bc3d18",
      pass: "370401fc070ae8"
    }
  });

export class NodemailerMailAdapter{
    async sendMail({subject, body}: SendMailData) {
        await transport.sendMail({
            from: '"Fred Foo 👻" <Widget Team>',
            to: 'Gabriel Almeida <gabriel.almeida.p@outlook.com>',
            subject,
            html: body
        });
    }
}
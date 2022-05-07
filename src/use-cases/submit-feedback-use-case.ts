import { MailAdapter } from "../adapters/mail.adapter";
import { FeedbacksRepository } from "../repositories/feedbacks-repository";

interface SubmitFeedbackUseCaseRequest{
    type: string;
    comment: string;
    url: string;
    resultUploadLocation: string;
}

export class SubmitFeedbackUseCase {
    constructor(
        private feedbacksRepository: FeedbacksRepository,
        private mailAdapter: MailAdapter
    ) {}

    async execute(request: SubmitFeedbackUseCaseRequest) {
        const { type, comment, url, resultUploadLocation } = request;

        if(!resultUploadLocation.startsWith('https://feedbackwidget.s3.sa-east-1.amazonaws.com/')){
            throw new Error('Invalid result upload aws s3');
        }

        this.feedbacksRepository.create({
            type,
            comment,
            url,
            resultUploadLocation,
        });

        await this.mailAdapter.sendMail({
            subject: 'New Feedback [' + request.type + ']',
            body: [
                `<div style="font-family: sans-serif; font-size: 16px; color: #222;">`,
                `<h1>New feedback</h1>`,
                `<p>Type: ${request.type}</p> `,  
                `<p>Comment: ${request.comment}</p> `,
                `<p>Url: ${request.url}</p> `,
                `<p>Screenshoot: <img src="${request.resultUploadLocation}" alt="screenshoot" /></p> </div>`,].join("\n")
        })
    }
}
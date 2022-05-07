import { SubmitFeedbackUseCase } from "./submit-feedback-use-case";

const createFeedbackSpy = jest.fn();
const sendMailSpy = jest.fn();

const submitFeedbackUseCase = new SubmitFeedbackUseCase(
    { create: createFeedbackSpy },
    { sendMail: sendMailSpy }
);

describe('Sumbit feedback', () => {   
    it('should be able to submit a feedback', async () => {
        await expect(submitFeedbackUseCase.execute({
            type: 'bug',
            comment: 'This is a comment',
            url: 'http://www.google.com',
            resultUploadLocation: 'https://feedbackwidget.s3.sa-east-1.amazonaws.com/sadsaidqiqiooqioqioioioq',
        })).resolves.not.toThrow();

        expect(createFeedbackSpy).toHaveBeenCalled();
        expect(sendMailSpy).toHaveBeenCalled();
    })

    it('should not be able to submit a feedback without upload aws s3 screenshoot', async () => {
        await expect(submitFeedbackUseCase.execute({
            type: 'bug',
            comment: 'This is a comment',
            url: 'http://www.google.com',
            resultUploadLocation: 'http://www.google.com/image.png',
        })).rejects.toThrow();
    })
})
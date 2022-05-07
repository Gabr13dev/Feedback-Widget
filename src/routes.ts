import express from 'express';
import { NodemailerMailAdapter } from './adapters/nodemailer/nodemailer-mail-adapter';
import { PrismaFeedbacksRepository } from './repositories/prisma/prisma-feedbacks-repository';
import { SubmitFeedbackUseCase } from './use-cases/submit-feedback-use-case';

const { upload } = require('./s3');

export const routes = express.Router();

routes.post('/feedbacks', async (req, res) => {
    const { imageScreenshoot, typeFeedback, comment, url, screenshootPath} = req.body;

    const dateNow = new Date();
    const filename = `${dateNow.getFullYear()}${dateNow.getMonth() + 1}${dateNow.getDate()}${dateNow.getHours()}${dateNow.getMinutes()}${dateNow.getSeconds()}${dateNow.getMilliseconds()}.png`;
    const resultUpload = await upload(imageScreenshoot, filename);
    
    const primsaFeedbacksRepository = new PrismaFeedbacksRepository();
    const nodemailerMailAdapter = new NodemailerMailAdapter();
    const submitFeedbackUseCase = new SubmitFeedbackUseCase(
        primsaFeedbacksRepository,
        nodemailerMailAdapter
    );

    await submitFeedbackUseCase.execute({
        type: typeFeedback,
        comment: comment,
        url: url,
        resultUploadLocation: resultUpload.Location,
    })
       
   return res.status(201).send();
})
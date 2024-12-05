import s3 from 'aws-sdk/clients/s3';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import dotenv from 'dotenv';

dotenv.config();

const bucket_name = process.env.S3_AWS_BUCKET;
const region = process.env.S3_AWS_REGION;
const access_key = process.env.S3_AWS_USER_KEY;
const secret_key = process.env.S3_AWS__USER_SECRETKEY;

const s3client = new s3({
    region,
    accessKeyId: access_key,
    secretAccessKey: secret_key,
});


export function upload(base64: string, filename: string) {
    const img = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""),'base64');
    const params: PutObjectRequest = {
        Bucket: bucket_name!,
        Key: "screenshoots/"+filename,
        Body: img,
        ACL: 'public-read',
    };
    return s3client.upload(params).promise();
}

export async function download(filename: string) {
    const params = {
        Bucket: bucket_name,
        Key: "screenshoots/" + filename,
    };

    try {
        const data = await s3client.getObject(params).promise();

        const extension = filename.split('.').pop().toLowerCase();
        let mimeType;
        switch (extension) {
            case 'jpg':
            case 'jpeg':
                mimeType = 'image/jpeg';
                break;
            case 'png':
                mimeType = 'image/png';
                break;
            case 'pdf':
                mimeType = 'application/pdf';
                break;
            default:
                mimeType = 'application/octet-stream';
                break;
        }

        const base64data = data.Body.toString('base64');
        return `data:${mimeType};base64,${base64data}`;
    } catch (error) {
        console.error(`Erro ao baixar o arquivo ${filename}:`, error);
        throw error;
    }
}

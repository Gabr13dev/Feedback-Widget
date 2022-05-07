export interface FeedbackCreateData {
    type: string;
    comment: string;
    url: string;
    resultUploadLocation: string;
}

export interface FeedbacksRepository{
    create:(data: FeedbackCreateData) => Promise<void>;
}
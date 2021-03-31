import { Document, model, Schema } from "mongoose";
import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsCommand } from "@aws-sdk/client-s3";

export interface FileDocument extends Document {
    path: string,
    mime: string, // is this needed?
    createDate: number
    updateDate: number
}

const fileSchema = new Schema<FileDocument>({
    path: { type: String, required: true },
    mime: String,
    createDate: { type: Number, default: Date.now },
    updateDate: { type: Number, default: Date.now }
});

fileSchema.statics.uploadObject = function(path: string, file: any) {
    // general path should be specified; specific details of the path might be arbitrarily set
    // upload the file to S3
    // write new object info in mongoose File collection
}

export default model<FileDocument>('File', fileSchema, 'files');
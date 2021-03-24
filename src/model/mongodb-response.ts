import { ObjectID } from "mongodb";

export interface MongodbResponse {
    _id: ObjectID;
    length: number;
    chunkSize: number;
    uploadDate: Date;
    filename: string;
    md5: string;
    contentType: string;
}

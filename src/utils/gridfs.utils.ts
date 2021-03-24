import { getConnection,MongoClient } from "typeorm";
import { GridFSBucket } from "mongodb";

export class GridfsUtils {
    private constructor() { }

    public static connection(bucketName: string) {
        const mongoClient = (getConnection("mongodb").driver as any).queryRunner.databaseConnection as MongoClient;
        const db: any = mongoClient.db("note");
        const gridfs = new GridFSBucket(db, { bucketName: bucketName });
        return gridfs;

    }

}

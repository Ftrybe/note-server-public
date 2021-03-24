import { Request, Response } from "express";
import { File } from "../entity/file.mg";
import { AjaxResult } from "../model/ajax-result";
import { Stream } from "stream";
import ClassValidateUtils from "../utils/class-validate.utils";
import { Base64Utils } from "../utils/base64.utils";
import { UserUtils } from "../utils/user.utils";
import { GridfsUtils } from "../utils/gridfs.utils";
import { MongodbResponse } from "../model/mongodb-response";
import { FileResponse } from "../model/file-response";
import { ObjectID } from "mongodb";
import redisUtils from "../utils/redis.utils";

export class FileController {
    public async save(req: Request, rsp: Response) {
        const file: File = req.body;

        if (await ClassValidateUtils.add(File, file, rsp)) {
            return;
        }
        const gridfs = GridfsUtils.connection(file.bucketName);

        const fileInfo = Base64Utils.deCode(file.data);

        const fileName = UserUtils.getUserId(rsp) + "." + fileInfo.fileSuffer;

        await gridfs.find({ filename: fileName }).map(async (f: MongodbResponse) => {
            gridfs.delete(f._id);
        }).toArray();

        const bufferStream = new Stream.PassThrough();
        bufferStream.end(fileInfo.buffer);
        bufferStream.pipe(gridfs.openUploadStream(fileName, { contentType: fileInfo.type }))
            .on('error', (error) => {
                console.log("Some error occured:" + error);
                rsp.send(AjaxResult.fail("上传失败"));
            })
            .on('finish', (info: MongodbResponse) => {
                const fileResponse = new FileResponse();
                fileResponse.deleteUrl = "file/" + info._id;
                fileResponse.downloadUrl = "download/" + info._id;
                fileResponse.size = info.length;
                fileResponse.filename = info.filename;
                if (fileInfo.fileType == "image") {
                    fileResponse.imageUrl = file.bucketName + "/" + info._id;
                }
                const ajaxResult = new AjaxResult();
                ajaxResult.setData(fileResponse);
                rsp.send(ajaxResult);
            });
    }

    private async delete(req: Request, rsp: Response) {
        const file: File = req.body;
        if (await ClassValidateUtils.add(File, file, rsp)) {
            return;
        }
        const gridfs = GridfsUtils.connection(file.bucketName);
        gridfs.delete(file.id);
        rsp.send(AjaxResult.success("删除成功"));
    }

    public profile(req: Request, rsp: Response) {
        FileController.getImage(req, rsp, "profile");
    }

    public async notice(req: Request, rsp: Response) {
        // _this.default.getImage(req, rsp, "notice");
        redisUtils.set("test:a:d","11sdada");
        // const num = await redisUtils.get("num");
        
        // if(num > 0){
        //     redisUtils.set("num",num-1);
        //     console.log(num-1)
    
        // }else{
        //     console.log("失败")
        // }

        rsp.send(AjaxResult.success());
    }

    private static async getImage(req: Request, rsp: Response, bucketName: string) {
        let id = req.params.id;
        let objectID = new ObjectID(id);
        const gridfs = GridfsUtils.connection(bucketName);
        const size = await gridfs.find(objectID).count();
        if(size<1){
            objectID = new ObjectID("5e9430ada8cdf738905260d5");
        }
        gridfs.openDownloadStream(objectID).on('error', (err) => {
            console.log(err);
        }).on("data", (data: MongodbResponse) => {
            rsp.contentType = "image/jpeg" as any;
            rsp.write(data);
            rsp.end();
        })
    }

}
export default new FileController();

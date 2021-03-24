import { BaseRouter } from "./base.router";
import FileController from "../controller/file.controller";

export class FileRouter extends BaseRouter{
    constructor() {
        super("/file",null,FileController);
    }
    get(){
        this.router.get("/profile/:id",FileController.profile);
        this.router.get("/notice/:id",FileController.notice);
    }
    // post(){
    //     this.router.post("/upload",[checkToken()],FileController.save);
    // }
    mount(){
        this.get();
        this.post();
    }
}

export default new FileRouter().router;

import { SysDiaryController } from "../controller/sys-diary.controller";
import { BaseRouter } from "./base.router";
import { checkDiary, checkToken } from "../middlewares";

class SysDiaryRouter extends BaseRouter{
    
    constructor() {
       super("/diary",checkDiary,SysDiaryController);
    }
    extend(){
        this.router.delete("/diaries",checkToken(),SysDiaryController.batchDelete);
    }
}

export default new SysDiaryRouter().router;



import { Router } from "express";
import { checkToken } from "../middlewares/check-jwt";
import * as pluralize from 'pluralize';
import { addInfo } from "../middlewares";
import { RequestTypeEnum } from "../enums/request-type.enum";

export abstract class BaseRouter {
    public router: Router;
    protected url:any;
    private checkRole;
    private controller;
    constructor(url?:string | any, role?, controller?) {
        this.setUrl(url);
        this.setRole(role);
        this.setController(controller);
        this.router = Router();
        this.mount();
    }

    get(): void {
        this.router.get(this.url.id, [checkToken(), this.checkRole()], this.controller.get);
    };

    post(): void {
        this.router.post(this.url.default, [checkToken(),addInfo(RequestTypeEnum.POST)], this.controller.save);
    };

    put(): void {
        this.router.put(this.url.default, checkToken(), this.controller.update);
    };

    delete(): void {
        this.router.delete(this.url.id, checkToken(), this.controller.delete);
    };

    list(): void{
        this.router.get(this.url.plural, checkToken(), this.controller.list);
    }

    extend(): void { };

    mount(): void {
        this.get();
        this.post();
        this.put();
        this.delete();
        this.list();
        this.extend();
    }
    private setUrl(baseUrl: string) {
        this.url = {
            id: baseUrl + '/:id',
            default: baseUrl,
            plural: pluralize.plural(baseUrl?baseUrl:"")

        }
    }
    private setRole(role) {
        this.checkRole = role || null;
    }
    private setController(controller) {
        this.controller = controller || null;
    }

}
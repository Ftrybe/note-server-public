import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Response } from "express";
import { AjaxResult } from "../model/ajax-result";
import { DEFAULTGROUP, EDITGROUP, ADDGROUP } from "../validator/group";
import { ObjectUtils } from "./object.utils";

export default class ClassValidateUtils {
    constructor() {

    }

    public static async deafault(entity: any, data: Object, rsp: Response, isSkipMissingProperties: boolean = true) {
        const errors: ValidationError[] = await validate(plainToClass(entity, data), {
            skipMissingProperties: isSkipMissingProperties,
            groups: DEFAULTGROUP
        });
        return ClassValidateUtils.error(errors,rsp);
    }
    
    public static async add(entity: any, data: Object, rsp: Response, isSkipMissingProperties: boolean = true) {
        const errors: ValidationError[] = await validate(plainToClass(entity, data), {
            skipMissingProperties: isSkipMissingProperties,
            groups: ADDGROUP
        });
        return ClassValidateUtils.error(errors,rsp);
    }

    public static async edit(entity: any, data: Object, rsp: Response, isSkipMissingProperties: boolean = true) {
        const errors: ValidationError[] = await validate(plainToClass(entity, data), {
            skipMissingProperties: isSkipMissingProperties,
            groups: EDITGROUP
        });

        return ClassValidateUtils.error(errors,rsp);
     
    }

    private static error(errors,rsp): boolean{
        if (ObjectUtils.isNotEmpty(errors)) {
            const constraints = errors[0].constraints;
            for (let key in constraints) {
                rsp.send(AjaxResult.fail(constraints[key]));
                return true;
            }
        }
        return false;
    }

}
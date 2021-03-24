import { plainToClass, classToClass } from "class-transformer";
import { ClassType } from "class-transformer/ClassTransformer";

export class ObjectUtils {
    public static isEmpty(object: any): boolean {

        if (object === null || object === undefined) {
            return true;
        }

        if (object.length <= 0) {
            return true;
        }
        return object ? false : true;
    }

    public static isNotEmpty(object: any): boolean {
        return !this.isEmpty(object);
    }

    public static HumpToLine(name) {
        return name.replace(/([A-Z])/g, "_$1").toLowerCase();
    }

    public static JsonToClass<T>(string: string, type: ClassType<T>): T {
        let json = {};
        if(string){
            json = JSON.parse(string);
        }
        return plainToClass(type, json);
    }
}
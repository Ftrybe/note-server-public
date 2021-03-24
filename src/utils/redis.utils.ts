import {promisify} from "util";
import redis from "../config/redis.config";

export class RedisUtils {
    public async get(key:string):Promise<any>{
        const redisGet = promisify(redis.get).bind(redis);
        return await redisGet(key);
    }
    public set(key:string,value:any,expireTime?:number){
        redis.set(key,value);
        expireTime ? redis.expire(key,expireTime): '';
    }

    public setnx(key:string,value:any,expireTime:number = -1){
        redis.setnx(key,value);
        redis.expire(key,expireTime);
    }
}
export default new RedisUtils();

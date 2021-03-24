import { RedisClient } from 'redis';
/* 
    redis配置类
*/
export class Redis {
    public client: RedisClient;

    constructor() {
        // var isDev = process.env.NODE_ENV == "development";
        this.client = new RedisClient({
            host:  "127.0.0.1",
            port: 6379,
            password: "admin",
            db: 1,
            retry_strategy: (options) => {
                if (options.error && options.error.code === 'ECONNREFUSED') {
                    // End reconnecting on a specific error and flush all commands with
                    // a individual error
                    return new Error('The server refused the connection');
                }
                if (options.total_retry_time > 1000) {
                    // End reconnecting after a specific timeout and flush all commands
                    // with a individual error
                    return new Error('Retry time exhausted');
                }
                if (options.attempt > 10) {
                    // End reconnecting with built in error
                    return undefined;
                }
                // reconnect after
                return Math.min(options.attempt * 100, 3000);
            }
        });
    }
}
export default new Redis().client;
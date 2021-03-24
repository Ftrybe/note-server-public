import express from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes';
import AliyunConfig from './config/ali-oss.config';

class Server {
  public express;

  constructor() {
    this.express = express()
    this.config()
  }
  // 挂载其他插件
  private config(): void {
    // 跨域设置
    this.express.use(cors({
      origin: "*",
      methods: "PUT,POST,GET,DELETE,OPTIONS",
      allowedHeaders: "Content-Type,Content-Length, Authorization, Accept,X-Requested-With",
      optionsSuccessStatus: 204
    }));
    this.express.use(bodyParser.urlencoded({ limit:'5mb',parameterLimit:5000, extended: true }));
    this.express.use(bodyParser.json({limit:'5mb'}));
    // 挂载路由
    this.express.use("/", routes);

  }
}
export default new Server().express;
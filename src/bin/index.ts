import "reflect-metadata";
import {createConnections, ConnectionOptions} from "typeorm";
import server from '../server'
/* 
    入口文件，注册typeorm连接
*/
const port = process.env.PORT || 3000

createConnections().then(async connection => {
    server.listen(port, () => {
        console.info("服务器启动:端口->" + port+ new Date());
    });

}).catch(error => console.log(error));
import * as path from 'path';
export class PathUtils{
    public static getRootDir(): string{
        return path.join(__dirname,'../');
    }
}
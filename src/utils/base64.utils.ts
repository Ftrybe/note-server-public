export class Base64Utils {
    private constructor() { }

    public static deCode(string: any) {
        let arr = string.split(",");
        const main = arr.pop();
        let header = arr[0];
        let type = header.split(":").pop().split(";")[0];
        const fileSuffer = type.split("/").pop();
        const fileType = type.split("/")[0];
        const buffer = Buffer.from(main, "base64");
        return {
            buffer: buffer,
            type: type,
            fileSuffer: fileSuffer,
            fileType:fileType
        }
    }
}

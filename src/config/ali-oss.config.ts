import OSS, { Credentials, Options, STS } from "ali-oss";

export default class AliyunConfig {

    private readonly AccessKeyId = "AccessKeyId";
    private readonly AccessKeySecret = "AccessKeySecret";
    private readonly RoleArn = "RoleArn";
    private readonly TokenExpireTime = "3600";
    public readonly Bucket = "Bucket";
    private readonly Endpoint = "https://sts.cn-shenzhen.aliyuncs.com";
    public readonly Region = "oss-cn-shenzhen"
    
    public newStsClient(): STS {
        return new STS({
            accessKeyId: this.AccessKeyId,
            accessKeySecret: this.AccessKeySecret,
            bucket: this.Bucket
        });
    }

    public client(options?: Options): OSS {
        return new OSS(options ? options : {
            accessKeyId: this.AccessKeyId,
            accessKeySecret: this.AccessKeySecret,
            bucket: this.Bucket,
            region: this.Region
        })
    }

    public async getToken(allowObjectPrefix: string, roleSessionName: string, isWrite: Boolean = true): Promise<Credentials> {
        const client = this.newStsClient();
        const policy = isWrite ? this.getWritePolicy(this.Bucket, allowObjectPrefix) : this.getReadPolicy(this.Bucket,allowObjectPrefix);
        
        try {
            const stsResponse = await client.assumeRole(this.RoleArn, policy, this.TokenExpireTime, roleSessionName,{
                bucket: this.Bucket
            });
            if (stsResponse.res.status == 200) {
                stsResponse.credentials.AllowObjectPrefix = allowObjectPrefix;
                return stsResponse.credentials;
            }
            return null;
        } catch(e) {
            console.error(e);
            return null;
        }
    }

    private getWritePolicy(bucket: string, allowObjectPrefix: string) {
      
        return "{\n" +
            "  \"Statement\": [\n" +
            "    {\n" +
            "      \"Action\": [\n" +
            "        \"oss:PutObject\",\n" +
            "        \"oss:ListParts\",\n" +
            "        \"oss:AbortMultipartUpload\"\n" +
            "      ],\n" +
            "      \"Effect\": \"Allow\",\n" +
            "      \"Resource\": [\"acs:oss:*:*:" + bucket + "/" + allowObjectPrefix + "*\"]\n" +
            "    }\n" +
            "  ],\n" +
            "  \"Version\": \"1\"\n" +
            "}";
    }


    private getReadPolicy(bucket: string, allowObjectPrefix: string): string {
        return "{\n" +
            "  \"Statement\": [\n" +
            "    {\n" +
            "      \"Action\": [\n" +
            "        \"oss:GetObject\"\n" +
            "      ],\n" +
            "      \"Effect\": \"Allow\",\n" +
            "      \"Resource\": [\"acs:oss:*:*:" + bucket + "/" + allowObjectPrefix + "*\"]\n" +
            "    }\n" +
            "  ],\n" +
            "  \"Version\": \"1\"\n" +
            "}";
    }

}

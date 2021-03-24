
declare module 'ali-oss' {

    interface Options {
        accessKeyId: string; // access secret you create
        accessKeySecret: string; // access secret you create
        stsToken?: string; // used by temporary authorization
        bucket?: string; //  the default bucket you want to access If you don't have any bucket, please use putBucket() create one first.
        endpoint?: string; // oss region domain. It takes priority over region.
        region?: string; // the bucket data region location, please see Data Regions, default is oss-cn-hangzhou.
        internal?: boolean; //  access OSS with aliyun internal network or not, default is false. If your servers are running on aliyun too, you can set true to save lot of money.
        secure?: boolean; // instruct OSS client to use HTTPS (secure: true) or HTTP (secure: false) protocol.
        timeout?: string | number; // instance level timeout for all operations, default is 60s
        cname?: boolean; // use custom domain name
    }

    interface Bucket {
        name: string;
        region: string;
        creationDate: string;
        StorageClass: StorageType;
    }

    type StorageType = 'Standard' | 'IA' | 'Archive';

    type ACLType = 'public-read-write' | 'public-read' | 'private';

    type HTTPMethods = 'GET' | 'POST' | 'DELETE' | 'PUT';

    interface RequestOptions {
        // the operation timeout
        timeout?: number;
    }

    type RuleStatusType = 'Enabled' | 'Disabled';

    interface LifecycleRule {
        id?: string; // rule id, if not set, OSS will auto create it with random string.
        prefix: string; // store prefix
        status: RuleStatusType; // rule status, allow values: Enabled or Disabled
        days?: number | string; // expire after the days
        date: string; // expire date, e.g.: 2022-10-11T00:00:00.000Z date and days only set one.
    }

    interface CORSRule {
        allowedOrigin: string | string[]; // configure for Access-Control-Allow-Origin header
        allowedMethod: string | string[]; // configure for Access-Control-Allow-Methods header
        allowedHeader?: string | string[]; // configure for Access-Control-Allow-Headers header
        exposeHeader?: string | string[]; // configure for Access-Control-Expose-Headers header
        maxAgeSeconds?: string | string[]; // configure for Access-Control-Max-Age header
    }

    interface OwnerType {
        id: string;
        displayName: string;
    }

    interface ObjectMeta {
        name: string; // object name on oss
        lastModified: string; // object last modified GMT date, e.g.: 2015-02-19T08:39:44.000Z
        etag: string; // object etag contains ", e.g.: "5B3C1A2E053D763E1B002CC607C5A0FE"
        type: string; // object type, e.g.: Normal
        size: number; // object size, e.g.: 344606
        storageClass: StorageType;
        owner: OwnerType;
    }

    interface NormalSuccessResponse {
        // response status
        status: number;
        // response headers
        headers: object; // todo the object in detail
        // response size
        size: number;
        //  request total use time (ms)
        rt: number;
    }

    interface UserMeta {
        uid: number;
        pid: number;
    }

    interface ObjectCallback {
        url: string; // After a file is uploaded successfully, the OSS sends a callback request to this URL.
        host?: string; // The host header value for initiating callback requests.
        body: string; // The value of the request body when a callback is initiated, for example, key=$(key)&etag=$(etag)&my_var=$(x:my_var).
        contentType?: string; // The Content-Type of the callback requests initiatiated, It supports application/x-www-form-urlencoded and application/json, and the former is the default value.
        customValue?: object;
        headers?: object; //  extra headers, detail see RFC 2616
    }

    interface ModifyData {
        lastModified: string; //  object last modified GMT string
        etag: string; // object etag contains ", e.g.: "5B3C1A2E053D763E1B002CC607C5A0FE"
    }

    interface Checkpoint {
        file: any; // The file object selected by the user, if the browser is restarted, it needs the user to manually trigger the settings
        name: string; //  object key
        fileSize: number;
        partSize: number;
        uploadId: string;
        doneParts: Array<{ number: number; etag: string }>;
    }

    interface ObjectPart {
        PartNumber: number;
        LastModified: any; // {Date} Time when a part is uploaded.
        ETag: string;
        size: number;
    }

    interface Upload {
        name: string;
        uploadId: string;
        initiated: any;
    }

    interface Channel {
        Name: string;
        Description: string;
        Status: string;
        LastModified: string;
        PublishUrls: string[];
        PlayUrls: string[];
    }

    interface ChannelHistory {
        StartTime: string; //
        EndTime: string;
        RemoteAddr: string; //  the remote addr
    }
    // parameters type
    interface ListBucketsQueryType {
        prefix?: string; // search buckets using prefix key
        marker?: string; // search start from marker, including marker key
        'max-keys'?: string | number; // max buckets, default is 100, limit to 1000
    }

    interface PutBucketOptions {
        timeout: number;
        storageClass: StorageType;
    }

    interface PutBucketWebsiteConfig {
        index: string; // default page, e.g.: index.html
        error?: string; // error page, e.g.: 'error.html'
    }

    interface ListObjectsQuery {
        prefix?: string; // search object using prefix key
        marker?: string; // search start from marker, including marker key
        delimiter?: string; // delimiter search scope e.g. / only search current dir, not including subdir
        'max-keys': string | number; // max objects, default is 100, limit to 1000
    }

    interface ListObjectResult {
        objects: ObjectMeta[];
        prefixes: string[];
        isTruncated: boolean;
        nextMarker: string;
        res: NormalSuccessResponse;
    }

    interface STSOptions {
        accessKeyId?: string; // the operation timeout
        accessKeySecret?: string; // custom mime, will send with Content-Type entity header
        endpoint?: string; // custom mime, will send with Content-Type entity header
        timeout?: string | number; // instance level timeout for all operations, default is 60s
        bucket?: string;
    }

    interface PutObjectOptions {
        timeout?: number; // the operation timeout
        mime?: string; // custom mime, will send with Content-Type entity header
        meta?: UserMeta; // user meta, will send with x-oss-meta- prefix string e.g.: { uid: 123, pid: 110 }
        callback?: ObjectCallback;
        headers?: object;
    }

    interface PutObjectResult {
        name: string;
        url: string;
        data: object;
        res: NormalSuccessResponse;
    }

    interface PutStreamOptions {
        contentLength?: number; // the stream length, chunked encoding will be used if absent
        timeout: number; // the operation timeout
        mime: string; // custom mime, will send with Content-Type entity header
        meta: UserMeta;
        callback: ObjectCallback;
        headers?: object;
    }

    interface AppendObjectOptions {
        position?: string; // specify the position which is the content length of the latest object
        timeout?: number; // the operation timeout
        mime?: string; // custom mime, will send with Content-Type entity header
        meta?: UserMeta;
        headers?: object;
    }

    interface AppendObjectResult {
        name: string;
        url: string; // the url of oss
        res: NormalSuccessResponse;
        nextAppendPosition: string; // the next position
    }

    interface HeadObjectOptions {
        timeout?: number;
        headers?: object;
    }

    interface HeadObjectResult {
        status: number; // response status, maybe 200 or 304
        meta: UserMeta;
        res: NormalSuccessResponse;
    }

    interface GetObjectOptions {
        timeout?: number;
        process?: string; // image process params, will send with x-oss-process e.g.: {process: 'image/resize,w_200'}
        headers?: object;
    }

    interface GetObjectResult {
        content?: any; // file content buffer if file parameter is null or ignore
        res: NormalSuccessResponse;
    }

    interface GetStreamOptions {
        timeout?: number;
        process?: string; // image process params, will send with x-oss-process e.g.: {process: 'image/resize,w_200'}
        headers?: object;
    }

    interface GetStreamResult {
        stream?: any; // readable stream instance if response status is not 200, stream will be null.
        res: NormalSuccessResponse;
    }

    interface CopyObjectOptions {
        timeout?: number;
        meta?: UserMeta;
        headers?: object;
    }

    interface CopyAndPutMetaResult {
        data: ModifyData;
        res: NormalSuccessResponse;
    }

    interface DeleteMultiOptions {
        quite?: boolean; // quite mode or verbose mode, default is false
        timeout?: number;
    }

    interface DeleteMultiResult {
        deleted?: string[]; // deleted object names list
        res: NormalSuccessResponse;
    }

    interface ResponseHeaderType {
        'content-type'?: string;
        'content-disposition'?: string;
        'cache-control'?: string;
    }

    interface SignatureUrlOptions {
        expires?: number; // after expires seconds, the url will become invalid, default is 1800
        method?: HTTPMethods; // the HTTP method, default is 'GET'
        'Content-Type'?: string; // set the request content type
        process?: string;
        response?: ResponseHeaderType; // set the response headers for download
        callback?: ObjectCallback;
    }

    interface GetACLResult {
        acl: ACLType;
        res: NormalSuccessResponse;
    }

    interface InitMultipartUploadOptions {
        timeout?: number;
        mime?: string; // Mime file type
        meta?: UserMeta;
        headers?: object;
    }

    interface InitMultipartUploadResult {
        res: { status: number; headers: object; size: number; rt: number };
        bucket: string; // bucket name
        name: string; // object name store on OSS
        uploadId: string; // upload id, use for uploadPart, completeMultipart
    }

    interface UploadPartResult {
        name: string;
        etag: string;
        res: NormalSuccessResponse;
    }

    interface CompleteMultipartUploadOptions {
        timeout?: number;
        callback?: ObjectCallback;
        headers?: object;
    }

    interface CompleteMultipartUploadResult {
        bucket: string;
        name: string;
        etag: string;
        data: object;
        res: NormalSuccessResponse;
    }

    interface MultipartUploadOptions {
        parallel?: number; // the number of parts to be uploaded in parallel
        partSize?: number; // the suggested size for each part
        progress?: (...args: any[]) => any; // the progress callback called after each successful upload of one part
        checkpoint?: Checkpoint; // the checkpoint to resume upload, if this is provided, it will continue the upload from where interrupted, otherwise a new multipart upload will be created.
        meta?: UserMeta;
        mime?: string;
        callback?: ObjectCallback;
        headers?: object;
        timeout?: number;
        copyheaders?: object; //  {Object} only uploadPartCopy api used, detail
    }

    interface MultipartUploadResult {
        bucket: string;
        name: string;
        etag: string;
        data: object;
        res: NormalSuccessResponse;
    }

    interface MultipartUploadCopyResult {
        bucket: string;
        name: string;
        etag: string;
        res: NormalSuccessResponse;
    }

    interface MultipartUploadCopySourceData {
        sourceKey: string; // the source object name
        sourceBucketName: string; // sourceData.  the source bucket name
        startOffset: number; // data copy start byte offset, e.g: 0
        endOffset: number; // data copy end byte offset, e.g: 102400
    }

    interface ListPartsQuery {
        'max-parts': number; // The maximum part number in the response of the  default value: 1000.
        'part-number-marker': number; // Starting position of a specific list. A part is listed only when the part number is greater than the value of this parameter.
        'encoding-type': string; // Specify the encoding of the returned content and the encoding type. Optional value: url
    }

    interface ListPartsResult {
        uploadId: string;
        bucket: string;
        name: string;
        PartNumberMarker: number;
        nextPartNumberMarker: number;
        maxParts: number;
        isTruncated: boolean;
        parts: ObjectPart[];
        res: NormalSuccessResponse;
    }

    interface ListUploadsQuery {
        prefix?: string;
        'max-uploads'?: number;
        'key-marker'?: string;
        'upload-id-marker'?: string;
    }

    interface ListUploadsResult {
        res: NormalSuccessResponse;
        bucket: string;
        nextKeyMarker: any;
        nextUploadIdMarker: any;
        isTruncated: boolean;
        uploads: Upload[];
    }

    interface PutChannelConf {
        Description?: string;
        Status?: string;
        Target?: {
            Type: string;
            FragDuration: number;
            FragCount: number;
            PlaylistName: string;
        };
    }

    interface PutChannelResult {
        publishUrls: string[];
        playUrls: string[];
        res: NormalSuccessResponse;
    }

    interface GetChannelResult {
        Status: string;
        ConnectedTime?: string;
        RemoteAddr?: string;
        Video?: object;
        Audio?: object;
        res: NormalSuccessResponse;
    }

    interface ListChannelsQuery {
        prefix: string; // the channel id prefix (returns channels with this prefix)
        marker: string; // the channel id marker (returns channels after this id)
        'max-keys ': number; // max number of channels to return
    }

    interface ListChannelsResult {
        channels: Channel[];
        nextMarker: string | null;
        isTruncated: boolean;
        res: NormalSuccessResponse;
    }

    interface ChannelHistoryResult {
        records: ChannelHistory;
        res: NormalSuccessResponse;
    }

    interface GetRtmpUrlOptions {
        expires?: number; // the expire time in seconds of the url
        params?: object; // the additional parameters for url, e.g.: {playlistName: 'play.m3u8'}
        timeout?: number; // the operation timeout
    }

    interface ClusterType {
        host: string;
        accessKeyId: string;
        accessKeySecret: string;
    }

    interface ClusterOptions {
        clusters: ClusterType[];
        schedule?: string;
    }

    class Cluster {
        constructor(options: ClusterOptions);

        list(query: ListObjectsQuery | null, options: RequestOptions): Promise<ListObjectResult>;

        put(name: string, file: any, options?: PutObjectOptions): Promise<PutObjectResult>;

        putStream(
            name: string,
            stream: any,
            options?: PutStreamOptions
        ): Promise<{ name: string; res: NormalSuccessResponse }>;

        head(name: string, options?: HeadObjectOptions): Promise<HeadObjectResult>;

        get(name: string, file?: any, options?: GetObjectOptions): Promise<GetObjectResult>;

        getStream(name?: string, options?: GetStreamOptions): Promise<GetStreamResult>;

        delete(name: string, options?: RequestOptions): Promise<NormalSuccessResponse>;

        copy(name: string, sourceName: string, options?: CopyObjectOptions): Promise<CopyAndPutMetaResult>;

        putMeta(name: string, meta: UserMeta, options: RequestOptions): Promise<CopyAndPutMetaResult>;

        deleteMulti(names: string[], options?: DeleteMultiOptions): Promise<DeleteMultiResult>;

        signatureUrl(name: string, options?: SignatureUrlOptions): string;

        putACL(name: string, acl: ACLType, options?: RequestOptions): Promise<NormalSuccessResponse>;

        restore(name: string, options?: RequestOptions): Promise<NormalSuccessResponse>;
    }

    interface ImageClientOptions {
        imageHost: string; // your image service domain that binding to a OSS bucket
        accessKeyId: string; // access key you create on aliyun console website
        accessKeySecret: string; // access secret you create
        bucket: string; //  the default bucket you want to access If you don't have any bucket, please use putBucket() create one first.
        region?: string; // the bucket data region location, please see Data Regions, default is oss-cn-hangzhou
        internal?: boolean; // access OSS with aliyun internal network or not, default is false If your servers are running on aliyun too, you can set true to save lot of money.
        timeout?: string | number; // instance level timeout for all operations, default is 60s
    }

    interface ImageGetOptions {
        timeout?: number;
        headers?: object;
    }

    interface StyleData {
        Name: string; // style name
        Content: string; // style content
        CreateTime: string; // style create time
        LastModifyTime: string; // style last modify time
    }

    class ImageClient {
        constructor(options: ImageClientOptions);

        /**
         * Get an image from the image channel.
         */
        get(name: string, file?: any, options?: ImageGetOptions): Promise<{ content: any; res: NormalSuccessResponse }>;

        /**
         * Get an image read stream.
         */
        getStream(name: string, options?: ImageGetOptions): Promise<{ stream: any; res: NormalSuccessResponse }>;

        /**
         * Get a image exif info by image object name from the image channel.
         */
        getExif(name: string, options?: RequestOptions): Promise<{ data: object; res: NormalSuccessResponse }>;

        /**
         * Get a image info and exif info by image object name from the image channel.
         */
        getInfo(name: string, options?: RequestOptions): Promise<{ data: object; res: NormalSuccessResponse }>;

        /**
         * todo
         */
        putStyle(
            name: string,
            style: string,
            options?: RequestOptions
        ): Promise<{ data: object; res: NormalSuccessResponse }>;

        /**
         * Get a style by name from the image channel.
         */
        getStyle(name: string, options?: RequestOptions): Promise<{ data: StyleData; res: NormalSuccessResponse }>;

        /**
         * Get all styles from the image channel.
         */
        listStyle(options?: RequestOptions): Promise<StyleData[]>;

        /**
         * todo
         */
        deleteStyle(styleName: string, options?: RequestOptions): Promise<NormalSuccessResponse>;

        /**
         * Create a signature url for directly download.
         */
        signatureUrl(name: string, options?: { expires?: string; timeout?: string }): string;
    }

    export default class OSS {
        constructor(options: Options);

        /******************************************* the bucket operations *************************************************/

        // base operators
        /**
         * List buckets in this account.
         */
        listBuckets(query: ListBucketsQueryType | null, options?: RequestOptions): Promise<Bucket[]>;

        /**
         * Create a new bucket.
         */
        putBucket(
            name: string,
            options?: PutBucketOptions
        ): Promise<{ bucket: string; res: NormalSuccessResponse }>;

        /**
         * Use the bucket.
         */
        useBucket(name: string): void;

        /**
         * Delete an empty bucket.
         */
        deleteBucket(name: string, options?: RequestOptions): Promise<NormalSuccessResponse>;

        /**
         * Get bucket information,include CreationDate、ExtranetEndpoint、IntranetEndpoint、Location、Name、StorageClass、 Owner、AccessControlList
         */
        getBucketInfo(name: string): Promise<any>;

        /**
         * Get bucket location
         */
        getBucketLocation(name: string): Promise<any>;

        // ACL operations
        /**
         * Update the bucket ACL.
         */
        putBucketACL(name: string, acl: ACLType, options?: RequestOptions): Promise<NormalSuccessResponse>;

        /**
         * Get the bucket ACL.
         *   acl - acl settings string
         */
        getBucketACL(name: string, options?: RequestOptions): Promise<{ acl: string; res: NormalSuccessResponse }>;

        // logging operations
        /**
         * Update the bucket logging settings. Log file will create every one hour and name format: <prefix><bucket>-YYYY-mm-DD-HH-MM-SS-UniqueString.
         */
        putBucketLogging(name: string, prefix?: string, options?: RequestOptions): Promise<NormalSuccessResponse>;

        /**
         * Get the bucket logging settings.
         */
        getBucketLogging(
            name: string,
            options?: RequestOptions
        ): Promise<{ enable: boolean; prefix: string | null; res: NormalSuccessResponse }>;

        /**
         * Delete the bucket logging settings.
         */
        deleteBucketLogging(name: string, options?: RequestOptions): Promise<NormalSuccessResponse>;

        // Website operations
        /**
         * Set the bucket as a static website.
         */
        putBucketWebsite(name: string, config: PutBucketWebsiteConfig): Promise<NormalSuccessResponse>;

        /**
         * Get the bucket website config.
         */
        getBucketWebsite(
            name: string,
            options?: RequestOptions
        ): Promise<{ index: string; error: string; res: NormalSuccessResponse }>;

        /**
         * Delete the bucket website config.
         */
        deleteBucketWebsite(name: string, options?: RequestOptions): Promise<NormalSuccessResponse>;

        // referer operations
        /**
         * Set the bucket request Referer white list.
         */
        putBucketReferer(
            name: string,
            allowEmpty: boolean,
            referers: string[],
            options?: RequestOptions
        ): Promise<NormalSuccessResponse>;

        /**
         * Get the bucket request Referer white list.
         */
        getBucketReferer(
            name: string,
            options?: RequestOptions
        ): Promise<{ allowEmpty: boolean; referers: string[]; res: NormalSuccessResponse }>;

        /**
         * Delete the bucket request Referer white list.
         */
        deleteBucketReferer(name: string, options?: RequestOptions): Promise<NormalSuccessResponse>;

        // lifecycle operations
        /**
         * Set the bucket object lifecycle.
         */
        putBucketLifecycle(
            name: string,
            rules: LifecycleRule[],
            options?: RequestOptions
        ): Promise<NormalSuccessResponse>;

        /**
         * Get the bucket object lifecycle.
         */
        getBucketLifecycle(
            name: string,
            options?: RequestOptions
        ): Promise<{ rules: LifecycleRule[]; res: NormalSuccessResponse }>;

        /**
         * Delete the bucket object lifecycle.
         */
        deleteBucketLifecycle(name: string, options?: RequestOptions): Promise<NormalSuccessResponse>;

        // CORS operations
        /**
         * Set CORS rules of the bucket object
         */
        putBucketCORS(
            name: string,
            rules: CORSRule[],
            options?: RequestOptions
        ): Promise<NormalSuccessResponse>;

        /**
         * Get CORS rules of the bucket object.
         */
        getBucketCORS(name: string): Promise<{ rules: CORSRule[]; res: NormalSuccessResponse }>;

        /**
         * Delete CORS rules of the bucket object.
         */
        deleteBucketCORS(name: string): Promise<NormalSuccessResponse>;

        /********************************************************** Object operations ********************************************/
        /**
         * List objects in the bucket.
         */
        list(query: ListObjectsQuery | null, options: RequestOptions): Promise<ListObjectResult>;

        /**
         * Add an object to the bucket.
         */
        put(name: string, file: any, options?: PutObjectOptions): Promise<PutObjectResult>;

        /**
         * Add a stream object to the bucket.
         */
        putStream(
            name: string,
            stream: any,
            options?: PutStreamOptions
        ): Promise<{ name: string; res: NormalSuccessResponse }>;

        /**
         * Append an object to the bucket, it's almost same as put, but it can add content to existing object rather than override it.
         */
        append(name: string, file: any, options?: AppendObjectOptions): Promise<AppendObjectResult>;

        /**
         * Get the Object url. If provide baseUrl, will use baseUrl instead the default endpoint.
         */
        getObjectUrl(name: string, baseUrl?: string): string;

        /**
         * Get the Object url. If provide baseUrl, will use baseUrl instead the default bucket and endpoint. Suggest use generateObjectUrl instead of getObjectUrl.
         */
        generateObjectUrl(name: string, baseUrl?: string): string;

        /**
         * Head an object and get the meta info.
         */
        head(name: string, options?: HeadObjectOptions): Promise<HeadObjectResult>;

        /**
         * Get an object from the bucket.
         */
        get(name: string, file?: any, options?: GetObjectOptions): Promise<GetObjectResult>;

        /**
         * Get an object read stream.
         */
        getStream(name?: string, options?: GetStreamOptions): Promise<GetStreamResult>;

        /**
         * Delete an object from the bucket.
         */
        delete(name: string, options?: RequestOptions): Promise<NormalSuccessResponse>;

        /**
         * Copy an object from sourceName to name.
         */
        copy(name: string, sourceName: string, options?: CopyObjectOptions): Promise<CopyAndPutMetaResult>;

        /**
         * Set an exists object meta.
         */
        putMeta(name: string, meta: UserMeta, options: RequestOptions): Promise<CopyAndPutMetaResult>;

        /**
         * Delete multi objects in one request.
         */
        deleteMulti(names: string[], options?: DeleteMultiOptions): Promise<DeleteMultiResult>;

        /**
         * Create a signature url for download or upload object. When you put object with signatureUrl ,you need to pass Content-Type.Please look at the example.
         */
        signatureUrl(name: string, options?: SignatureUrlOptions): string;

        /**
         * Set object's ACL.
         */
        putACL(name: string, acl: ACLType, options?: RequestOptions): Promise<NormalSuccessResponse>;

        /**
         * Get object's ACL.
         */
        getACL(name: string, options?: RequestOptions): Promise<GetACLResult>;

        /**
         * Restore Object.
         */
        restore(name: string, options?: RequestOptions): Promise<NormalSuccessResponse>;

        /**
         * multi upload
         */
        initMultipartUpload(name: string, options?: InitMultipartUploadOptions): Promise<InitMultipartUploadResult>;

        /**
         * After initiating a Multipart Upload event, you can upload data in parts based on the specified object name and Upload ID.
         */
        uploadPart(
            name: string,
            uploadId: string,
            partNo: number,
            file: any,
            start: number,
            end: number,
            options?: RequestOptions
        ): Promise<UploadPartResult>;

        /**
         * Using Upload Part Copy, you can copy data from an existing object and upload a part of the data.
         * When copying a file larger than 1 GB, you must use the Upload Part Copy method. If you want to copy a file smaller than 1 GB, see Copy Object.
         */
        uploadPartCopy(
            name: string,
            uploadId: string,
            partNo: number,
            range: string,
            sourceData: { sourceKey: string; sourceBucketName: string },
            options: { timeout?: number; headers?: object }
        ): Promise<UploadPartResult>;

        /**
         * After uploading all data parts, you must call the Complete Multipart Upload API to complete Multipart Upload for the entire file.
         */
        completeMultipartUpload(
            name: string,
            uploadId: string,
            parts: Array<{ number: number; etag: string }>,
            options?: CompleteMultipartUploadOptions
        ): Promise<CompleteMultipartUploadResult>;

        /**
         * Upload file with OSS multipart.
         */
        multipartUpload(name: string, file: any, options: MultipartUploadOptions): Promise<MultipartUploadResult>;

        /**
         * Copy file with OSS multipart.
         * this function contains head, initMultipartUpload, uploadPartCopy, completeMultipartUpload.
         * When copying a file larger than 1 GB, you should use the Upload Part Copy method. If you want to copy a file smaller than 1 GB, see Copy Object.
         */
        multipartUploadCopy(
            name: string,
            sourceData: MultipartUploadCopySourceData,
            options?: MultipartUploadOptions
        ): Promise<MultipartUploadCopyResult>;

        /**
         * The ListParts command can be used to list all successfully uploaded parts mapped to a specific upload ID, i.e.: those not completed and not aborted.
         */
        listParts(
            name: string,
            uploadId: string,
            query?: ListPartsQuery,
            options?: RequestOptions
        ): Promise<ListPartsResult>;

        /**
         * List on-going multipart uploads, i.e.: those not completed and not aborted.
         */
        listUploads(query: ListUploadsQuery, options?: RequestOptions): Promise<ListUploadsResult>;

        /**
         * Abort a multipart upload for object.
         */
        abortMultipartUpload(
            name: string,
            uploadId: string,
            options?: RequestOptions
        ): Promise<NormalSuccessResponse>;

        /************************************************ RTMP Operations *************************************************************/
        /**
         * Create a live channel.
         */
        putChannel(id: string, conf: PutChannelConf, options?: RequestOptions): Promise<PutChannelResult>;

        /**
         * Get live channel info.
         */
        getChannel(
            id: string,
            options?: RequestOptions
        ): Promise<{ data: PutChannelConf; res: NormalSuccessResponse }>;

        /**
         * Delete a live channel.
         */
        deleteChannel(id: string, options?: RequestOptions): Promise<NormalSuccessResponse>;

        /**
         * Change the live channel status.
         */
        putChannelStatus(id: string, status?: string, options?: RequestOptions): Promise<NormalSuccessResponse>;

        /**
         * Get the live channel status.
         */
        getChannelStatus(id: string, options?: RequestOptions): Promise<GetChannelResult>;

        /**
         * List channels.
         */
        listChannels(query: ListChannelsQuery, options?: RequestOptions): Promise<ListChannelsResult>;

        /**
         * Get the live channel history.
         */
        getChannelHistory(id: string, options?: RequestOptions): Promise<ChannelHistoryResult>;

        /**
         * Create a VOD playlist for the channel.
         */
        createVod(
            id: string,
            name: string,
            time: { startTime: number; endTime: number },
            options?: RequestOptions
        ): Promise<NormalSuccessResponse>;

        /**
         * Get signatured rtmp url for publishing.
         */
        getRtmpUrl(channelId?: string, options?: GetRtmpUrlOptions): string;
    }

    interface Credentials{
        SecurityToken:string;
        AccessKeyId:string;
        AccessKeySecret:string;
        Expiration:string;
        AllowObjectPrefix: string;
    }

    interface STSResult{
        res: any;
        credentials: Credentials;
    }

    export class STS {

        constructor(options: STSOptions);

        assumeRole(role: string, policy: string, expiration?: string, session?: string, options?: STSOptions): Promise<STSResult>;
    }
}

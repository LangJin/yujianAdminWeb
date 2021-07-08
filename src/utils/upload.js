import {
    v4 as uuidv4
} from 'uuid'
const config = require("@/utils/tent-cloud");
var COS = require('cos-js-sdk-v5');

var cos = new COS({
    SecretId: config.SecretId,
    SecretKey: config.SecretKey,
    // 可选参数
    // FileParallelLimit: 3, // 控制文件上传并发数
    // ChunkParallelLimit: 8, // 控制单个文件下分片上传并发数，在同园区上传可以设置较大的并发数
    // ChunkSize: 1024 * 1024 * 8, // 控制分片大小，单位 B，在同园区上传可以设置较大的分片大小
    // Proxy: '',
    // Protocol: 'https:',
});

//  export let taskId = undefined;

//上传文件
export function putObject(file) {
    return new Promise(function (resolve, reject) {
        cos.putObject({
                Bucket: config.Bucket /* 必须 */ ,
                Region: config.Region /* 必须 */ ,
                Key: file.name /* 必须 */ ,
                StorageClass: "STANDARD",
                /* 对象的存储类型（标准） */
                Body: file, // 上传文件对象
                TaskReady: function (tid) {
                    // this.taskId = tid;
                    console.log("tid: ", tid);
                },
                onProgress: function (progressData) {
                    console.log(JSON.stringify(progressData));
                },
            },
            function (err, data) {
                console.log(err || data);
                err ? reject(err) : resolve(data)
            }
        );
    })
}

//获取文件下载地址，并下载文件
export function getObjectUrl(fileName) {
    return new Promise(function (resolve, reject) {
        cos.getObjectUrl({
            Bucket: config.Bucket,
            Region: config.Region,
            /* 存储桶所在地域*/
            Key: fileName,
            Sign: true
        }, function (err, data) {
            console.log(err || data);
            // if(err) return console.log(err)
            // let downloadUrl = data.Url+(data.Url.indexOf('?') > -1 ? '&':'?')+'response-content-disposition=attachment'; // 补充强制下载的参数
            // window.open(downloadUrl);   // 这里是新窗口打开 url，如果需要在当前窗口打开，可以使用隐藏的 iframe 下载，或使用 a 标签 download 属性协助下载
            err ? reject(err) : resolve(data)
        });
    })
}

//取消上传
export function cancelTask() {
    // cos.cancelTask(this.taskId);
}

//设置跨域cors
export function putBucketCors() {
    cos.putBucketCors({
        Bucket: 'examplebucket-1250000000',
        /* 必须 */
        Region: 'COS_REGION',
        /* 存储桶所在地域，必须字段 */
        CORSRules: [{
            "AllowedOrigin": ["*"],
            "AllowedMethod": ["GET", "POST", "PUT", "DELETE", "HEAD"],
            "AllowedHeader": ["*"],
            "ExposeHeader": ["ETag", "x-cos-acl", "x-cos-version-id", "x-cos-delete-marker", "x-cos-server-side-encryption"],
            "MaxAgeSeconds": "5"
        }]
    }, function (err, data) {
        console.log(err || data);
    });
}

//文件重命名
export function renameFile(file) {
    let extension = file.name.substring(file.name.lastIndexOf('.'));
    let newName = '';
    let date = new Date();
    let d = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + "/";
    newName = d.concat(uuidv4().trim()).concat(extension);
    var newFile = new File([file], newName);
    return newFile;
}
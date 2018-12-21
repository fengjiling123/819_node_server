import express from 'express';
import Upload from '../contraller/upload';
var config = require('config-lite')(__dirname);

//multer 中间件 用于处理 multipart/form-data 类型的表单数据
import multer from 'multer';

//设置配置文件 （上传后的文件路径与文件名）
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public' + config.uploadImgPath)
    },
    filename: function (req, file, cb) {
        var str = file.originalname.split('.')
        cb(null, Date.now() + '.' + str[str.length - 1])
    }
})

//添加配置文件到multer 对象
let upload = multer({ storage: storage })

const router = express.Router();

//upload.array('file', 数量上限) 批量上传图片   re,files/req.file  获取上传的文件
router.post('/', upload.single('file'), Upload.upload);

export default router;


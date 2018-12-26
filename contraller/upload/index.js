import UploadImgModel from '../../models/upload/uploadImg';
import moment from 'moment';
import xlsx from 'node-xlsx';
import fs from 'fs';
import path from 'path';
var config = require('config-lite')(__dirname);

class Upload {
    async upload (req, res, next) {
        try {
            console.log(req.file)
            const newImg = { url: config.uploadImgPath + req.file.filename }
            await UploadImgModel.create(newImg);
            res.send({
                code: 1000,
                meg: 'ok',
                time: moment().format('YYYY-MM-DD HH:mm'),
                data: {
                    url: config.serviceAddress + config.uploadImgPath + req.file.filename
                }
            })
        } catch (err) {
            res.send({
                code: 1006,
                msg: err.message,
                time: moment().format('YYYY-MM-DD HH:mm')
            });
        }
    }

    async downloadExcel (req, res, next) {
        try {
            let data = [
                {
                    name: 'sheet1',
                    data: [
                        ['手机', '姓名', '医院', '一级科室', '二级科室', '职称', '身份证', '开户行名称', '支行名称', '银行卡号', '每月应得金额', '每月应工作时间'] //第一行数据
                    ]
                }
            ]
            let buffer = xlsx.build(data);
            // const fileName = new Date().getTime() + '.xlsx'
            const fileName = '身份审核模板.xlsx'

            //确定该文件夹存在
            let logDirectory = './public/xlsx';
            fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

            const filtPath = path.resolve(logDirectory, fileName)

            if (fs.existsSync(filtPath)) {
                res.download(filtPath, fileName);
                // res.sendFile(filtPath); ???无法自定义保存的文件名
                return;
            }
            fs.writeFileSync(filtPath, buffer, 'binary');
            res.download(filtPath, fileName);
        } catch (err) {
            res.send({
                code: 1006,
                msg: err.message,
                time: moment().format('YYYY-MM-DD HH:mm')
            });
        }
    }

    async uploadExcel (req, res, next) {
        try {
            var newFile = req.file;
            console.log(newFile)
            let path = newFile.path;
            var obj = xlsx.parse(path); //读xlsx
            console.log(obj)
            fs.unlink(path, () => { console.log('文件删除成功') })
            res.send({
                code: 1000,
                msg: err.message,
                time: moment().format('YYYY-MM-DD HH:mm')
            });
        } catch (err) {
            res.send({
                code: 1006,
                msg: err.message,
                time: moment().format('YYYY-MM-DD HH:mm')
            });
        }
    }
}

export default new Upload();
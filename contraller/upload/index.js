import UploadImgModel from '../../models/upload/uploadImg';
import moment from 'moment';
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
}

export default new Upload();
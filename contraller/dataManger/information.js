
import BaseCompoment from '../baseComponent';
import InformationModel from '../../models/dataManger/information';
import moment from 'moment';
class Information extends BaseCompoment {
    constructor() {
        super();
        this.createInfromation = this.createInfromation.bind(this);
    }

    async createInfromation (req, res, next) {
        try {
            const uid = await this.getUid('information');
            const newInformation = { ...req.body, createTime: moment().format('YYYY-MM-DD HH:mm'), id: uid.value };
            await InformationModel.create(newInformation);
            res.send({
                code: 1000,
                msg: 'ok',
                time: moment().format('YYYY-MM-DD HH:mm')
            })
        } catch (err) {
            res.send({
                code: 1006,
                msg: err.message,
                time: moment().format('YYYY-MM-DD HH:mm')
            });
        }
    }

    async getInformation (req, res, next) {
        try {
            const { limit, page, status, startTime, endTime } = req.query;

            let filter = {};
            if (status) filter.status = status;
            if (startTime && endTime) {
                filter.createTime = { $gte: startTime + ' 00:00', $lte: endTime + ' 24:00' };
            } else if (startTime) {
                filter.createTime = { $gte: startTime + ' 00:00' };
            } else if (endTime) {
                filter.createTime = { $lte: endTime + ' 24:00' };
            }

            const totalCount = await InformationModel.find(filter).count();
            const list = await InformationModel.find(filter).skip(limit * (page - 1)).limit(Number(limit));
            res.send({
                code: 1000,
                mes: 'ok',
                data: { data: list, totalCount }
            })
        } catch (err) {
            res.send({
                code: 1006,
                msg: err.message,
                time: moment().format('YYYY-MM-DD HH:mm')
            });
        }
    }

    async delAll (req, res, next) {
        try {
            const ids = req.body.ids;
            console.log(ids)
            await InformationModel.deleteMany({ id: { $in: ids } });

            //  db.dropDatabase(); 释放磁盘空间
            res.send({
                code: 1000,
                mes: 'ok',
                time: moment().format('YYYY-MM-DD HH:mm')
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

export default new Information();
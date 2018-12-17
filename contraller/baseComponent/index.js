
import Uid from '../../models/uid/index';
import moment from 'moment';

class BaseComponent {
    constructor() {

    };
    async getUid(uidname) {
        try {
            let uidata = await Uid.findOne({ uidname });
            if (!uidata) {
                await Uid.create({ uidname, value: 1, lastupdateTime: moment().format('YYYY-MM-DD HH:mm') });
            } else {
                await Uid.findOneAndUpdate({ uidname: uidname }, { $inc: { value: 1 } });
            };
            let newData = await Uid.findOne({ uidname });
            return newData
        } catch (err) {
            console.log(err);
        }

    };
}

export default BaseComponent;
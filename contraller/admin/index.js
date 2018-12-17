
import Users from '../../models/admin/users';
import BaseComponent from '../BaseComponent/index';
import moment from 'moment';
class AdminInfo extends BaseComponent {
    constructor() {
        super();
        this.userCreate = this.userCreate.bind(this)
    };

    async adminList(req, res, next) {
        try {
            const usersList = await Users.find().skip(0).limit(2);
            const count = await Users.find().countDocuments();
            res.send({ data: { count, usersList }, message: 'ok' });
        } catch (err) {
            console.log(err)
            res.send({
                type: '数据库操作异常',
                message: err.message,
            });
        }
    };

    async  userCreate(req, res, next) {
        const { nickname, username, phone, password, rid } = req.body;
        try {
            if (!username) { throw new Error('登陆名不能为空') };
            if (!nickname) { throw new Error('用户名不能为空') };
            if (!phone) { throw new Error('联系方式不能为空') };
            if (!password) { throw new Error('密码不能为空') };
            if (!rid) { throw new Error('角色ID不能为空') };
            const uid = await this.getUid('admin');
            const addUser = {
                ...req.body,
                uid:uid.value,
                lastLoginTime: moment().format('YYYY-MM-DD HH:mm')
            };
          
            const newUser = await Users.create(addUser);
            res.send({ msg: '注册成功', code: 10001, data: { ...newUser._doc }, time: moment().format('YYYY-MM-DD HH:mm') });
        } catch (err) {
            console.log(err)
            res.send({
                code: 1006,
                msg: err.message,
                time: moment().format('YYYY-MM-DD HH:mm')
            });
        }
    }
}

export default new AdminInfo();

import Users from '../../models/admin/users';
import BaseComponent from '../BaseComponent/index';
import Module from '../../models/admin/modlue';
import Roles from '../../models/admin/roles';
import moment from 'moment';
import { throws } from 'assert';
class AdminInfo extends BaseComponent {
    constructor() {
        super();
        this.userCreate = this.userCreate.bind(this);
        this.roleCreate = this.roleCreate.bind(this);
    };

    async adminList (req, res, next) {
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

    async  userCreate (req, res, next) {
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
                uid: uid.value,
                lastLoginTime: moment().format('YYYY-MM-DD HH:mm')
            };

            const newUser = await Users.create(addUser);
            res.send({ msg: '注册成功', code: 1000, data: { ...newUser._doc }, time: moment().format('YYYY-MM-DD HH:mm') });
        } catch (err) {
            console.log(err)
            res.send({
                code: 1006,
                msg: err.message,
                time: moment().format('YYYY-MM-DD HH:mm')
            });
        }
    }

    async roleCreate (req, res, next) {
        const { name, permissions } = req.body;
        try {
            if (!name) { throw new Error('角色名不能为空') };
            if (!permissions || !permissions.length > 0) { throw new Error('权限列表不能为空') };
            const rid = await this.getUid('roles');
            const newRole = {
                name,
                rid: rid.value,
                permissions
            }
            await Roles.create(newRole);
            res.send({
                code: 1000,
                msg: 'ok',
                data: []
            });
        } catch (err) {
            res.send({
                code: 1006,
                msg: err.message,
                time: moment().format('YYYY-MM-DD HH:mm')
            });
        }
    }

    async getRolesList (req, res, next) {
        try {
            const rolesList = await Roles.find({}, { name: 1, rid: 1, _id: 0 });
            res.send({
                code: 1000,
                msg: 'ok',
                data: rolesList,
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

    async moduleList (req, res, next) {
        try {
            const authsList = await Module.find();
            res.send({
                code: 1000,
                data: authsList,
                msg: 'ok',
                time: moment().format('YYYY-MM-DD HH:mm')
            })
        } catch (err) {
            res.send({
                code: 1006,
                type: '获取模块列表失败',
                msg: err.message,
                time: moment().format('YYYY-MM-DD HH:mm')
            })
        }

    }

    async getUsersList (req, res, next) {
        try {
            const { limit = 10, page = 1 } = req.query;
            const totalCount = await Users.find().countDocuments();
            const skip = limit * (page - 1);
            // const usersList = await Users.find().skip(skip).limit(Number(limit));

            //关联表查询
            const usersList = await Users.aggregate(
                [{
                    $lookup:
                    {
                        from: "roles",
                        localField: "rid",
                        foreignField: "rid",
                        as: "role"
                    },

                }, { $project: { _id: 0 } }, { $skip: skip }, { $limit: Number(limit) }]);
                // { $addFields: { roleName: { $substr: ["$role", 0, 3] } } },

            res.send({
                code: 1000,
                data: { data: usersList, totalCount },
                msg: 'ok',
                time: moment().format('YYYY-MM-DD HH:mm')
            })
        } catch (err) {
            res.send({
                code: 1006,
                type: '获取管理员列表失败',
                msg: err.message,
                time: moment().format('YYYY-MM-DD HH:mm')
            })
        }
    }
}

export default new AdminInfo();
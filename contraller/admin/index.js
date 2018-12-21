
import Users from '../../models/admin/users';
import BaseComponent from '../BaseComponent/index';
import Module from '../../models/admin/modlue';
import Roles from '../../models/admin/roles';
import moment from 'moment';
import nodeExcel from 'excel-export';
class AdminInfo extends BaseComponent {
    constructor() {
        super();
        this.userCreate = this.userCreate.bind(this);
        this.roleCreate = this.roleCreate.bind(this);
        this.insertManyUser = this.insertManyUser.bind(this);
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
            // const usersList = await Users.find().skip(skip).limit(Number(limit));

            //关联表查询
            const usersList = await Users.aggregate(
                [
                    { $skip: limit * (page - 1) },
                    { $limit: Number(limit) },
                    {
                        $lookup:
                        {
                            from: "roles",
                            localField: "rid",
                            foreignField: "rid",
                            as: "roles"
                        },
                    },
                    { $unwind: '$roles' },
                    { $addFields: { roleName: '$roles.name' } },
                    // { $project: { _id: 0, roles: { _id: 0, permissions: 0 } } },
                    { $project: { _id: 0, roles: 0 } }
                ]);

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

    async deleteUser (req, res, next) {
        try {
            const uid = req.params.uid;
            await Users.remove({ uid });
            res.send({
                code: 1000,
                msg: 'ok',
                time: moment().format('YYYY-MM-DD HH:mm')
            })
        } catch (err) {
            res.send({
                code: 1006,
                type: '删除失败',
                msg: err.message,
                time: moment().format('YYYY-MM-DD HH:mm')
            })
        }
    }

    async resetPassword (req, res, next) {
        try {
            const uid = req.params.uid;
            await Users.findOneAndUpdate({ uid }, { $set: { password: '000000 ' } });
            res.send({
                code: 1000,
                msg: 'ok',
                time: moment().format('YYYY-MM-DD HH:mm')
            })
        } catch (err) {
            res.send({
                code: 1006,
                type: '重置密码失败',
                msg: err.message,
                time: moment().format('YYYY-MM-DD HH:mm')
            })
        }
    }

    async insertManyUser (req, res, next) {
        try {
            const list = [
                { nickname: '哈哈哈哈', username: 'admin', phone: 15858112483, password: 123456, rid: 1 },
                { nickname: '5566', username: 'admin123', phone: 15858112483, password: 123456, rid: 1 },
                { nickname: '4455', username: 'admin456', phone: 15858112483, password: 123456, rid: 1 },
                { nickname: '2233', username: 'admin789', phone: 15858112483, password: 123456, rid: 1 },
                { nickname: '1122', username: 'admin112', phone: 15858112483, password: 123456, rid: 1 }
            ];
            let insertList = [];
            for (let item in list) {
                let uid = await this.getUid('admin');
                list[item].uid = uid.value;
                list[item].lastLoginTime = moment().format('YYYY-MM-DD HH:mm');
                insertList.push(list[item]);
            }

            const resList = await Users.insertMany(insertList);
            res.send({
                data: resList,
                code: 1000,
                msg: 'ok',
                time: moment().format('YYYY-MM-DD HH:mm')
            })
        } catch (err) {
            res.send({
                code: 1006,
                type: '批量插入失败',
                msg: err.message,
                time: moment().format('YYYY-MM-DD HH:mm')
            })
        }

    }

    //报错
    downLoadExcel (req, res, next) {
        // var conf = {};
        // conf.stylesXmlFile = "模板.xml";
        // conf.name = "mysheet";
        // conf.cols = [{
        //     caption: 'string',
        //     type: 'string'
        // }, {
        //     caption: 'bool',
        //     type: 'bool'
        // }, {
        //     caption: 'number',
        //     type: 'number'
        // }];
        // // conf.rows = [
        // //     ['pi', new Date(Date.UTC(2013, 4, 1)), true, 3.14],
        // // ];
        // var result = nodeExcel.execute(conf);
        // res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        // res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
        // res.send(result, 'binary');
    }
}

export default new AdminInfo();
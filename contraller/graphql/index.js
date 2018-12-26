import {
    GraphQLSchema,
    GraphQLInt,
    GraphQLFloat,
    GraphQLString,
    GraphQLBoolean,
    GraphQLList,
    GraphQLObjectType,
    GraphQLID,// ID 值，是一个序列化后值唯一的字符串，可以视作对应 ES 2015 新增的 Symbol
    GraphQLNonNull,//强制类型的值不能为 null
    GraphQLUnionType //联合类型用于描述某个字段能够支持的所有返回类型,即可能返回的类型有多重的情况下。 
} from 'graphql'

import moduleModel from '../../models/admin/modlue';

//步骤
// 1.定义用户自定义类型。类型的每个字段都必须是已定义的，且最终都是 GraphQL 中定义的类型。
// 2.定义根类型。每种根类型中包含了准备暴露给服务调用方的用户自定义类型。
// 3.定义 Schema（模型）。每一个 Schema 中允许出现三种根类型：query，mutation，subscription，其中至少要有 query。
// 


//用户自定义的类型 明确服务端有哪些字段可以用 
const Module = new GraphQLObjectType({
    name: 'module',
    description: '模板对象',
    fields: {
        pid: {
            type: GraphQLInt
        },
        module: {
            type: GraphQLString
        },
        moduleName: {
            type: GraphQLString
        },
        subModule: {
            type: GraphQLString
        },
        subModuleName: {
            type: GraphQLString
        },
        code: {
            type: GraphQLInt
        },
        message: {
            type: GraphQLString
        }
    }
});

//用户自定义的类型 明确服务端有哪些字段可以用
const MesType = new GraphQLObjectType({
    name: 'mesType',
    description: '返回信息',
    fields: {
        code: {
            type: GraphQLString
        },
        message: {
            type: GraphQLString
        }
    }
})

const UnioType = new GraphQLUnionType({
    name: 'unioType',
    types: [Module, MesType],
    resolveType (value) {
        if (value === 1) {
            return Module;
        }
        if (value === 2) {
            return MesType
        }
    }
})

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: { //根类型下的多个字段（每个字段都有用户自定义的类型）
        module: {
            type: Module,
            args: {
                pid: {
                    type: GraphQLInt
                }
            },
            resolve: async function (_, args) {
                try {
                    if (!args.pid) {
                        throw new Error('参数错误');
                    }
                    const result = await moduleModel.findOne({ pid: args.pid });
                    return result;
                } catch (err) {
                    return {
                        code: 1001,
                        message: err.message
                    }
                }
            }
        },
        modules: {
            type: new GraphQLList(Module),
            args: {
                pids: {
                    type: GraphQLString
                }
            },
            resolve: async function (root, args) {
                try {
                    let result;
                    if (args.pids) {
                        let arr = args.pids.split(',');
                        result = await moduleModel.find({ pid: { $in: arr } });
                    } else {
                        result = await moduleModel.find();
                    }
                    return result;
                } catch (err) {

                }
            }
        }
    }
});


const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        delModule: {
            type: MesType,
            args: {
                pid: {
                    type: GraphQLInt
                }
            },
            resolve: async function (_, args) {
                try {
                    await moduleModel.remove({ pid: args.pid });
                    return {
                        code: 1000,
                        message: '删除成功'
                    }
                } catch (err) {
                    return {
                        code: 1001,
                        message: err.message
                    }
                }

            }
        },
        addModule: {
            type: MesType,
            args: {
                pid: {
                    type: GraphQLInt
                },
                module: {
                    type: GraphQLString
                },
                moduleName: {
                    type: GraphQLString
                },
                subModule: {
                    type: GraphQLString
                },
                subModuleName: {
                    type: GraphQLString
                },
                action: {
                    type: GraphQLString
                },
                actionName: {
                    type: GraphQLString
                }
            },
            resolve: async function (_, args) {
                try {
                    await moduleModel.create(args);
                    return {
                        code: 1000,
                        message: '添加成功'
                    }
                } catch (err) {
                    return {
                        code: 1001,
                        message: err.message
                    }
                }
            }
        },
        updateModule: {
            type: MesType,
            args: {
                pid: {
                    type: GraphQLInt
                },
                module: {
                    type: GraphQLString
                },
                moduleName: {
                    type: GraphQLString
                },
                subModule: {
                    type: GraphQLString
                },
                subModuleName: {
                    type: GraphQLString
                }
            },
            resolve: async function (_, args) {
                try {
                    await moduleModel.update({ pid: args.pid }, { $set: { ...args } });
                    return {
                        code: 1000,
                        message: '修改成功'
                    }
                } catch (err) {
                    return {
                        code: 1001,
                        message: err.message
                    }
                }
            }
        }
    }
})

//自定义的根类型
// import Query from './query';
// import Mutation from './mutation';


//定义模型（Schema） 模型有三种根类型
// query–定义查询操作，必须有。
// mutation–定义变更操作，可以省略。
// subscription–定义订阅操作，可以省略。
const Schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation
});

export default Schema;

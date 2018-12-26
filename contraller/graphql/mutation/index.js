
import {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} from 'graphql'


import moduleModel from '../../../models/admin/modlue';
import MesType from '../types/mesType';

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

export default Mutation;

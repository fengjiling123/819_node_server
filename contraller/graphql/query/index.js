import {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} from 'graphql'

import moduleModel from '../../../models/admin/modlue';
import Module from '../types/module';
const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        module: {
            type: Module,
            args: {
                pid: {
                    type: GraphQLInt
                }
            },
            resolve: async function (_, args) {
                const result = await moduleModel.findOne({ pid: args.pid });
                return result
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

export default Query;
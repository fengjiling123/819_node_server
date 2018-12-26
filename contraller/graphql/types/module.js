

import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} from 'graphql'

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
        }
    }
});


export default Module;

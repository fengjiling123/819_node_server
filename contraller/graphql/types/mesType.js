

import {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} from 'graphql'

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

export default MesType;
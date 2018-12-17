'use strict';

import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const usersSchema = new Schema(
    {
        nickname: { type: String, required: true },
        username: { type: String, required: true },
        phone: { type: Number, required: true },
        password: { type: String, required: true },
        rid: { type: Number, required: true },
        uid: { type: Number },
        lastLoginTime: String
    },
    {versionKey: false}  //不记录版本号 _v
    // { timestamps: { createdAt: 'createdTime', updatedAt: 'updatedTime' } }
)



// usersSchema.index({ uid: 1 });


const Users = mongoose.model(
    'Users',
    usersSchema
);

export default Users;
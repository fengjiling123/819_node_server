'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const uidSchema = new Schema(
    {
        uidname: String,
        value: Number,
        lastupdateTime: String
    },
    { versionKey: false } //不记录版本号 _v);
)

const Uid = mongoose.model('Uid', uidSchema);

export default Uid;
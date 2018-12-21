import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const informationModel = new Schema(
    {
        id: Number,
        imgUrl: String,
        title: String,
        status: Number,
        publishTime: String,
        platform: Number,
        content: String,
        createTime: String,
        readAmount: { type: Number, default: 0 }, //阅读量
        commentCount: { type: Number, default: 0 }, //评论量
        focusCount: { type: Number, default: 0 } //点赞量
    },
    { versionKey: false }
);

const Information = mongoose.model('Information', informationModel);

export default Information;
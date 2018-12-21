

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UploadImg = new Schema(
    { url: String },
    { versionKey: false }
)

const UploadImgModel = mongoose.model('UploadImgs', UploadImg);

export default UploadImgModel;
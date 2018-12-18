import mongoose from 'mongoose';
import moduleList from '../../initdata/module_list';
const Schema = mongoose.Schema;
const moduleSchema = new Schema(
    {
        pid: Number,
        module: String,
        moduleName: String,
        subModule: String,
        subModuleName: String,
        action: String,
        actionName: String
    },
    { versionKey: false }  //不记录版本号 _v
)

const Module = mongoose.model('Module', moduleSchema);

Module.findOne((err, data) => {
    if (!data) {
        moduleList.forEach(item => {
            Module.create(item);
        })
    }
})

export default Module;
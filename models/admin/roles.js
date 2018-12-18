import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const rolesSchema = new Schema(
    {
        name: String,
        rid: Number,
        permissions: Array
    },
    { versionKey: false }
);

const Roles = mongoose.model('roles', rolesSchema);
export default Roles;
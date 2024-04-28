import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'Staff',
        required: true
    },
    employerID: {
        type: String,
        required: true
    },
});

const Staff = mongoose.models.staffs || mongoose.model('staffs', staffSchema)

export default Staff
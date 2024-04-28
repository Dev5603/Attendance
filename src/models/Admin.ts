import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
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
    location: [{
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    }],
    role: {
        type: String,
        default: 'Admin',
        required: true
    }
})

const Admin = mongoose.models.admins || mongoose.model('admins', adminSchema)

export default Admin
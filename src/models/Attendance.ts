import mongoose from "mongoose"

const attendanceSchema = new mongoose.Schema({
    attendance: [{
        date: {
            type: String,
            required: true
        },
        inTime: {
            type: String,
        },
        outTime: {
            type: String,
        }
    }],
    staffID: {
        type: String,
        required: true
    }
})

const Attendance = mongoose.models.attendances || mongoose.model('attendances', attendanceSchema)

export default Attendance
import { NextRequest, NextResponse } from "next/server";
import connect from "@/db/dbConfig";

import Staff from "@/models/Staff";
import Attendance from "@/models/Attendance";

connect()

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json()
        const { email } = body

        const staff = await Staff.findOne({ email: email.toLowerCase() })

        if (!staff) {
            return NextResponse.json({
                message: 'Staff not found'
            }, { status: 404 })
        }

        await Attendance.deleteMany({ staffId: email.toLowerCase() })
        await Staff.findOneAndDelete({ email: email.toLowerCase() })

        return NextResponse.json({
            message: 'Staff deleted successfully'
        }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({
            message: error.message
        }, { status: 500 })
    }
}
import { NextRequest, NextResponse } from "next/server";
import connect from "@/db/dbConfig";

import Attendance from "@/models/Attendance";

connect()

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { attendance, staffID } = body

        let record = await Attendance.findOne({ staffID: staffID.toLowerCase() })

        if (!record) {
            record = new Attendance({ staffID, attendance: [] })
        }

        record.attendance.push(...attendance)

        await record.save()

        return NextResponse.json({
            message: 'In time marked successfully'
        }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({
            message: error.message
        }, { status: 500 })
    }
}
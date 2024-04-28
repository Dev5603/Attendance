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
            return NextResponse.json({
                message: 'Attendance record not found'
            }, { status: 400 })
        }

        attendance.forEach(({ date, outTime }: any) => {
            const index = record.attendance.findIndex((entry: any) => entry.date === date && !entry.outTime)

            if (index !== -1) {
                record.attendance[index].outTime = outTime
            }
        })

        await record.save()

        return NextResponse.json({
            message: 'Out time marked successfully'
        }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({
            message: error.message
        }, { status: 500 })
    }
}
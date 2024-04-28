import { NextRequest, NextResponse } from "next/server";
import connect from "@/db/dbConfig";

import Attendance from "@/models/Attendance";

connect()

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { staffID } = body

        const report = await Attendance.find({ staffID: staffID.toLowerCase() })

        if (!report) {
            return NextResponse.json({
                message: 'Staff report not found'
            }, { status: 400 })
        }
        
        return NextResponse.json({
            report: report
        }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({
            message: error.message
        }, { status: 500 })
    }
}
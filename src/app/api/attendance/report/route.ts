import { NextRequest, NextResponse } from "next/server";
import connect from "@/db/dbConfig";

import Attendance from "@/models/Attendance";

connect()

export async function GET(request: NextRequest) {
    try {
        const reports = await Attendance.find({})

        if (!reports) {
            return NextResponse.json({
                message: 'Reports not found'
            }, { status: 400 })
        }

        return NextResponse.json({
            reports: reports
        }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({
            message: error.message
        }, { status: 500 })
    }
}
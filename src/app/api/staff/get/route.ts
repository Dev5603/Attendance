import { NextRequest, NextResponse } from "next/server";
import connect from "@/db/dbConfig";

import Staff from "@/models/Staff";

connect()

export async function GET(request: NextRequest) {
    try {
        const staffs = await Staff.find({}).select('-password')

        if (!staffs) {
            return NextResponse.json({
                message: 'Staffs not found'
            }, { status: 400 })
        }

        return NextResponse.json({
            staffs: staffs
        }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({
            message: error.message
        }, { status: 500 })
    }
}
import { NextRequest, NextResponse } from "next/server";
import connect from "@/db/dbConfig";

import Staff from "@/models/Staff";

connect()

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { staffID } = body

        const staff = await Staff.findOne({ email: staffID.toLowerCase() }).select('-password')

        if (!staff) {
            return NextResponse.json({
                message: 'Staff not found'
            }, { status: 404 })
        }

        return NextResponse.json({
            staff: staff
        }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({
            message: error.message
        }, { status: 500 })
    }
}
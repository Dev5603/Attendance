import { NextRequest, NextResponse } from "next/server";
import connect from "@/db/dbConfig";

import Staff from "@/models/Staff";

connect()

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json()
        const { email } = body

        const staff = await Staff.findOneAndDelete({ email: email.toLowerCase() })

        if (!staff) {
            return NextResponse.json({
                message: 'Staff not found'
            }, { status: 404 })
        }

        return NextResponse.json({
            message: 'Staff deleted successfully'
        }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({
            message: error.message
        }, { status: 500 })
    }
}
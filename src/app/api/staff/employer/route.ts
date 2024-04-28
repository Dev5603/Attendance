import { NextRequest, NextResponse } from "next/server";
import connect from "@/db/dbConfig";

import Admin from "@/models/Admin";

connect()

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { employerID } = body

        const admin = await Admin.findOne({ email: employerID.toLowerCase() })

        if (!admin) {
            return NextResponse.json({
                message: 'Admin not found'
            })
        }

        return NextResponse.json({
            admin: admin
        }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({
            message: error.message
        }, { status: 500 })
    }
}
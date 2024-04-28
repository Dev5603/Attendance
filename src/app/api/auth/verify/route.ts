import { NextRequest, NextResponse } from "next/server";
import jsonwebtoken from "jsonwebtoken";
import connect from "@/db/dbConfig";

import Admin from "@/models/Admin";
import Staff from "@/models/Staff";

connect()

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { token } = body

        if (!token) {
            return NextResponse.json({
                message: "Unauthorized HTTP, Token not provided"
            }, { status: 400 });
        }

        const authToken = token.replace('Bearer', '').trim();
        const verify = jsonwebtoken.verify(authToken, process.env.JWT_SECRET!) as { role: string, id: string }

        let user;

        if (verify.role === 'Admin') {
            user = await Admin.findById(verify.id).select('-password');
        } else if (verify.role === 'Staff') {
            user = await Staff.findById(verify.id).select('-password');
        } else {
            return NextResponse.json({
                message: 'Invalid user'
            }, { status: 400 });
        }

        return NextResponse.json({
            user: user
        }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({
            message: error.message
        }, { status: 500 })
    }
}
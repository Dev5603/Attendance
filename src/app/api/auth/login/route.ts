import { NextRequest, NextResponse } from "next/server";
import connect from "@/db/dbConfig";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

import Admin from "@/models/Admin"
import Staff from "@/models/Staff";

connect()

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, password, role } = body

        let user;

        if (role === 'Admin') {
            user = await Admin.findOne({ email: email.toLowerCase() })
        } else if (role === 'Staff') {
            user = await Staff.findOne({ email: email.toLowerCase() })
        }


        // Checking if the user already exists
        if (!user) {
            let message;

            if (role === 'Admin') {
                message = 'Admin not registered';
            } else if (role === 'Staff') {
                message = 'Shark has not registered you yet';
            } else {
                message = 'User not registered'; // Default message for other user types
            }
        
            return NextResponse.json({
                message: message
            }, { status: 400 })
        }

        const comparePass = await compare(password, user.password)

        if (!comparePass) {
            return NextResponse.json({
                message: 'Invalid Credentials'
            })
        }

        const authToken = sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET!)

        return NextResponse.json({
            authToken: authToken
        }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({
            message: error.message
        }, { status: 500 })
    }
}
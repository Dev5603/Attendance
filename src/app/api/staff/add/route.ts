import { NextRequest, NextResponse } from "next/server";
import { genSalt, hash } from "bcryptjs";
import connect from "@/db/dbConfig";

import Staff from "@/models/Staff";

connect()

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, password, employerID } = body

        const staff = await Staff.findOne({ email: email.toLowerCase() })

        if (staff) {
            return NextResponse.json({
                message: 'Staff already exixts'
            }, { status: 400 })
        }

        const salt = await genSalt(10)
        const hashPass = await hash(password, salt)

        const newStaff = await Staff.create({
            name: name,
            email: email.toLowerCase(),
            password: hashPass,
            employerID: employerID.toLowerCase()
        })

        return NextResponse.json({
            message: 'Staff created successfully'
        }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({
            message: error.message
        }, { status: 500 })
    }
}
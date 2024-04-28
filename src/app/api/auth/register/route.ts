import { NextRequest, NextResponse } from "next/server";
import connect from "@/db/dbConfig";
import {genSalt, hash} from "bcryptjs"

import Admin from "@/models/Admin"

connect()

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, password, location } = body

        let admin = await Admin.findOne({ email: email.toLowerCase() })

        // Checking if the admin already exists
        if (admin) {
            return NextResponse.json({
                message: 'Admin already exists'
            }, { status: 400 })
        }

        const salt = await genSalt(10)
        const hashPass = await hash(password, salt)

        const newAdmin = await Admin.create({
            name: name,
            email: email.toLowerCase(),
            password: hashPass,
            location: location
        })

        return NextResponse.json({
            message: 'Admin registered successfully'
        }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({
            message: error.message
        }, { status: 500 })
    }
}
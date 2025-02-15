import { prisma } from '@/prisma/connector'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function DELETE() {
    const headersList = headers()
    const password = (await headersList).get('x-password')

    if (!password || password !== process.env.DELETE_PASSWORD) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        )
    }

    try {
        await prisma.detail.deleteMany({})

        return NextResponse.json({
            message: 'All data has been cleared successfully'
        })
    } catch (error) {
        console.error('Error clearing data:', error)
        return NextResponse.json(
            { error: 'Error clearing data' },
            { status: 500 }
        )
    }
}
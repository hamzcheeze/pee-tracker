// app/api/details/route.ts

import { prisma } from '@/prisma/connector'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const details = await prisma.detail.findMany({
            orderBy: [
                {
                    date: 'desc'
                },
                {
                    count: 'desc'
                }
            ]
        });

        return NextResponse.json(details);
    } catch (error) {
        console.error('Error fetching details:', error);
        return NextResponse.json(
            { error: 'Error fetching details' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { owner } = await request.json()

        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

        const todayRecords = await prisma.detail.findMany({
            where: {
                date: {
                    gte: today,
                    lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
                }
            },
            orderBy: {
                date: 'desc'
            }
        })

        const count = todayRecords.length > 0
            ? Math.max(...todayRecords.map(record => record.count)) + 1
            : 1

        const detail = await prisma.detail.create({
            data: {
                time: now.toLocaleTimeString(),
                date: now,
                owner: owner,
                count: count
            }
        })

        return NextResponse.json(detail, { status: 201 })
    } catch (error) {
        console.error('Server error:', error)
        return NextResponse.json(
            { error: 'Error creating detail' },
            { status: 500 }
        )
    }
}
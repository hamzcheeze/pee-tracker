// app/api/details/route.ts

import { prisma } from '@/prisma/connector'
import { NextResponse } from 'next/server'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

// Configure dayjs with plugins
dayjs.extend(utc)
dayjs.extend(timezone)

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

        const bkkNow = dayjs().tz("Asia/Bangkok")
        const bkkTime = bkkNow.format('HH:mm:ss')
        const bkkDateTime = bkkNow.format('YYYY-MM-DD HH:mm:ss')
        const bkkStartDay = bkkNow
            .startOf('day')
            .format('YYYY-MM-DD HH:mm:ss')
        const bkkEndday = bkkNow
            .endOf('day')
            .format('YYYY-MM-DD HH:mm:ss')

        // console.log('bkkStartDay = ', bkkStartDay)
        // console.log('bkkEndday = ', bkkEndday)

        const todayRecords = await prisma.detail.findMany({
            where: {
                owner,
                date: {
                    gte: bkkStartDay,
                    lte: bkkEndday
                }
            },
            orderBy: {
                date: 'desc'
            }
        })

        // console.log("=============")
        // console.log(todayRecords)

        const count = todayRecords.length > 0
            ? Math.max(...todayRecords.map(record => record.count)) + 1
            : 1

        const detail = await prisma.detail.create({
            data: {
                time: bkkTime,
                date: bkkDateTime,
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
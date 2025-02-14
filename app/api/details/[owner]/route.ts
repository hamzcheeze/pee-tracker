import { prisma } from '@/prisma/connector'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: { owner: string } }
) {
    try {
        const { owner } = await params
        const details = await prisma.detail.findMany({
            where: { owner },
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
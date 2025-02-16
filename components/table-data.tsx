"use client";

import { useState, useEffect } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    getKeyValue,
    Skeleton,
} from "@heroui/react";

interface Detail {
    id: number;
    date: string;
    time: string;
    count: number;
    owner: string;
}

interface TableDataProps {
    owner: string;
    refreshTrigger: number;
}

const columns = [
    {
        key: "date",
        label: "Date",
    },
    {
        key: "time",
        label: "Time",
    },
    {
        key: "count",
        label: "Count",
    },
];

const renderSkeleton = () => (
    <>
        {Array(5).fill(0).map((_, index) => (
            <TableRow key={`skeleton-${index}`}>
                {Array(3).fill(0).map((_, cellIndex) => (
                    <TableCell key={`cell-${index}-${cellIndex}`}>
                        <Skeleton className="w-full h-8 rounded-lg" />
                    </TableCell>
                ))}
            </TableRow>
        ))}
    </>
);

const getDetails = async (owner: string): Promise<Detail[]> => {
    const response = await fetch('/api/details/' + owner)
    if (!response.ok) {
        throw new Error('Failed to fetch details')
    }
    return response.json()
}

export default function TableData({ owner, refreshTrigger }: TableDataProps) {
    const [details, setDetails] = useState<Detail[]>([])
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDetails = async () => {
            setIsLoading(true);
            try {
                if (owner !== 'Anonymous') {
                    const data = await getDetails(owner)
                    const formattedData = data.map((item: Detail) => ({
                        ...item,
                        date: item.date.split(' ')[0],
                        time: new Date(item.date).toLocaleTimeString('th-TH', {
                            hour12: false,
                            hour: '2-digit',
                            minute: '2-digit'
                        })
                    }));
                    setDetails(formattedData)
                }
            } catch (error) {
                console.error('Error loading details:', error)
            } finally {
                setIsLoading(false);
            }
        }

        loadDetails()
    }, [owner, refreshTrigger])

    return (
        <Table aria-label="Pee Data">
            <TableHeader>
                {columns.map((column) =>
                    <TableColumn key={column.key}>
                        {column.label}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    renderSkeleton()
                ) : (
                    details.map((item: Detail) => (
                        <TableRow key={item.id}>
                            {(columnKey) => (
                                <TableCell>
                                    {getKeyValue(item, columnKey)}
                                </TableCell>
                            )}
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}


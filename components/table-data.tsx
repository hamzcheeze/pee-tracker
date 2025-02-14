"use client";

import { useState, useEffect } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Spinner,
    getKeyValue,
} from "@heroui/react";

interface Detail {
    id: number;
    date: string;
    time: string;
    count: number;
    owner: string;
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


const getDetails = async (): Promise<Detail[]> => {
    const response = await fetch('/api/details')
    if (!response.ok) {
        throw new Error('Failed to fetch details')
    }
    return response.json()
}

export default function TableData() {
    const [details, setDetails] = useState<Detail[]>([])

    useEffect(() => {
        const loadDetails = async () => {
            try {
                const data = await getDetails()
                const formattedData = data.map((item: Detail) => ({
                    ...item,
                    date: new Date(item.date).toISOString().split('T')[0],
                    time: new Date(item.date).toLocaleTimeString('en-US', {
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                }));
                setDetails(formattedData)
            } catch (error) {
                console.error('Error loading details:', error)
            }
        }

        loadDetails()
    }, [])

    return (
        <Table aria-label="Example table with dynamic content">
            <TableHeader>
                {columns.map((column) =>
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                )}
            </TableHeader>
            <TableBody>
                {details.map((row) =>
                    <TableRow key={row.id}>
                        {(columnKey) => <TableCell>{getKeyValue(row, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}


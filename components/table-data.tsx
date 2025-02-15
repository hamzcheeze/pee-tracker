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
                        date: new Date(item.date).toISOString().split('T')[0],
                        time: new Date(item.date).toLocaleTimeString('en-US', {
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
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                )}
            </TableHeader>
            <TableBody
                isLoading={isLoading}
                items={details}
                loadingContent={<Spinner label="Loading..." />}
            >
                {(item: Detail) => (
                    <TableRow key={item.id}>
                        {(columnKey) => (
                            <TableCell>
                                {getKeyValue(item, columnKey)}
                            </TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}


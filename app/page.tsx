"use client";

import TableData from "@/components/table-data";
import { Button } from "@heroui/react";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  const handleAddDetail = async () => {
    try {
      const response = await fetch('/api/details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner: session?.user?.name || 'Anonymous'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add detail');
      }

      window.location.reload();
    } catch (error) {
      console.error('Error adding detail:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center px-4 mb-4">
        <h1 className="text-4xl font-bold">Data</h1>
        <Button
          color="primary"
          radius="lg"
          onPress={handleAddDetail}
        >
          Add
        </Button>
      </div>
      <TableData />
    </div>
  );
}
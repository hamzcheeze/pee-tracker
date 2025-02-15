"use client";

import TableData from "@/components/table-data";
import { Button } from "@heroui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { data: session } = useSession();
  const owner = session?.user?.email || 'Anonymous';

  const handleAddDetail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner: session?.user?.email || 'Anonymous'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add detail');
      }

      // Increment refresh trigger to cause TableData to reload
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error adding detail:', error);
    } finally {
      setIsLoading(false);
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
          isLoading={isLoading}
        >
          Add
        </Button>
      </div>
      <TableData
        owner={owner}
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
}
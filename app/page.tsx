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
          spinner={
            <svg
              className="animate-spin h-5 w-5 text-current"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                fill="currentColor"
              />
            </svg>
          }
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
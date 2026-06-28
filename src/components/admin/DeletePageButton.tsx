"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function DeletePageButton({ pageId, pageTitle }: { pageId: string, pageTitle: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${pageTitle}"? This cannot be undone.`)) {
      return;
    }
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete page.");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting page.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="text-red-600 hover:text-red-700 hover:bg-red-50 relative"
      onClick={handleDelete}
      disabled={isDeleting}
      title="Delete Page"
    >
      {isDeleting ? (
        <div className="w-4 h-4 rounded-full border-2 border-red-200 border-t-red-600 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </Button>
  );
}

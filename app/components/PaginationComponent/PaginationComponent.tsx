// app/components/PaginationComponent.tsx
"use client";

import { useRouter } from "next/navigation";
import { Pagination } from "@mantine/core";

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationComponent({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationComponentProps) {
  const router = useRouter();

  return (
    <Pagination
      total={totalPages}
      value={currentPage}
      onChange={(e) => onPageChange(e.valueOf())}
      color="gray"
      size="lg"
      radius="md"
    />
  );
}

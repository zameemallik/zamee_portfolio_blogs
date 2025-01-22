// app/components/PaginationComponent.tsx
"use client";

import { useRouter } from "next/navigation";
import { Pagination } from "@mantine/core";

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
}

export function PaginationComponent({
  currentPage,
  totalPages,
}: PaginationComponentProps) {
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    router.push(`/?page=${newPage}`);
  };
  return (
    <Pagination
      total={totalPages}
      value={currentPage}
      onChange={handlePageChange}
      color="gray"
      size="lg"
      radius="md"
    />
  );
}

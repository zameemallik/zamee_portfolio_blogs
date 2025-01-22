import { IconSearch } from "@tabler/icons-react";
import { Pagination, SimpleGrid, Center, Autocomplete } from "@mantine/core";
import { BlogCard } from "./components/BlogCards/BlogCard";
import prisma from "../lib/prisma";
import { PaginationComponent } from "./components/PaginationComponent/PaginationComponent";

interface Props {
  searchParams: { page?: string };
}

export default async function HomePage({ searchParams }: Props) {
  const page = parseInt(searchParams.page || "1", 10);
  const perPage = 1;
  const skip = (page - 1) * perPage;

  // データの取得
  const posts = await prisma.post.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    skip: skip,
    take: perPage,
  });

  const totalPosts = await prisma.post.count();
  const totalPages = Math.ceil(totalPosts / perPage);

  return (
    <>
      <Center style={{ margin: "20px 0", paddingTop: "10px" }}>
        <Autocomplete
          placeholder="Search"
          leftSection={<IconSearch size={16} stroke={1.5} />}
          data={[
            "React",
            "Angular",
            "Vue",
            "Next.js",
            "Riot.js",
            "Svelte",
            "Blitz.js",
          ]}
          visibleFrom="xs"
        />
      </Center>
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 3 }}
        spacing={{ base: 10, sm: "xl" }}
        verticalSpacing={{ base: "md", sm: "xl" }}
      >
        {posts.map((post) => (
          <BlogCard
            id={post.id}
            post_img_url={post.postImgUrl}
            title={post.title}
            summary={post.summary}
          />
        ))}
      </SimpleGrid>
      <Center style={{ margin: "20px 0" }}>
        <PaginationComponent currentPage={page} totalPages={totalPages} />
      </Center>
    </>
  );
}

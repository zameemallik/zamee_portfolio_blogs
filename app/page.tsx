"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconSearch } from "@tabler/icons-react";
import { Button, Autocomplete, SimpleGrid, Center } from "@mantine/core";
import { BlogCard } from "./components/BlogCards/BlogCard";
import { PaginationComponent } from "./components/PaginationComponent/PaginationComponent";

interface Post {
  id: string;
  postImgUrl: string;
  title: string;
  summary: string;
}

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [searchText, setSearchText] = useState(searchParams.get("query") || "");
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1", 10)
  );
  const [inputText, setInputText] = useState(searchText);
  const perPage = 6;

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(
        `/api/getPosts?query=${searchText}&page=${currentPage}`
      );
      const data = await response.json();

      if (response.ok) {
        setPosts(data.posts);
        setTotalPosts(data.totalPosts);
      } else {
        console.error("Failed to fetch posts:", data.error);
      }
    };

    fetchPosts();
  }, [searchText, currentPage]);

  const handleSearch = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("query", inputText);
    params.set("page", "1");
    router.push(`/?${params.toString()}`);
    setSearchText(inputText);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("query", searchText);
    params.set("page", newPage.toString());
    router.push(`/?${params.toString()}`);
    setCurrentPage(newPage);
  };

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
          value={inputText}
          onChange={(value) => setInputText(value)}
          visibleFrom="xs"
          style={{ flex: 1, marginRight: 10 }}
        />
        <Button onClick={handleSearch}>Search</Button>
      </Center>

      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 3 }}
        spacing={{ base: 10, sm: "xl" }}
        verticalSpacing={{ base: "md", sm: "xl" }}
      >
        {posts.map((post) => (
          <BlogCard
            key={post.id}
            id={post.id}
            post_img_url={post.postImgUrl}
            title={post.title}
            summary={post.summary}
          />
        ))}
      </SimpleGrid>

      <Center style={{ margin: "20px 0" }}>
        <PaginationComponent
          currentPage={currentPage}
          totalPages={Math.ceil(totalPosts / perPage)}
          onPageChange={handlePageChange}
        />
      </Center>
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}

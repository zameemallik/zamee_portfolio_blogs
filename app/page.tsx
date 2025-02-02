"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconSearch } from "@tabler/icons-react";
import { Button, Autocomplete, SimpleGrid, Center, Box } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
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

  // Define a media query to detect small screens
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

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
    router.push(`/?${params.toString()}`);
    setSearchText(inputText);
    setCurrentPage(1);
  };

  return (
    <>
      <Center style={{ margin: "20px 0", paddingTop: "10px", width: "100%" }}>
        <Box
          style={{
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            width: "80%",
            gap: isSmallScreen ? "10px" : "0",
          }}
        >
          <Autocomplete
            placeholder="Search"
            rightSection={<IconSearch size={16} stroke={1.5} />}
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
            style={{ flex: 1 }}
          />
          <Button
            onClick={handleSearch}
            style={{ marginLeft: isSmallScreen ? 0 : 10 }}
          >
            Search
          </Button>
        </Box>
      </Center>

      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 3 }}
        spacing={{ base: "md", sm: "lg", lg: "xl" }}
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
          onPageChange={(newPage) => setCurrentPage(newPage)}
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

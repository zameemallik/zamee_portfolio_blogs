"use client";

import { CommentCard } from "../../components/CommentCard/CommentCard";
import { Box, Title, Text, Group, Avatar, Divider } from "@mantine/core";
import CommentForm from "../../components/CommentForm/CommentForm";
import { trpc } from "@/app/_trpc/client";
import React from "react";

export default function BlogDetail({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = React.use(params);

  const {
    data: post,
    isLoading,
    error,
  } = trpc.post.getPostById.useQuery({
    id: postId,
  });

  if (isLoading) return <div>読み込み中...</div>;
  if (!post || error) return <div>Post Data Not Found</div>;

  return (
    <>
      {/* Blog Image */}
      <Box mb="md" style={{ textAlign: "center" }}>
        <img
          src={post.postImgUrl || "/default_img.jpg"}
          alt="post image"
          style={{
            width: "100%",
            height: "300px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      </Box>

      {/* Blog Title */}
      <Title order={1} mb="sm">
        {post.title}
      </Title>

      {/* Blog Content */}
      <Box
        size="md"
        mb="lg"
        dangerouslySetInnerHTML={{
          __html: post.content ? post.content : "NO CONTENTS WRITTEN",
        }}
      />

      <Divider my="lg" />

      {/* Author Info */}
      <Group mb="lg">
        <Avatar
          src={post.author.userImgUrl || "/default-avatar.jpg"}
          alt={post.author.displayName}
          size="lg"
          radius="xl"
        />
        <div>
          <Text size="sm">{post.author.displayName}</Text>
        </div>
      </Group>

      <Divider my="lg" />

      {/* Comments */}
      <Box>
        <Title order={3} mb="sm">
          コメント
        </Title>
        <CommentForm postId={postId} />
        {post.comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </Box>
    </>
  );
}

import prisma from "../../../lib/prisma";
import { CommentCard } from "../../components/CommentCard/CommentCard";
import { Box, Title, Text, Group, Avatar, Divider } from "@mantine/core";
import CommentForm from "../../components/CommentForm/CommentForm";

interface Props {
  params: {
    postId: string;
  };
}

export default async function BlogDetail({ params }: Props) {
  const { postId } = params;

  if (!postId) {
    console.error("postId is undefined or null.");
    return {
      notFound: true,
    };
  }

  const post = await prisma.post.findFirst({
    where: { id: postId },
    include: {
      author: true,
      comments: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!post) {
    console.error(`Post with ID ${postId} not found.`);
    return (
      <>
        <div>Post Data Not Found</div>
      </>
    );
  }

  return (
    <>
      {/* Blog Image */}
      <Box mb="md" style={{ textAlign: "center" }}>
        <img
          src={post.postImgUrl || "/default_img.jpg"}
          alt={"post image"}
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

      {/* Author Information */}
      <Group mb="lg">
        <Avatar
          src={post.author.userImgUrl || "/default-avatar.jpg"}
          alt={post.author.displayName}
          size="lg"
          radius="xl"
        />
        <div>
          <Text size="sm">{post.author.displayName}</Text>
          <Text size="xs" c="dimmed">
            {/* 投稿者の自己紹介などがあればここに表示 */}
          </Text>
        </div>
      </Group>

      <Divider my="lg" />

      {/* Comments Section */}
      <Box>
        <Title order={3} mb="sm">
          コメント
        </Title>
        <CommentForm postId={postId} />
        {post.comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment}></CommentCard>
        ))}
      </Box>
    </>
  );
}

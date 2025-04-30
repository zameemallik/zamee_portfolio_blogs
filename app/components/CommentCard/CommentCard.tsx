"use client";
import { useState } from "react";
import {
  Avatar,
  Text,
  Box,
  Group,
  Button,
  Modal,
  TextInput,
} from "@mantine/core";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/routers";
import { useRouter } from "next/navigation";
import { trpc } from "@/app/_trpc/client";
import { useAuth } from "../../providers/AuthProvider";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type PostDetail = RouterOutputs["post"]["getPostById"];
type CommentWithUser = PostDetail["comments"][number];

export const CommentCard = ({ comment }: { comment: CommentWithUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const utils = trpc.useUtils();

  const updateComment = trpc.post.updateComment.useMutation({
    onSuccess: () => {
      utils.post.getPostById.invalidate({ id: comment.postId });
    },
  });

  const deleteComment = trpc.post.deleteComment.useMutation({
    onSuccess: () => {
      utils.post.getPostById.invalidate({ id: comment.postId });
    },
  });

  const handleEdit = async () => {
    setIsSubmitting(true);
    try {
      await updateComment.mutateAsync({
        id: comment.id,
        content: editedContent,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteComment.mutateAsync({ id: comment.id });
    } catch (error) {
      console.error("Failed to delete comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box mb="md" p="sm">
      <Group align="flex-start">
        <Avatar
          src={comment.user?.userImgUrl || "/default-avatar.jpg"}
          alt={comment.user?.displayName || "匿名ユーザー"}
          radius="xl"
          size="md"
        />
        <Box>
          <Text>{comment.user?.displayName || "匿名ユーザー"}</Text>
          <Text size="sm" color="dimmed">
            {comment.content}
          </Text>
          {user?.id === comment.userId && (
            <Group mt="xs">
              <Button size="xs" onClick={() => setIsEditing(true)}>
                編集
              </Button>
              <Button
                size="xs"
                color="red"
                onClick={handleDelete}
                loading={isSubmitting}
              >
                削除
              </Button>
            </Group>
          )}
        </Box>
      </Group>

      <Modal
        opened={isEditing}
        onClose={() => setIsEditing(false)}
        title="コメントを編集"
      >
        <TextInput
          value={editedContent}
          onChange={(event) => setEditedContent(event.currentTarget.value)}
        />
        <Button mt="md" onClick={handleEdit} loading={isSubmitting}>
          保存
        </Button>
      </Modal>
    </Box>
  );
};

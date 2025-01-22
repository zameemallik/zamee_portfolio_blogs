"use client";
import { useEffect, useState } from "react";
import {
  Avatar,
  Text,
  Box,
  Group,
  Button,
  Modal,
  TextInput,
} from "@mantine/core";
import { Comment, User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase/supabase";

type CommentWithUser = Comment & {
  user: User | null;
};

interface Props {
  comment: CommentWithUser;
}

export const CommentCard = ({ comment }: Props) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        setUserId(null);
      } else if (data.user) {
        setUserId(data.user.id);
      }
    };

    fetchUser();
  }, []);

  const handleEdit = async () => {
    try {
      await axios.post("/api/comments/updateComment", {
        id: comment.id,
        content: editedContent,
      });
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("コメントの更新中にエラーが発生しました:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.post("/api/comments/deleteComment", {
        id: comment.id,
      });
      router.refresh();
    } catch (error) {
      console.error("コメントの削除中にエラーが発生しました:", error);
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
          {userId && userId === comment.userId && (
            <Group mt="xs">
              <Button size="xs" onClick={() => setIsEditing(true)}>
                編集
              </Button>
              <Button size="xs" color="red" onClick={handleDelete}>
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
        <Button mt="md" onClick={handleEdit}>
          保存
        </Button>
      </Modal>
    </Box>
  );
};

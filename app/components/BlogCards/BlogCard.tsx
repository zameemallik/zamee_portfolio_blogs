"use client";
import { Card, Image, Text } from "@mantine/core";

type Props = {
  id: string;
  post_img_url: string;
  title: string;
  summary: string;
};

export const BlogCard = ({ id, post_img_url, title, summary }: Props) => {
  return (
    <Card shadow="sm" padding="xl" component="a" href={`/blog/${id}`}>
      <Card.Section>
        <Image
          height={160}
          alt="Blog Image"
          src={post_img_url}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/default_img.jpg";
          }}
        />
      </Card.Section>

      <Text fw={500} size="lg" mt="md">
        {title}
      </Text>

      <Text mt="xs" c="dimmed" size="sm">
        {summary}
      </Text>
    </Card>
  );
};

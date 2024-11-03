"use server";

import { Client } from "@notionhq/client";

export async function sendFeedback(formData: FormData) {
  const path = formData.get("path");
  const message = formData.get("message");

  if (!path || !message) {
    return;
  }

  const notion = new Client({ auth: process.env.NOTION_SECRET! });
  await notion.pages.create({
    parent: { database_id: process.env.NOTION_FEEDBACK_DB_ID! },
    properties: {
      path: {
        title: [{ text: { content: path.toString() } }],
      },
    },
    children: [
      { paragraph: { rich_text: [{ text: { content: message.toString() } }] } },
    ],
  });
}

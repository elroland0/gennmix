import { Client } from "@notionhq/client";

export async function POST(request: Request) {
  const formData = await request.formData();
  const path = formData.get("path");
  const message = formData.get("message");

  if (typeof path !== "string" || typeof message !== "string") {
    return;
  }

  const notion = new Client({ auth: process.env.NOTION_SECRET! });
  await notion.pages.create({
    parent: { database_id: process.env.NOTION_FEEDBACK_DB_ID! },
    properties: {
      path: {
        title: [{ text: { content: path } }],
      },
    },
    children: [{ paragraph: { rich_text: [{ text: { content: message } }] } }],
  });

  return new Response(null, { status: 200 });
}

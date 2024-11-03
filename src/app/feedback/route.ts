export async function POST(request: Request) {
  const formData = await request.formData();
  const path = formData.get("path");
  const message = formData.get("message");

  if (typeof path !== "string" || typeof message !== "string") {
    return;
  }

  await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NOTION_SECRET}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      parent: { database_id: process.env.NOTION_FEEDBACK_DB_ID! },
      properties: {
        path: { title: [{ text: { content: path } }] },
      },
      children: [
        { paragraph: { rich_text: [{ text: { content: message } }] } },
      ],
    }),
  });

  return new Response(null, { status: 200 });
}

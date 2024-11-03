export async function POST(request: Request) {
  const url = new URL(request.url).searchParams.get("url");
  if (!url) {
    return new Response("No image URL provided", { status: 400 });
  }
  return await fetch(url);
}

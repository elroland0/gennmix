export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url");
  if (!url) {
    return new Response("No image URL provided", { status: 400 });
  }
  const res = await fetch(url);
  const newHeaders = new Headers(res.headers);
  newHeaders.delete("Content-Encoding");
  return new Response(res.body, { headers: newHeaders });
}

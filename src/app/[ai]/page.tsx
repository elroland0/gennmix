import { DallE } from "@/components/dall-e/dall-e";
import { Ideogram } from "@/components/ideogram/ideogram";
import { Recraft } from "@/components/recraft/recraft";
import { redirect } from "next/navigation";

export default function AiPage({ params }: { params: { ai: string } }) {
  if (params.ai === "dall-e") {
    return <DallE />;
  }
  if (params.ai === "recraft") {
    return <Recraft />;
  }
  if (params.ai === "ideogram") {
    return <Ideogram />;
  }
  return redirect("/");
}

import { BlackForestLabs } from "@/components/black-forest-labs/black-forest-labs";
import { Ideogram } from "@/components/ideogram/ideogram";
import { OpenAi } from "@/components/openai/openai";
import { Recraft } from "@/components/recraft/recraft";
import { redirect } from "next/navigation";

export default function AiPage({ params }: { params: { ai: string } }) {
  if (params.ai === "openai") {
    return <OpenAi />;
  }
  if (params.ai === "recraft") {
    return <Recraft />;
  }
  if (params.ai === "ideogram") {
    return <Ideogram />;
  }
  if (params.ai === "black-forest-labs") {
    return <BlackForestLabs />;
  }
  return redirect("/");
}

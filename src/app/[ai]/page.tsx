import { BlackForestLabs } from "@/components/black-forest-labs/black-forest-labs";
import { Fal } from "@/components/fal/fal";
import { Ideogram } from "@/components/ideogram/ideogram";
import { OpenAi } from "@/components/openai/openai";
import { Recraft } from "@/components/recraft/recraft";
import { Replicate } from "@/components/replicate/replicate";
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
  if (params.ai === "replicate") {
    return <Replicate />;
  }
  if (params.ai === "fal") {
    return <Fal />;
  }
  return redirect("/");
}

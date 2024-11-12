import { Fal } from "@/_[provider]/fal/fal";
import { Replicate } from "@/_[provider]/replicate/replicate";
import { BlackForestLabs } from "@/components/black-forest-labs/black-forest-labs";
import { Ideogram } from "@/components/ideogram/ideogram";
import { OpenAi } from "@/components/openai/openai";
import { Recraft } from "@/components/recraft/recraft";
import { redirect } from "next/navigation";

export default function AiPage({ params }: { params: { provider: string } }) {
  if (params.provider === "openai") {
    return <OpenAi />;
  }
  if (params.provider === "recraft") {
    return <Recraft />;
  }
  if (params.provider === "ideogram") {
    return <Ideogram />;
  }
  if (params.provider === "black-forest-labs") {
    return <BlackForestLabs />;
  }
  if (params.provider === "replicate") {
    return <Replicate />;
  }
  if (params.provider === "fal") {
    return <Fal />;
  }
  return redirect("/");
}

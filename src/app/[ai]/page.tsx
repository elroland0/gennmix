import { DalleForm } from "@/components/blocks/dalle-form";
import { Recraft } from "@/components/recraft/recraft";
import { redirect } from "next/navigation";

export default function AiPage({ params }: { params: { ai: string } }) {
  if (params.ai === "dall-e") {
    return <DalleForm />;
  }
  if (params.ai === "recraft") {
    return <Recraft />;
  }
  return redirect("/");
}

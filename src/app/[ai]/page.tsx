import { DalleForm } from "@/components/blocks/dalle-form";

export default function AiPage({ params }: { params: { ai: string } }) {
  if (params.ai === "dall-e") {
    return <DalleForm />;
  }
  // if (params.ai === "recraft") {
  //   return <RecraftForm />;
  // }
  return <div>{params.ai}</div>;
}

"use client";

import { useRouter } from "next/navigation";
import { AiIntro } from "@/components/ai/AiIntro";
import { AiQuestionStep } from "@/components/ai/AiQuestionStep";
import { AiResults } from "@/components/ai/AiResults";
import { AiShell } from "@/components/ai/AiShell";
import { useAiFlow } from "@/hooks/useAiFlow";

export default function AiPage() {
  const router = useRouter();
  const ai = useAiFlow();

  return (
    <AiShell onBack={ai.back} onClose={() => router.push("/")} backDisabled={ai.stage === "intro"}>
      {ai.stage === "intro" && <AiIntro track={ai.track} onStart={ai.startTrack} />}

      {ai.stage === "questions" && ai.current && (
        <AiQuestionStep
          step={ai.step}
          totalSteps={ai.steps.length}
          current={ai.current}
          answers={ai.answers}
          progress={ai.progress}
          onSelect={ai.select}
          onNext={ai.next}
        />
      )}

      {ai.stage === "results" && (
        <AiResults
          results={ai.results}
          onRetry={ai.reset}
          onBrowseAll={() => router.push("/discover")}
        />
      )}
    </AiShell>
  );
}

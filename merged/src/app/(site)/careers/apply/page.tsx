import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import ApplyWizard from "@/components/careers/ApplyWizard";

export const metadata: Metadata = {
  title: "Register as a Security Officer",
  description:
    "Register your PSiRA grading, experience, training and documents to join the Matsika Protective Services officer talent pool.",
};

export default function ApplyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] grid place-items-center">
          <Loader2 size={22} className="animate-spin text-gold" />
        </div>
      }
    >
      <ApplyWizard />
    </Suspense>
  );
}

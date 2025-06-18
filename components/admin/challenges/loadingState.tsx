import { Loader2 } from "lucide-react";
import { CHALLENGE_MESSAGES } from "@/constants/challenge";

export default function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      <span className="ml-2 text-gray-500">{CHALLENGE_MESSAGES.LOADING}</span>
    </div>
  );
}

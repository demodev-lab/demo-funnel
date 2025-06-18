import { Button } from "@/components/common/button";
import { CHALLENGE_MESSAGES } from "@/constants/challenge";

interface ErrorStateProps {
  error: Error | unknown;
}

export default function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p className="text-red-500">{CHALLENGE_MESSAGES.ERROR}</p>
      <p className="text-sm text-gray-500 mt-2">
        {error instanceof Error
          ? error.message
          : CHALLENGE_MESSAGES.UNKNOWN_ERROR}
      </p>
      <Button
        onClick={() => window.location.reload()}
        variant="outline"
        className="mt-4"
      >
        페이지 새로고침
      </Button>
    </div>
  );
}

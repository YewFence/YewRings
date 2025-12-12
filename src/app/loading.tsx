import { SpiralSpinner } from "@/components/ui/LoadingOverlay";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SpiralSpinner />
    </div>
  );
}

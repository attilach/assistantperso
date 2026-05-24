import { Suspense } from "react";
import CuisinePage from "@/components/CuisinePage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CuisinePage />
    </Suspense>
  );
}

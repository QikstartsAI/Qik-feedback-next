import { Suspense, lazy } from "react";
import Loader from "../lib/components/Loader";
import FeedbackFormRoot from "@/lib/components/FeedbackFormRoot";

export default function Home() {
  return (
    <Suspense fallback={<Loader />}>
      <FeedbackFormRoot />
    </Suspense>
  );
}

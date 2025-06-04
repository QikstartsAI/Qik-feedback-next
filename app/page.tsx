import { Suspense, lazy } from "react";
import Loader from "./components/Loader";

const FeedbackFormRoot = lazy(() => import('./components/FeedbackFormRoot'));

export default function Home() {
  return (
    <Suspense fallback={<Loader />}>
      <FeedbackFormRoot />
    </Suspense>
  )
}
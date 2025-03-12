import { Suspense, lazy } from "react";
import Loader from "./components/Loader";
import { BusinessDataProvider } from "./hooks/useGetBusinessData";

const FeedbackFormRoot = lazy(() => import("./components/FeedbackFormRoot"));

export default function Home() {
  return (
    <Suspense fallback={<Loader />}>
      <BusinessDataProvider>
        <FeedbackFormRoot />
      </BusinessDataProvider>
    </Suspense>
  );
}

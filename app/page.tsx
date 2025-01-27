import { Suspense, lazy } from "react";
import Loader from "./components/Loader";
import MultiProvider from "./layers/presentation/contexts/multiprovider";

const FeedbackFormRoot = lazy(() => import("./components/FeedbackFormRoot"));

export default function Home() {
  return (
    <Suspense fallback={<Loader />}>
      <MultiProvider>
        <FeedbackFormRoot />
      </MultiProvider>
    </Suspense>
  );
}

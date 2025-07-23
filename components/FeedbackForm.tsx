"use client";

import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconChevronLeft } from "@tabler/icons-react";
import { ProgressIndicator } from "@/components/ui/ProgressIndicator";
import { LoadingPulse } from "@/components/ui/LoadingPulse";
import { WaiterCard } from "@/components/WaiterCard";
import { BranchSelectionDialog } from "@/components/BranchSelectionDialog";
import { Header } from "@/components/layout/Header";
import { WelcomeView } from "@/components/views/WelcomeView";
import { SurveyView } from "@/components/views/SurveyView";
import { ThankYouView } from "@/components/views/ThankYouView";
import { useFeedbackForm } from "@/hooks/useFeedbackForm";
import { getBranchInfo, getBrandInfo } from "@/lib/utils/formUtils";
import { VIEWS } from "@/lib/utils/constants";
import Image from "next/image";

function FeedbackFormContent() {
  const {
    // State
    currentView,
    firstName,
    lastName,
    phone,
    phoneError,
    acceptPromotions,
    acceptTerms,
    referralSource,
    socialMediaSource,
    otherSource,
    rating,
    comment,
    selectedImprovements,
    copiedReviewId,
    selectedCountryCode,
    currentWaiter,
    showBranchSelection,
    availableBranches,
    detailedProgress,
    canContinue,

    // Data
    currentBrand,
    currentBranch,
    brandLoading,
    feedbackLoading,

    // Handlers
    setFirstName,
    setLastName,
    handlePhoneChange,
    setSelectedCountryCode,
    setAcceptPromotions,
    setAcceptTerms,
    handleSourceSelect,
    handleSocialMediaSelect,
    setOtherSource,
    setRating,
    setComment,
    handleImprovementSelect,
    handleCopyReview,
    handleBranchSelect,
    handleFeedbackSubmit,
    openGoogleMaps,
    backToWelcome,
    goToSurvey,
  } = useFeedbackForm();

  // Get branch or brand information for header
  const branchInfo = currentBranch
    ? getBranchInfo(currentBranch)
    : getBrandInfo(currentBrand);

  return (
    <div className="bg-gradient-to-b from-purple-100 via-blue-50 to-white">
      {/* Header */}
      <Header
        logo={branchInfo.logo}
        coverImage={branchInfo.coverImage}
        name={branchInfo.name}
        address={branchInfo.address}
        loading={brandLoading}
      />

      <div className="bg-gradient-to-b from-purple-100 via-blue-50 to-white">
        <div className="max-w-md mx-auto p-6 -mt-8 relative z-20">
          {currentView === VIEWS.THANK_YOU ? (
            <ThankYouView rating={rating} />
          ) : (
            <>
              {/* Show waiter card if waiter data is available */}
              {currentWaiter && <WaiterCard waiter={currentWaiter} />}

              <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
                <CardHeader className="text-center pb-4">
                  <div className="flex gap-3">
                    <IconChevronLeft
                      className="cursor-pointer"
                      onClick={backToWelcome}
                    />
                    <ProgressIndicator progress={detailedProgress.progress} />
                  </div>
                  <div className="text-4xl mb-2">😊</div>
                  <CardTitle className="text-xl text-gray-800">
                    ¡Bienvenido!
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {currentView === VIEWS.WELCOME && (
                    <WelcomeView
                      firstName={firstName}
                      lastName={lastName}
                      phone={phone}
                      phoneError={phoneError}
                      acceptPromotions={acceptPromotions}
                      referralSource={referralSource}
                      socialMediaSource={socialMediaSource}
                      otherSource={otherSource}
                      selectedCountryCode={selectedCountryCode}
                      onFirstNameChange={setFirstName}
                      onLastNameChange={setLastName}
                      onPhoneChange={handlePhoneChange}
                      onCountryCodeChange={setSelectedCountryCode}
                      onAcceptPromotionsChange={setAcceptPromotions}
                      onReferralSourceSelect={handleSourceSelect}
                      onSocialMediaSelect={handleSocialMediaSelect}
                      onOtherSourceChange={setOtherSource}
                      onContinue={goToSurvey}
                      canContinue={canContinue}
                    />
                  )}

                  {currentView === VIEWS.SURVEY && (
                    <SurveyView
                      rating={rating}
                      comment={comment}
                      selectedImprovements={selectedImprovements}
                      acceptTerms={acceptTerms}
                      copiedReviewId={copiedReviewId}
                      onRatingSelect={setRating}
                      onCommentChange={setComment}
                      onImprovementSelect={handleImprovementSelect}
                      onAcceptTermsChange={setAcceptTerms}
                      onCopyReview={handleCopyReview}
                      onSubmitFeedback={handleFeedbackSubmit}
                      onOpenGoogleMaps={openGoogleMaps}
                      feedbackLoading={feedbackLoading}
                    />
                  )}
                </CardContent>
              </Card>
            </>
          )}
          <div className="w-full flex gap-2 justify-center items-center mt-3">
            Powered by{" "}
            <a href="https://www.qikstarts.com" target="_blank">
              <Image src="/qik.svg" alt="Qik Logo" width={60} height={30} />
            </a>
          </div>
        </div>
      </div>

      {/* Branch Selection Dialog */}
      <BranchSelectionDialog
        branches={availableBranches}
        open={showBranchSelection}
        onBranchSelect={handleBranchSelect}
        brandColor="var(--qik)"
        brandName={currentBrand?.payload?.name}
      />
    </div>
  );
}

export function FeedbackForm() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-purple-100 via-blue-50 to-white flex items-center justify-center">
          <LoadingPulse size={100} />
        </div>
      }
    >
      <FeedbackFormContent />
    </Suspense>
  );
}

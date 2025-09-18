"use client";

import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconChevronLeft } from "@tabler/icons-react";
import { ProgressIndicator } from "@/components/ui/ProgressIndicator";
import { LoadingPulse } from "@/components/ui/LoadingPulse";
import { WaiterCard } from "@/components/WaiterCard";
import { BranchSelectionDialog } from "@/components/BranchSelectionDialog";
import { RequestLocationDialog } from "@/components/RequestLocationDialog";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/Hero";
import { Intro } from "@/components/Intro";
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
    averageTicket,
    selectedImprovements,
    copiedReviewId,
    selectedCountryCode,
    currentWaiter,
    showBranchSelection,
    availableBranches,
    detailedProgress,
    canContinue,
    feedbackCompleted,

    // Geolocation state
    showLocationDialog,
    showBranchSelectionDialog,
    locationPermission,
    originPosition,
    getLocation,
    grantingPermissions,
    distanceLoading,
    enableGeolocation,
    closestDestination,

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
    setAverageTicket,
    handleImprovementSelect,
    handleCopyReview,
    handleBranchSelect,
    handleFeedbackSubmit,
    openGoogleMaps,
    backToWelcome,
    goToSurvey,

    // Geolocation handlers
    handleShareLocation,
    handleViewAllBranches,
    handleConfirmLocation,
    handleCloseLocationDialog,
    handleBranchSelectFromDialog,
    setShowBranchSelectionDialog,
    showValidationErrors,

    // Query parameters
    brandId,
    branchId,
    waiterId,
  } = useFeedbackForm();

  // Get branch or brand information for header
  const branchInfo = currentBranch
    ? getBranchInfo(currentBranch)
    : getBrandInfo(currentBrand);

  // Check if there are any query parameters
  const hasQueryParams = brandId || branchId || waiterId;

  // If no query parameters, show only Qik logo centered
  if (!hasQueryParams) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 via-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Image
            src="/qik.svg"
            alt="Qik Logo"
            width={200}
            height={100}
            className="mx-auto mb-4"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-purple-100 via-blue-50 to-white">
      {/* Animated Hero Section */}
      <Hero
        coverImage={branchInfo.coverImage}
        logo={branchInfo.logo}
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
              {/* Animated Intro with Waiter */}
              {currentView === VIEWS.WELCOME && currentWaiter && (
                <Intro 
                  waiter={currentWaiter}
                  onCustomerTypeSelect={(type) => {
                    // Handle customer type selection
                    console.log("Customer type selected:", type);
                  }}
                  className="mb-6"
                />
              )}

              {/* Show waiter card if waiter data is available and not in welcome view */}
              {currentView !== VIEWS.WELCOME && currentWaiter && <WaiterCard waiter={currentWaiter} />}

              <Card className="shadow-xl border-0 bg-white animate-in slide-in-from-bottom duration-700 delay-2000">
                <CardHeader className="text-center pb-4">
                  <div className="flex gap-3">
                    <IconChevronLeft
                      className="cursor-pointer"
                      onClick={backToWelcome}
                    />
                    <ProgressIndicator progress={detailedProgress.progress} />
                  </div>
                  <CardTitle className="text-lg text-gray-800 text-center">
                    Valoramos tu opinión 😊, te tomará menos de 60 segundos.
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
                      averageTicket={averageTicket}
                      onFirstNameChange={setFirstName}
                      onLastNameChange={setLastName}
                      onPhoneChange={handlePhoneChange}
                      onCountryCodeChange={setSelectedCountryCode}
                      onAcceptPromotionsChange={setAcceptPromotions}
                      onReferralSourceSelect={handleSourceSelect}
                      onSocialMediaSelect={handleSocialMediaSelect}
                      onOtherSourceChange={setOtherSource}
                      onAverageTicketSelect={setAverageTicket}
                      onContinue={goToSurvey}
                      canContinue={canContinue}
                      referralSourceError={showValidationErrors && !referralSource}
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
          <div className="w-full flex gap-2 justify-center items-center mt-3 animate-in fade-in duration-500 delay-2500">
            Powered by{" "}
            <a href="https://www.qikstarts.com" target="_blank">
              <Image src="/LogoQikencuestas.svg" alt="Qik Logo" width={60} height={30} />
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

      {/* Location Request Dialog */}
      <RequestLocationDialog
        open={showLocationDialog}
        onClose={handleCloseLocationDialog}
        onShareLocation={handleShareLocation}
        onViewAllBranches={handleViewAllBranches}
        suggestedBranches={closestDestination ? [closestDestination] : []}
        onConfirmLocation={handleConfirmLocation}
        grantingPermissions={grantingPermissions}
        brandName={currentBrand?.payload?.name}
      />

      {/* Branch Selection Dialog */}
      <BranchSelectionDialog
        branches={availableBranches}
        open={showBranchSelectionDialog}
        onBranchSelect={handleBranchSelectFromDialog}
        brandColor="var(--qik)"
        brandName={currentBrand?.payload?.name}
        locationPermission={locationPermission}
        originPosition={originPosition}
        closestDestination={closestDestination}
        onGetLocation={getLocation}
        onDenyLocation={() => {
          // Don't close the dialog, just allow the user to see all branches
          // The BranchSelectionDialog will handle the view change internally
        }}
        grantingPermissions={grantingPermissions}
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

"use client";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Star, MapPin, CheckCircle, ChevronDown } from "lucide-react";
import { useCustomer } from "@/hooks/useCustomer";
import { useBranch } from "@/hooks/useBranch";
import { useSearchParams } from "next/navigation";
import { IconChevronLeft } from "@tabler/icons-react";
import {
  countryCodes,
  ratingEmojis,
  referralSources,
  applyPhoneMask,
  validatePhone,
  formatPhoneWithCountryCode,
  extractDigitsFromPhone,
} from "@/lib/utils/phoneUtils";
import {
  calculateProgress,
  isPositiveRating,
  getBranchInfo,
  canContinueStep1,
  canSubmitFeedback,
} from "@/lib/utils/formUtils";
import {
  DEFAULT_COUNTRY_CODE,
  PHONE_MAX_LENGTH,
  GOOGLE_REVIEW_URL,
  VIEWS,
  FORM_STEPS,
  PHONE_DIGITS_MAX_LENGTH,
} from "@/lib/utils/constants";

export default function QikLoyaltyPlatform() {
  const { currentCustomer, getCustomerByPhone, editCustomer } = useCustomer();
  const { currentBranch, getBranchById, loading: branchLoading } = useBranch();
  const searchParams = useSearchParams();

  const [currentView, setCurrentView] = useState<
    (typeof VIEWS)[keyof typeof VIEWS]
  >(VIEWS.WELCOME);
  const [step, setStep] = useState<number>(FORM_STEPS.WELCOME);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [acceptPromotions, setAcceptPromotions] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [referralSource, setReferralSource] = useState("");
  const [rating, setRating] = useState<string>("");
  const [comment, setComment] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] =
    useState(DEFAULT_COUNTRY_CODE);
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const countrySelectorRef = useRef<HTMLDivElement>(null);

  // Get branch ID from URL parameters
  const branchId = searchParams.get("id");

  const progress = calculateProgress(step, 2);

  // Fetch branch data when component mounts or branchId changes
  useEffect(() => {
    if (branchId) {
      getBranchById(branchId);
    }
  }, [branchId, getBranchById]);

  // Close country selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        countrySelectorRef.current &&
        !countrySelectorRef.current.contains(event.target as Node)
      ) {
        setShowCountrySelector(false);
      }
    };

    if (showCountrySelector) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCountrySelector]);

  const handlePhoneChange = async (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");
    const maskedValue = applyPhoneMask(digitsOnly);
    const formattedPhone = formatPhoneWithCountryCode(
      maskedValue,
      selectedCountryCode
    );

    setPhone(formattedPhone);

    const validation = validatePhone(formattedPhone, selectedCountryCode);
    setPhoneError(validation.error);

    if (!validation.error && digitsOnly.length === PHONE_DIGITS_MAX_LENGTH) {
      await getCustomerByPhone(digitsOnly);
    }
  };

  const handleSourceSelect = (sourceId: string) => {
    setReferralSource(sourceId);
  };

  const openGoogleMaps = () => {
    window.open(GOOGLE_REVIEW_URL, "_blank");
    setStep(FORM_STEPS.THANK_YOU);
  };

  const backToWelcome = () => {
    setCurrentView(VIEWS.WELCOME);
    setStep(FORM_STEPS.WELCOME);
  };

  useEffect(() => {
    if (!currentCustomer?.payload) return;
    const { fullName } = currentCustomer?.payload;
    setName(fullName);
  }, [currentCustomer]);

  const canContinue = canContinueStep1(name, phone, phoneError, referralSource);
  const positiveRating = isPositiveRating(rating);

  // Get branch information for header
  const branchInfo = getBranchInfo(currentBranch);

  const Thankyou = () => {
    return (
      <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
        <CardHeader className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-xl text-green-600">¡Gracias!</CardTitle>
          <CardDescription>
            Tu opinión es muy valiosa para nosotros
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-gray-600">
            {positiveRating
              ? "¡Esperamos verte pronto de nuevo!"
              : "Trabajaremos para mejorar tu próxima experiencia."}
          </p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              📱 Te enviaremos un WhatsApp con el link a tu cartilla digital
              para que disfrutes de beneficios exclusivos.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-blue-50 to-white">
      {/* Header */}
      <div
        className="relative h-32 bg-cover bg-center"
        style={{ backgroundImage: `url('${branchInfo.coverImage}')` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <div className="flex items-center space-x-3 w-full max-w-md">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <img
                src={branchInfo.logo}
                alt="Logo"
                className="w-8 h-8 rounded-full"
              />
            </div>
            <div className="text-white">
              <h1 className="text-lg font-bold">{branchInfo.name}</h1>
              <p className="text-sm text-gray-200">
                {branchInfo.address} •{" "}
                {branchLoading ? "Cargando..." : "0.2 km"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="min-h-screen bg-gradient-to-b from-purple-100 via-blue-50 to-white">
        <div className="max-w-md mx-auto p-6 -mt-8 relative z-20">
          {currentView === VIEWS.THANK_YOU ? (
            <Thankyou />
          ) : (
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
              <CardHeader className="text-center pb-4">
                <div>
                  <IconChevronLeft
                    className="cursor-pointer"
                    onClick={backToWelcome}
                  />
                </div>
                <div className="text-4xl mb-2">😊</div>
                <CardTitle className="text-xl text-gray-800">
                  ¡Bienvenido!
                </CardTitle>
                <CardDescription className="text-purple-600 font-medium">
                  Valoramos tu opinión
                  <br />
                  <span className="text-sm text-gray-600">
                    Te tomará menos de 60 segundos
                  </span>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Progress bar */}
                <div className="mb-4">
                  <Progress value={progress} className="h-2" />
                </div>

                {currentView === VIEWS.WELCOME && (
                  <div className="space-y-4 animate-in slide-in-from-top duration-300">
                    <div>
                      <Label
                        htmlFor="phone"
                        className="text-sm font-medium text-gray-700"
                      >
                        Teléfono
                      </Label>
                      <div className="flex mt-1">
                        <div className="relative" ref={countrySelectorRef}>
                          <button
                            type="button"
                            onClick={() =>
                              setShowCountrySelector(!showCountrySelector)
                            }
                            className="flex items-center px-3 h-10 bg-gray-50 border border-r-0 rounded-l-md hover:bg-gray-100 transition-colors"
                          >
                            <span className="text-lg">
                              {countryCodes.find(
                                (c) => c.code === selectedCountryCode
                              )?.flag || "🇪🇨"}
                            </span>
                            <span className="ml-1 text-sm">
                              {selectedCountryCode}
                            </span>
                            <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                          </button>

                          {showCountrySelector && (
                            <div className="absolute top-full left-0 z-50 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                              {countryCodes.map((country) => (
                                <button
                                  key={country.code}
                                  type="button"
                                  onClick={() => {
                                    const currentDigits = phone
                                      .replace(selectedCountryCode + " ", "")
                                      .replace(/\D/g, "");

                                    setSelectedCountryCode(country.code);
                                    setShowCountrySelector(false);

                                    // Update phone with new country code
                                    if (currentDigits) {
                                      const maskedValue =
                                        applyPhoneMask(currentDigits);
                                      const formattedPhone =
                                        formatPhoneWithCountryCode(
                                          maskedValue,
                                          country.code
                                        );
                                      setPhone(formattedPhone);
                                    }
                                  }}
                                  className="flex items-center w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors"
                                >
                                  <span className="text-lg mr-2">
                                    {country.flag}
                                  </span>
                                  <span className="text-sm font-medium">
                                    {country.code}
                                  </span>
                                  <span className="text-xs text-gray-500 ml-2">
                                    {country.name}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="(99) 123-4567"
                          value={phone.replace(selectedCountryCode + " ", "")}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          className="rounded-l-none h-10"
                          maxLength={PHONE_MAX_LENGTH}
                        />
                      </div>
                      {phoneError && (
                        <p className="text-red-500 text-xs mt-1">
                          {phoneError}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="promotions"
                        checked={acceptPromotions}
                        onCheckedChange={(checked) =>
                          setAcceptPromotions(checked as boolean)
                        }
                      />
                      <Label htmlFor="promotions" className="text-sm">
                        Acepto recibir promociones por{" "}
                        <span className="text-green-600 font-medium">
                          WhatsApp
                        </span>
                      </Label>
                    </div>

                    <div>
                      <Label
                        htmlFor="name"
                        className="text-sm font-medium text-gray-700"
                      >
                        Nombre completo
                      </Label>
                      <Input
                        id="name"
                        placeholder="Tu nombre completo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        ¿De dónde nos conoces?
                      </Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {referralSources.map((source) => (
                          <button
                            key={source.id}
                            onClick={() => handleSourceSelect(source.id)}
                            className={`p-2 text-center rounded-lg border transition-all text-xs ${
                              referralSource === source.id
                                ? "border-purple-500 bg-purple-50"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            {source.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        setCurrentView(VIEWS.SURVEY);
                        setStep(FORM_STEPS.SURVEY);
                      }}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      disabled={!canContinue}
                    >
                      Continuar
                    </Button>
                  </div>
                )}
                {currentView === VIEWS.SURVEY && (
                  <div className="space-y-4 animate-in slide-in-from-top duration-300">
                    <div className="grid grid-cols-5 gap-2">
                      {ratingEmojis.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setRating(item.id)}
                          className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center justify-center ${
                            rating === item.id
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="text-2xl mb-1">{item.emoji}</div>
                          <div className="text-xs font-medium text-center">
                            {item.label}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Feedback positivo */}
                    {positiveRating && (
                      <div className="mt-6 space-y-4">
                        <div className="text-center">
                          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                          <h3 className="font-bold text-green-600">
                            ¡Gracias {name.split(" ")[0]}!
                          </h3>
                          <p className="text-sm text-gray-600">
                            +500 puntos agregados
                          </p>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <div className="flex items-start space-x-2">
                            <Checkbox
                              id="terms-positive"
                              checked={acceptTerms}
                              onCheckedChange={(checked) =>
                                setAcceptTerms(checked as boolean)
                              }
                            />
                            <Label
                              htmlFor="terms-positive"
                              className="text-xs text-gray-600 leading-tight"
                            >
                              Al continuar, acepto los Términos y Condiciones y
                              las Políticas de Privacidad.
                            </Label>
                          </div>
                        </div>

                        <Button
                          onClick={openGoogleMaps}
                          className="w-full mt-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                          disabled={!acceptTerms}
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          Escribir mi reseña en Google
                        </Button>
                      </div>
                    )}

                    {/* Feedback negativo */}
                    {!positiveRating && rating && (
                      <div className="mt-6 space-y-4">
                        <Textarea
                          placeholder="Cuéntanos más detalles (opcional)"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="min-h-[80px]"
                        />

                        <div className="pt-4 border-t border-gray-200">
                          <div className="flex items-start space-x-2">
                            <Checkbox
                              id="terms"
                              checked={acceptTerms}
                              onCheckedChange={(checked) =>
                                setAcceptTerms(checked as boolean)
                              }
                            />
                            <Label
                              htmlFor="terms"
                              className="text-xs text-gray-600 leading-tight"
                            >
                              Al presionar &apos;Enviar&apos;, acepto los
                              Términos y Condiciones y las Políticas de
                              Privacidad.
                            </Label>
                          </div>
                        </div>

                        <Button
                          onClick={() => setCurrentView(VIEWS.THANK_YOU)}
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                          disabled={!rating || !acceptTerms}
                        >
                          Enviar feedback
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

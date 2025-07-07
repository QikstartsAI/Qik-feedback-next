"use client";
import { useEffect, useState } from "react";
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
import { Star, MapPin, CheckCircle } from "lucide-react";
import { useCustomer } from "@/hooks/useCustomer";
import { IconChevronCompactLeft, IconChevronLeft } from "@tabler/icons-react";

export default function QikLoyaltyPlatform() {
  const { currentCustomer, getCustomerByPhone, editCustomer } = useCustomer();
  const [currentView, setCurrentView] = useState<
    "welcome" | "survey" | "thankyou"
  >("welcome");
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [acceptPromotions, setAcceptPromotions] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [referralSource, setReferralSource] = useState("");
  const [rating, setRating] = useState<string>("");
  const [comment, setComment] = useState("");

  const progress = (step / 2) * 100;

  const ratingEmojis = [
    { id: "terrible", emoji: "😡", label: "Terrible" },
    { id: "bad", emoji: "😞", label: "Malo" },
    { id: "regular", emoji: "😐", label: "Regular" },
    { id: "good", emoji: "😊", label: "Bueno" },
    { id: "excellent", emoji: "🤩", label: "Excelente" },
  ];

  const sources = [
    { id: "google_maps", label: "Google Maps" },
    { id: "whatsapp", label: "WhatsApp" },
    { id: "referral", label: "Referido" },
    { id: "walking", label: "Caminaba" },
    { id: "social_media", label: "Redes sociales" },
    { id: "other", label: "Otro" },
  ];

  const validatePhone = (phoneNumber: string) => {
    const cleanPhone = phoneNumber.replace("+593 ", "").replace(/\s/g, "");
    if (cleanPhone.length > 10) {
      setPhoneError("Número incorrecto - máximo 10 dígitos");
      return false;
    } else if (cleanPhone.length < 10 && cleanPhone.length > 0) {
      setPhoneError("Número incompleto");
      return false;
    } else {
      setPhoneError("");
      return true;
    }
  };

  const handlePhoneChange = async (value: string) => {
    const formattedPhone = "+593 " + value;
    await getCustomerByPhone(value);
    setPhone(formattedPhone);
    validatePhone(formattedPhone);
  };

  const handleSourceSelect = (sourceId: string) => {
    setReferralSource(sourceId);
  };

  const openGoogleMaps = () => {
    window.open("https://g.page/r/CdUpuKOxF_CvEBM/review", "_blank");
    setStep(3);
  };

  useEffect(() => {
    if (!currentCustomer?.payload) return;
    const { fullName } = currentCustomer?.payload;
    setName(fullName);
  }, [currentCustomer]);

  const canContinueStep1 = name && phone && !phoneError && referralSource;
  const isPositiveRating = rating === "good" || rating === "excellent";

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
            {isPositiveRating
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
        style={{ backgroundImage: "url('/restaurant-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <div className="flex items-center space-x-3 w-full max-w-md">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-8 h-8 rounded-full"
              />
            </div>
            <div className="text-white">
              <h1 className="text-lg font-bold">La Romagna</h1>
              <p className="text-sm text-gray-200">
                Restaurante Italiano • 0.2 km
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="min-h-screen bg-gradient-to-b from-purple-100 via-blue-50 to-white">
        <div className="max-w-md mx-auto p-6 -mt-8 relative z-20">
          {currentView === "thankyou" ? (
            <Thankyou />
          ) : (
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
              <CardHeader className="text-center pb-4">
                <div>
                  <IconChevronLeft
                    className="cursor-pointer"
                    onClick={() => setCurrentView("welcome")}
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
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Encuesta rápida</span>
                    <span>{"< 25 segundos"}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {currentView === "welcome" && (
                  <div className="space-y-4 animate-in slide-in-from-top duration-300">
                    <div>
                      <Label
                        htmlFor="phone"
                        className="text-sm font-medium text-gray-700"
                      >
                        Teléfono
                      </Label>
                      <div className="flex mt-1">
                        <div className="flex items-center px-3 bg-gray-50 border border-r-0 rounded-l-md">
                          <span className="text-lg">🇪🇨</span>
                          <span className="ml-1 text-sm">+593</span>
                        </div>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="99 123 4567"
                          value={phone.replace("+593 ", "")}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          className="rounded-l-none"
                          maxLength={10}
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
                        {sources.map((source) => (
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
                        setCurrentView("survey");
                        setStep(2);
                      }}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      disabled={!canContinueStep1}
                    >
                      Continuar
                    </Button>
                  </div>
                )}
                {currentView === "survey" && (
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
                    {isPositiveRating && (
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
                    {!isPositiveRating && rating && (
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
                              Al presionar "Enviar", acepto los Términos y
                              Condiciones y las Políticas de Privacidad.
                            </Label>
                          </div>
                        </div>

                        <Button
                          onClick={() => setCurrentView("thankyou")}
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

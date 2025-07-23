"use client";

import { CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isPositiveRating } from "@/lib/utils/formUtils";

interface ThankYouViewProps {
  rating: string;
}

export function ThankYouView({ rating }: ThankYouViewProps) {
  const positiveRating = isPositiveRating(rating);

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
            📱 Te enviaremos un WhatsApp con el link a tu cartilla digital para
            que disfrutes de beneficios exclusivos.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

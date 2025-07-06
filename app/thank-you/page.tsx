"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Star } from "lucide-react"
import Image from "next/image"

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <Image src="/logo.png" alt="Pasta La Romana Logo" width={180} height={60} className="mx-auto mb-4" />
        </div>

        <Card className="w-full shadow-lg border-t-4 border-t-[#8a2be2]">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-[#34a853]" />
            </div>
            <CardTitle className="text-2xl text-[#8a2be2]">🎉 ¡Gracias por tu calificación positiva!</CardTitle>
            <CardDescription className="text-lg mt-2">
              Has sumado <span className="font-bold">+500 puntos</span> a tu cartilla digital.
              <br />
              Queremos crecer contigo. ¿Nos ayudas con una reseña en Google?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-2">Beneficios para ti:</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="mr-2 mt-1 text-[#34a853]">✓</div>
                  <span>Obtendrás más puntos por cada review positivo</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 text-[#34a853]">✓</div>
                  <span>Te recomendaremos más beneficios exclusivos</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 text-[#34a853]">✓</div>
                  <span>Ayudas a que más clientes vivan una gran experiencia</span>
                </li>
              </ul>
            </div>

            <p className="text-center text-gray-700 mb-4">
              Haz clic en el botón de abajo para abrir Google Maps y dejar tu reseña. Solo toma 30 segundos.
            </p>

            <div className="flex justify-center">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <a
              href="https://g.page/r/CdUpuKOxF_CvEBM/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#34a853] text-white font-bold rounded-lg hover:bg-[#2d9249] transition-colors"
            >
              Dejar reseña en Google
            </a>
          </CardFooter>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-500">
          <p>
            Powered by <span className="text-[#0088cc] font-semibold">Qik</span>
          </p>
        </div>
      </div>
    </div>
  )
}

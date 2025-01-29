import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Business } from "@/app/types/business";
import ImageRounded from "../ui/ImageRounded";
import { CustomerRole } from "@/app/types/customer";

type IntroProps = {
  business: Business | null;
  toogleCustomerType: (customer: CustomerRole) => void;
};

function Intro({ business, toogleCustomerType }: IntroProps) {
  const country = business?.Country || "EC";
  const waiter = business?.Waiter;
  const isUsCountry = country === "US" || country === "HK";
  const isCaCountry = country === "CA";
  const isItCountry = country === "IT";

  return (
    <div className="mx-auto py-12 lg:py-24 max-w-xl px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {isUsCountry
              ? "We value your opinion 😊, it will take you less than "
              : isCaCountry
              ? "Nous apprécions votre avis 😊, cela vous prendra moins de "
              : isItCountry
              ? "Apprezziamo la tua opinione 😊, ci vorrà meno di "
              : "Valoramos tu opinión 😊, te tomará menos de "}
            <span className="text-sky-500 font-medium">
              {isUsCountry
                ? "1 minute"
                : isCaCountry
                ? "1 minute"
                : isItCountry
                ? "1 minuto"
                : "1 minuto"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {waiter && (
            <div className="flex flex-col justify-center items-center my-2">
              {waiter.gender === "masculino" ||
              waiter.gender === "male" ||
              waiter.gender === "mâle" ? (
                <ImageRounded
                  imageUrl="/waiter_male.gif"
                  imageAlt="Icono de mesero"
                />
              ) : (
                <ImageRounded
                  imageUrl="/waiter_female.gif"
                  imageAlt="Icono de mesera"
                />
              )}
              <p className="text-center text-sm sm:text-lg pb-1 font-medium">
                {isUsCountry
                  ? "Today I attended to you:"
                  : isCaCountry
                  ? "Aujourd'hui, je me suis occupé de vous:"
                  : isItCountry
                  ? "Oggi ti ho servito:"
                  : "Hoy te atendí:"}
              </p>
              <p className="text-center text-base sm:text-lg pb-1 font-semibold">
                {waiter.name}
              </p>
            </div>
          )}
          <div className="flex flex-row justify-center items-center space-x-4 mt-4">
            <Button onClick={() => toogleCustomerType("new")}>
              {isUsCountry
                ? "New client"
                : isCaCountry
                ? "Nouveau client"
                : isItCountry
                ? "Nuovo cliente"
                : "Nuevo cliente"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => toogleCustomerType("frequent")}
            >
              {isUsCountry
                ? "I am already a client"
                : isCaCountry
                ? "Je suis déjà client"
                : isItCountry
                ? "Sono già cliente"
                : "Ya soy cliente"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Intro;

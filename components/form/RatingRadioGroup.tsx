import { FormControl, FormItem, FormLabel } from "../ui/Form";
import { cn } from "@/app/lib/utils";
import { RadioGroupItem } from "../ui/RadioGroup";
import { Ratings } from "@/app/types/feedback";
import { Business } from "@/app/types/business";
import Image from "next/image";

type RatingRadioGroupProps = {
  value: string;
  business: Business | null;
};

const ratingOptions = [
  {
    value: Ratings.Mal,
    label: { us: "Bad", ca: "Mal", fr: "Mal", it: "Male", default: "Mal" },
    image: "/mal.png",
  },
  {
    value: Ratings.Regular,
    label: {
      us: "Fair",
      ca: "Régulière",
      fr: "Régulière",
      it: "Regolare",
      default: "Regular",
    },
    image: "/regular.png",
  },
  {
    value: Ratings.Bien,
    label: { us: "Good", ca: "Bon", fr: "Bon", it: "Bene", default: "Bien" },
    image: "/bueno.png",
  },
  {
    value: Ratings.Excelente,
    label: {
      us: "Excellent",
      ca: "Excellent",
      fr: "Excellent",
      it: "Eccellente",
      default: "Excelente",
    },
    image: "/excelente.png",
  },
];

const getLabel = (option: any, country: string | undefined) => {
  switch (country) {
    case "US":
    case "HK":
      return option.label.us;
    case "CA":
      return option.label.ca;
    case "FR":
      return option.label.fr;
    case "IT":
      return option.label.it;
    default:
      return option.label.default;
  }
};

function RatingRadioGroup({ value, business }: RatingRadioGroupProps) {
  const country = business?.Country;

  return (
    <ul className="grid grid-cols-4 text-sm font-medium text-gray-900">
      {ratingOptions.map((option) => (
        <li
          key={option.value}
          className={cn(
            "w-full py-1 sm:py-2 cursor-pointer hover:scale-110 hover:sm:scale-125 transition-all",
            { "scale-110 sm:scale-125": value === option.value }
          )}
        >
          <FormItem className="flex flex-col items-center">
            <FormControl>
              <RadioGroupItem value={option.value} className="sr-only" />
            </FormControl>
            <FormLabel className="text-center w-full font-normal flex flex-col items-center cursor-pointer space-y-1">
              <Image
                src={option.image}
                alt={`experiencia ${option.label.default.toLowerCase()}`}
                className={cn("w-8 h-8 sm:w-10 sm:h-10", {
                  "opacity-50": value !== option.value,
                })}
                width={668}
                height={657}
              />
              <p className="w-full text-[10px] sm:text-[11px]">
                {getLabel(option, country)}
              </p>
            </FormLabel>
          </FormItem>
        </li>
      ))}
    </ul>
  );
}

export default RatingRadioGroup;

import { FormControl, FormItem, FormLabel } from "../ui/Form";
import { cn } from "@/app/lib/utils";
import { RadioGroupItem } from "../ui/RadioGroup";
import { Ratings } from "@/app/types/feedback";
import { Business } from "@/app/types/business";

import Image from "next/image";
import { useTranslation } from "react-i18next";

type RatingRadioGroupProps = {
  value: string;
  business: Business | BusinessI | undefined | null;
};

function RatingRadioGroup({ value, business }: RatingRadioGroupProps) {
  const { t } = useTranslation("form");
  return (
    <ul className="grid grid-cols-4 text-sm font-medium text-gray-900">
      <li
        className={cn(
          "w-full py-1 sm:py-2 cursor-pointer hover:scale-110 hover:sm:scale-125 filter grayscale hover:grayscale-0 transition-all",
          {
            "grayscale-0 scale-110 sm:scale-125": value === Ratings.Mal,
          }
        )}
      >
        <FormItem className="flex flex-col items-center ">
          <FormControl>
            <RadioGroupItem value="1" className="sr-only" />
          </FormControl>
          <FormLabel
            className={cn(
              "text-center w-full font-normal flex flex-col items-center cursor-pointer space-y-1"
            )}
          >
            <Image
              src="/mal.webp"
              alt="experiencia mal"
              className="w-8 h-8 sm:w-10 sm:h-10"
              width={668}
              height={657}
            />
            <p className="w-full text-[10px] sm:text-[11px]">
              {" "}
              {t(`ratingBadTitle`)}
            </p>
          </FormLabel>
        </FormItem>
      </li>
      <li
        className={cn(
          "w-full py-1 sm:py-2 cursor-pointer hover:scale-110 hover:sm:scale-125 filter grayscale hover:grayscale-0 transition-all",
          {
            "grayscale-0 scale-110 sm:scale-125": value === Ratings.Regular,
          }
        )}
      >
        <FormItem className="flex flex-col items-center ">
          <FormControl>
            <RadioGroupItem value="2" className="sr-only" />
          </FormControl>
          <FormLabel
            className={cn(
              "text-center w-full font-normal flex flex-col items-center cursor-pointer space-y-1"
            )}
          >
            <Image
              src="/regular.webp"
              alt="experiencia regular"
              className="w-8 h-8 sm:w-10 sm:h-10"
              width={668}
              height={657}
            />
            <p className="w-full text-[10px] sm:text-[11px]">
              {" "}
              {t(`ratingRegularTitle`)}
            </p>
          </FormLabel>
        </FormItem>
      </li>
      <li
        className={cn(
          "w-full py-1 sm:py-2 cursor-pointer hover:scale-110 hover:sm:scale-125 filter grayscale hover:grayscale-0 transition-all",
          {
            "grayscale-0 scale-110 sm:scale-125": value === Ratings.Bueno,
          }
        )}
      >
        <FormItem className="flex flex-col items-center ">
          <FormControl>
            <RadioGroupItem value="4" className="sr-only" />
          </FormControl>
          <FormLabel
            className={cn(
              "text-center w-full font-normal flex flex-col items-center cursor-pointer space-y-1"
            )}
          >
            <Image
              src="/bueno.webp"
              alt="experiencia bueno"
              className="w-8 h-8 sm:w-10 sm:h-10"
              width={668}
              height={657}
            />
            <p className="w-full text-[10px] sm:text-[11px]">
              {" "}
              {t(`ratingGoodTitle`)}
            </p>
          </FormLabel>
        </FormItem>
      </li>
      <li
        className={cn(
          "w-full py-1 sm:py-2 cursor-pointer hover:scale-110 hover:sm:scale-125 filter grayscale hover:grayscale-0 transition-all",
          {
            "grayscale-0 scale-110 sm:scale-125": value === Ratings.Excelente,
          }
        )}
      >
        <FormItem className="flex flex-col items-center ">
          <FormControl>
            <RadioGroupItem value="5" className="sr-only" />
          </FormControl>
          <FormLabel
            className={cn(
              "text-center w-full font-normal flex flex-col items-center cursor-pointer space-y-1"
            )}
          >
            <Image
              src="/excelente.webp"
              alt="experiencia excelente"
              className="w-8 h-8 sm:w-10 sm:h-10"
              width={668}
              height={657}
            />
            <p className="w-full text-[10px] sm:text-[11px]">
              {" "}
              {t(`ratingExcellentTitle`)}
            </p>
          </FormLabel>
        </FormItem>
      </li>
    </ul>
  );
}

export default RatingRadioGroup;

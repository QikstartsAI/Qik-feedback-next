import "i18next";
import { resources } from "./i18n";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "es";
    resources: (typeof resources)["es"];
  }
}

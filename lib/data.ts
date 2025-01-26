import {
  CoinsIcon,
  HomeIcon,
  Layers2Icon,
  ShieldCheckIcon,
} from "lucide-react";

export const dashboardRoutes = [
  {
    href: "",
    label: "Home",
    icon: HomeIcon,
  },
  {
    href: "workflows",
    label: "Workflows",
    icon: Layers2Icon,
  },
  {
    href: "credentials",
    label: "Credentials",
    icon: ShieldCheckIcon,
  },
  {
    href: "billing",
    label: "Billing",
    icon: CoinsIcon,
  },
];

export const SystemPrompt =
  "You are a web scraper helper that extract data from the provided HTML or text. You will be given a piece of text or HTML content as input and also the prompt with the data you have to extract. the response should always be only the extracted data as a JSON array or object, without any additional words or explanation. analyze the input carefully and extract data precisely based on the prompt. If no data is found, return an empty JSON array. work only with the provided content and ensure the output is always a valid JSON array without any surrounding text.";

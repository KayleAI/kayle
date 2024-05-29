import {
  CustomPlatform as OwnPlatform,
  Discord,
  Reddit
} from "@repo/icons/integrations/index";

export const integrations = [
  {
    slug: "custom",
    name: "Custom Integration",
    description: "Connect Kayle to your platform.",
    icon: OwnPlatform,
  },
  {
    slug: "reddit",
    name: "Reddit Integration",
    description: "Connect Kayle to your Subreddit.",
    icon: Reddit,
    comingSoon: true,
  },
  {
    slug: "discord",
    name: "Discord Integration",
    description: "Connect Kayle to your Discord server.",
    icon: Discord,
    comingSoon: true,
  },
];

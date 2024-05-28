import OwnPlatform from "@/icons/custom.svg";
import Discord from "@/icons/discord.svg";
import Reddit from "@/icons/reddit.svg";

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
  }
]
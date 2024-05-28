import { Heading, Subheading } from "@repo/ui/heading";
import { Card, CardGrid } from "@/components/card";
import { Link } from "@repo/ui/link";
import { Text } from "@repo/ui/text";

const options = [
  {
    id: "",
    href: "/developers",
    name: "Developer Portal",
    description: "Integrate Kayle into your platform.",
  }
];

export default async function Dashboard() {
  return (
    <>
      <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
        <Heading>
          Platform Dashboard
        </Heading>
        <div className="flex gap-4">
        </div>
      </div>
      <CardGrid className="my-8">
        {options.map((option) => (
          <Link key={option.id} href={option.href}>
            <Card className="p-4 relative">
              <Subheading level={3}>
                {option.name}
              </Subheading>
              <Text>
                {option.description}
              </Text>
            </Card>
          </Link>
        ))}
      </CardGrid>
    </>
  )
}

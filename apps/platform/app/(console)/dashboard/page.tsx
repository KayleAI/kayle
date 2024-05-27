import { Heading, Subheading } from "@repo/ui/heading";
import { Card } from "@/components/card";
import { Link } from "@repo/ui/link";

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
    <div>
      <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
        <Heading>
          Platform Dashboard
        </Heading>
        <div className="flex gap-4">
        </div>
      </div>
      <main className="my-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {options.map((option) => (
          <Link key={option.id} href={option.href}>
            <Card className="p-4">
              <Subheading level={3}>
                {option.name}
              </Subheading>
              <p className="text-zinc-700 dark:text-zinc-300 text-sm">
                {option.description}
              </p>
            </Card>
          </Link>
        ))}
      </main>
    </div>
  )
}

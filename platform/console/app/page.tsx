import { Link } from "@repo/ui/link"

const links = [
  {
    name: "Documentation",
    description: "Read the documentation to learn how to use Kayle.",
    href: "https://docs.kayle.ai",
    newTab: true,
  },
  {
    name: "GitHub",
    description: "View the source code on GitHub.",
    href: "https://github.com/KayleAI/kayle",
    newTab: true,
  },
  {
    name: "API Keys",
    description: "Generate and manage Kayle API Keys.",
    href: "/keys",
  }
]

export default async function Dashboard() {
  return (
    <main className="p-4 sm:p-8">
      <h1>
        Dashboard
      </h1>
      <p>
        Kayle is still being built. Here are some links to get you started:
      </p>
      <div className="flex flex-col gap-y-2 mt-4">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            target={link.newTab ? "_blank" : undefined}
            className="p-4 bg-gray-100 rounded-md"
          >
            <h2 className="text-lg font-semibold">{link.name}</h2>
            <p>{link.description}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}

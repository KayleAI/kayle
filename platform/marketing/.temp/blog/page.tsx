import { Card } from '@/components/Card'
import { type BlogWithSlug, getAllBlogs } from '@/lib/blogs'
import { formatDate } from '@/lib/formatDate'

function Blog({ blog }: Readonly<{ blog: BlogWithSlug }>) {
  return (
    <article className="md:grid md:grid-cols-4 md:items-baseline">
      <Card className="md:col-span-3">
        <Card.Title href={`/blog/${blog.slug}`}>
          {blog.title}
        </Card.Title>
        <Card.Eyebrow
          as="time"
          dateTime={blog.date}
          className="md:hidden"
          decorate
        >
          {formatDate(blog.date)}
        </Card.Eyebrow>
        <Card.Description>{blog.description}</Card.Description>
        <Card.Cta>Read blog</Card.Cta>
      </Card>
      <Card.Eyebrow
        as="time"
        dateTime={blog.date}
        className="mt-1 hidden md:block"
      >
        {formatDate(blog.date)}
      </Card.Eyebrow>
    </article>
  )
}

export default async function BlogsIndex() {
  let blogs = await getAllBlogs()

  return (
    <div className="md:border-l md:border-neutral-100 md:pl-6 md:dark:border-neutral-700/40">
      <div className="flex max-w-3xl flex-col space-y-16">
        {blogs.map((blog: any) => (
          <Blog key={blog.slug} blog={blog} />
        ))}
      </div>
    </div>
  )
}

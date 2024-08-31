import glob from "fast-glob";

interface Blog {
	title: string;
	description: string;
	author: string;
	date: string;
}

export interface BlogWithSlug extends Blog {
	slug: string;
}

async function importBlog(blogFilename: string): Promise<BlogWithSlug> {
	const { blog } = (await import(`../app/blog/${blogFilename}`)) as {
		default: React.ComponentType;
		blog: Blog;
	};

	return {
		slug: blogFilename.replace(/(\/page)?\.mdx$/, ""),
		...blog,
	};
}

export async function getAllBlogs() {
	const blogFilenames = await glob("*/page.mdx", {
		cwd: "./app/blog",
	});

	const blogs = await Promise.all(blogFilenames.map(importBlog));

	return blogs.sort(
		(a, z) => Number(new Date(z.date)) - Number(new Date(a.date)),
	);
}

import { slugifyWithCounter } from "@sindresorhus/slugify";
import { toString as toMdastString } from "mdast-util-to-string";
import { mdxAnnotations } from "mdx-annotations";
import rehypeSlug from "rehype-slug";
import { remarkRehypeWrap } from "remark-rehype-wrap";
import shiki from "shiki";
import { visit } from "unist-util-visit";
import * as acorn from "acorn";

function rehypeParseCodeBlocks() {
	return (tree) => {
		visit(tree, "element", (node, _nodeIndex, parentNode) => {
			if (node.tagName === "code" && node.properties.className) {
				parentNode.properties.language = node.properties.className[0]?.replace(
					/^language-/,
					"",
				);
			}
		});
	};
}

let highlighter;

function rehypeShiki() {
	return async (tree) => {
		highlighter =
			highlighter ?? (await shiki.getHighlighter({ theme: "css-variables" }));

		visit(tree, "element", (node) => {
			if (node.tagName === "pre" && node.children[0]?.tagName === "code") {
				const codeNode = node.children[0];
				const textNode = codeNode.children[0];

				node.properties.code = textNode.value;

				if (node.properties.language) {
					const tokens = highlighter.codeToThemedTokens(
						textNode.value,
						node.properties.language,
					);

					textNode.value = shiki.renderToHtml(tokens, {
						elements: {
							pre: ({ children }) => children,
							code: ({ children }) => children,
							line: ({ children }) => `<span>${children}</span>`,
						},
					});
				}
			}
		});
	};
}

function rehypeSlugify() {
	return (tree) => {
		const slugify = slugifyWithCounter();
		visit(tree, "element", (node) => {
			if (node.tagName === "h2" && !node.properties.id) {
				node.properties.id = slugify(toMdastString(node));
			}
		});
	};
}

function rehypeAddMDXExports(getExports) {
	return (tree) => {
		const exports = Object.entries(getExports(tree));

		for (const [name, value] of exports) {
			for (const node of tree.children) {
				if (
					node.type === "mdxjsEsm" &&
					new RegExp(`export\\s+const\\s+${name}\\s*=`).test(node.value)
				) {
					return;
				}
			}

			const exportStr = `export const ${name} = ${value}`;

			tree.children.push({
				type: "mdxjsEsm",
				value: exportStr,
				data: {
					estree: acorn.parse(exportStr, {
						sourceType: "module",
						ecmaVersion: "latest",
					}),
				},
			});
		}
	};
}

function getSections(node) {
	const sections = [];

	for (const child of node.children ?? []) {
		if (child.type === "element" && child.tagName === "h2") {
			sections.push(`{
        title: ${JSON.stringify(toMdastString(child))},
        id: ${JSON.stringify(child.properties.id)},
        ...${child.properties.annotation}
      }`);
		} else if (child.children) {
			sections.push(...getSections(child));
		}
	}

	return sections;
}

export const rehypePlugins = [
	mdxAnnotations.rehype,
	rehypeSlug,
	rehypeParseCodeBlocks,
	rehypeShiki,
	rehypeSlugify,
	[
		rehypeAddMDXExports,
		(tree) => ({
			sections: `[${getSections(tree).join()}]`,
		}),
	],
	[
		remarkRehypeWrap,
		{
			node: { type: "element", tagName: "article" },
			start: "element[tagName=hr]",
			transform: (article) => {
				article.children.splice(0, 1);
				const heading = article.children.find((n) => n.tagName === "h2");
				const slugify = slugifyWithCounter();
				article.properties = {
					...heading.properties,
					title: toMdastString(heading),
				};
				heading.properties = {
					id: slugify(toMdastString(heading)),
				};
				return article;
			},
		},
	],
];

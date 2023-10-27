import { readFile, readdir } from 'node:fs/promises';
import { RequestListener, createServer } from 'node:http';
import { type Plugin, unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { Nodes, Root } from 'mdast';
import { zone } from 'mdast-zone';

const host = 'localhost';
const port = 8000;
const STARTS_WITH_DIGIT = /^\d+-/;

const session = async (id: string) => {
	try {
		const slides = await readFile(`.${id}/slides.md`, 'utf-8').then(html);
		return slides;
	} catch (error) {
		return `<p>Could not find <code>${id}/slides.md</code>. <a href="/">Go back</a>.<p>`;
	}
};

const omitFromSlides: Plugin<[], Root> = () => (tree: Nodes) =>
	zone(tree, 'omit-from-slides', (start, _nodes, end) => [start, end]);

const processor = unified()
	.use(remarkParse)
	.use(remarkGfm)
	.use(omitFromSlides)
	.use(remarkRehype)
	.use(rehypeHighlight)
	.use(rehypeStringify);

/** Markdown in, HTML out */
const html = (markdown: string) =>
	Promise.all(
		markdown.split('\n---\n').map((slide) => processor.process(slide)),
	).then((slides) =>
		slides
			.map(
				(slide, index) =>
					`<article>${slide}<aside>${index + 1}/${
						slides.length
					}</aside></article>`,
			)
			.join('\n'),
	);

const requestListener: RequestListener = async (request, response) => {
	const url = new URL(request.url ?? '/', `http://${request.headers.host}`);

	const template = await readFile('./assets/template.html', 'utf-8');
	const styles = await readFile('./assets/styles.css', 'utf-8');

	switch (url.pathname) {
		case '/': {
			response.end(
				template.replace('<!-- TITLE -->', 'TypeScript School').replace(
					'<!-- MAIN -->',
					`<ol>${(await readdir('.'))
						.filter((name) => name.match(STARTS_WITH_DIGIT))
						.map(
							(session) =>
								`<li><a href="/${session}">${session
									.replace(STARTS_WITH_DIGIT, '')
									.replaceAll('-', ' ')}</a></li>`,
						)
						.join('\n')}</ol>`,
				),
			);
			return;
		}
		default: {
			response.end(
				template
					.replace('<!-- TITLE -->', 'TypeScript School')
					.replace('<!-- STYLES -->', `<style>${styles}</style>`)
					.replace('<!-- MAIN -->', await session(url.pathname)),
			);
			return;
		}
	}
};

const server = createServer(requestListener);
server.listen(port, host, () => {
	console.log(`See the slides on http://${host}:${port}`);
});

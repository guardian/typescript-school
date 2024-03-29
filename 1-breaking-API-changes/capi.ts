import zod from 'zod';
import { fetchJSON } from './json.ts';

const fields = zod.object({
	thumbnail: zod.string().url().optional(),
	trailText: zod.string().optional(),
	byline: zod.string().optional(),
});

export type PillarId = zod.output<typeof pillarId>;
const pillarId = zod.enum([
	'pillar/news',
	'pillar/opinion',
	'pillar/sport',
	'pillar/lifestyle',
	'pillar/arts',
	// @TODO: the pillar can be `undefined` for Labs
	// Search for “Guardian”
]);

/** **Concepts**: Generics */
export type Result = zod.output<typeof result>;
const result = zod.object({
	pillarId,
	webPublicationDate: zod.coerce.date(),
	webTitle: zod.string(),
	webUrl: zod
		.string()
		.url()
		.transform((url) => new URL(url)),
	fields,
});

const schema = zod.object({
	response: zod.object({
		status: zod.literal('ok'),
		results: zod.array(result),
	}),
});

export const search = async (q: string | null): Promise<Result[]> => {
	if (!q) return [];

	/** @see https://open-platform.theguardian.com/documentation/search */
	const params = new URLSearchParams({
		q,
		orderBy: 'newest', // not "relevance"
		'page-size': String(24),
		'show-fields': ['thumbnail', 'trailText', 'byline'].join(','),
		'api-key': 'test',
	});

	const url = new URL(
		`search?${params.toString()}`,
		'https://content.guardianapis.com/',
	);

	const parsed = await fetchJSON(url, { parser: schema.safeParse });

	if (parsed.success) {
		return parsed.data.response.results;
	}

	console.error('Could not parse JSON response', parsed.error);
	return [];
};

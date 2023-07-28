import zod from 'zod';
import { fetchJSON } from './json.ts';

const fields = zod.object({
	thumbnail: zod.string().optional(),
	trailText: zod.string().optional(),
	byline: zod.string().optional(),
});

type Result = zod.output<typeof result>;
const result = zod.object({
	pillarId: zod.string().optional(),
	webPublicationDate: zod.string(),
	webTitle: zod.string(),
	webUrl: zod.string(),
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

	const {
		response: { results },
	} = await fetchJSON(url, { parser: schema.parse });

	return results;
};

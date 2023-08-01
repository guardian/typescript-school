import { palette } from '@guardian/source-foundations';
import { PillarId } from './capi';

type Palette<T extends keyof typeof palette> =
	(typeof palette)[T][keyof (typeof palette)[T]];

type PillarColour =
	| Palette<'neutral'>
	| Palette<'news'>
	| Palette<'opinion'>
	| Palette<'sport'>
	| Palette<'culture'>
	| Palette<'lifestyle'>;

const styles = {
	news: {
		border: palette.news[400],
		headline: palette.news[300],
		text: palette.neutral[10],
		background: palette.neutral[97],
	},
	opinion: {
		border: palette.opinion[400],
		headline: palette.opinion[400],
		text: palette.neutral[10],
		background: palette.opinion[800],
	},
	sport: {
		border: palette.sport[400],
		headline: palette.sport[400],
		text: palette.neutral[10],
		background: palette.neutral[97],
	},
	culture: {
		border: palette.culture[500],
		headline: palette.culture[400],
		text: palette.neutral[10],
		background: palette.neutral[97],
	},
	lifestyle: {
		border: palette.lifestyle[400],
		headline: palette.lifestyle[300],
		text: palette.neutral[10],
		background: palette.neutral[97],
	},
} as const satisfies Record<
	string,
	Record<'border' | 'headline' | 'text' | 'background', PillarColour>
>;

type Pillar = keyof typeof styles;

export const pillarStyles = (pillars: Set<PillarId>) =>
	[...pillars]
		.map((pillar) => pillarMappings[pillar])
		.flatMap((pillar) => [
			`.${pillar} {`,
			`--border: ${styles[pillar].border};`,
			`--headline: ${styles[pillar].headline};`,
			`--text: ${styles[pillar].text};`,
			`--background: ${styles[pillar].background};`,
			`}`,
		])
		.join('\n');

export const pillarMappings = {
	'pillar/news': 'news',
	'pillar/opinion': 'opinion',
	'pillar/sport': 'sport',
	'pillar/lifestyle': 'lifestyle',
	'pillar/arts': 'culture',
} as const satisfies Record<PillarId, Pillar>;

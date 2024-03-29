import { palette } from '@guardian/source-foundations';
import { PillarId } from './capi';
/**
 * **Concepts**: Generics
 *
 * This utility type extracts a union of all the possible colours
 * for any given key of `palette`, such as `brand`, `neutral`, etc.
 *
 * Allows to narrow usage of colours down to a specific subset of colours,
 * allowing the narrowest possible `styles` object.
 */
type PaletteColour<T extends keyof typeof palette> =
	(typeof palette)[T][keyof (typeof palette)[T]];

/**
 * **Concepts**: Narrowing, Generics
 *
 * The five Guardian pillars, driven from Source’s palette.
 *
 * @see https://www.typescriptlang.org/docs/handbook/utility-types.html#extracttype-union
 */
type Pillar = Extract<
	keyof typeof palette,
	'news' | 'opinion' | 'sport' | 'culture' | 'lifestyle'
	// @TODO we need to account for 'labs'
>;

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
	// as const satisfies allows to have the actual value of the object,
	// but ensure that it still matches a specific shape
	// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator
} as const satisfies {
	[Key in Pillar]: Record<
		'border' | 'headline' | 'text' | 'background',
		PaletteColour<Key> | PaletteColour<'neutral'>
	>;
};

/**
 * **Concepts**: Functions
 *
 * Generate appropriates styles for a set of pillars,
 * which prevents unused styles from being generated.
 *
 * CSS custom properties (variables) are used to scope dynamic styles
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
 */
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

/**
 * **Concepts**: Narrowing, Generics
 */
export const pillarMappings = {
	'pillar/news': 'news',
	'pillar/opinion': 'opinion',
	'pillar/sport': 'sport',
	'pillar/lifestyle': 'lifestyle',
	'pillar/arts': 'culture',
} as const satisfies Record<PillarId, Pillar>;

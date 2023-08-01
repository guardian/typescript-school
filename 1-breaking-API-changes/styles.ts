import {
	body,
	headline,
	palette,
	textSans,
} from '@guardian/source-foundations';

const gap = 20;
const columnWidth = 300;
const imageRatio = 5 / 3;

export const styles = `/* generated styles */

body {
    --columns: 1;
    --gaps: var(--columns) - 1;
    width: calc(var(--columns) * ${columnWidth}px + (var(--gaps)) * ${gap}px);
    margin: auto;

    ${body.medium()};
}

${Array.from({ length: 8 }, (_, index) => index * (gap + columnWidth))
	.map(
		(width, columns) =>
			`@media screen and (min-width: ${width}px) { body { --columns: ${columns}; } }`,
	)
	.join('\n')}

h1 { ${headline.medium()}; color: ${palette.brand[400]} }

ul#results {
    display: grid;
    padding: 0;
    list-style-type: none;
    width: min-content;
  
    grid-template-columns: repeat(var(--columns), ${columnWidth}px);
    gap: ${gap}px;
}

.result a {
    border-top: 1px solid var(--border);
    display: grid;
    grid-template-rows: ${300 / imageRatio}px auto auto auto 1fr auto;
    text-decoration: none;
    
    color: var(--text, ${palette.neutral[10]});
    background-color: var(--background, ${palette.neutral[97]});
  
    padding: 0.25rem;
    gap: 0.25rem;
    box-sizing: border-box;
    height: 100%;
}

.result :is(h2, h3, h4, p) {
    margin: 0;
    padding: 0
}

.result .date {
    text-align: right;
    align-self: end;
    grid-row-end: -1;
    ${textSans.xsmall()};
}

.result h2 {
    color: var(--headline);
    ${headline.xsmall()};
}

.result h3 {
    ${headline.xxsmall({ fontWeight: 'light', fontStyle: 'italic' })};
}

.result img {
    margin: -0.25rem;
    margin-bottom: 0;
    display: block;
}

.result:hover {
    --background: ${palette.neutral[86]};
}

.result:hover img {
    opacity: 0.875;
}
`;

import { isNonNullable, timeAgo } from '@guardian/libs';
import { Result } from './capi.ts';
import { pillarMappings } from './pillars.ts';

export const card = ({
	fields: { byline, thumbnail, trailText },
	webPublicationDate,
	webTitle,
	webUrl,
	pillarId,
}: Result): string =>
	[
		`<li class="result ${pillarMappings[pillarId]}">`,
		`<a href="${webUrl}">`,
		thumbnail &&
			`<img src="${thumbnail}" role="presentation" width="300" height="180" />`,
		webTitle && `<h2>${webTitle}</h2>`,
		byline && `<h3>${byline}</h3>`,
		trailText && `<p>${trailText}</p>`,
		`<p class="date">${timeAgo(webPublicationDate.getTime())}</p>`,
		'</a>',
		'</li>',
	]
		.filter(isNonNullable)
		.join('\n');

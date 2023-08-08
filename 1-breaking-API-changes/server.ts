import { RequestListener, createServer } from 'node:http';
import { search } from './capi.ts';
import { styles } from './styles.ts';
import { pillarStyles } from './pillars.ts';
import { card } from './card.ts';

const host = 'localhost';
const port = 8000;

const requestListener: RequestListener = async (request, response) => {
	const url = new URL(request.url ?? '/', `http://${request.headers.host}`);
	const query = url.searchParams.get('q');
	const results = query ? await search(query) : [];

	response.end(`<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>CAPI + TS</title>
	<!-- this is slow - do not use it for production Guardian sites -->
	<link href="https://assets.guim.co.uk/static/frontend/fonts/font-faces.css" rel="stylesheet" />
</head>
<style>

	${styles}

	/* relevant pillar styles */
	${pillarStyles(new Set(results.map(({ pillarId }) => pillarId)))}
</style>
<body>
	<h1>Using TypeScript to validate CAPI search queries</h1>

	<form>
		<input name="q" type="search" value="${
			query ?? ''
		}" placeholder="search for…" />
		<button type="submit">Search</button>
	</form>

${
	query
		? results.length > 0
			? `<ul id="results">${results.map(card).join('\n')}</ul>`
			: `<p>Failed to fetch results :(</p>`
		: `<!-- no search query -->`
}
</body>
</html>`);
};

const server = createServer(requestListener);
server.listen(port, host, () => {
	console.log(`Server is running on http://${host}:${port}`);
});

import { RequestListener, createServer } from 'node:http';
import { search } from './capi.ts';

const host = 'localhost';
const port = 8000;

const requestListener: RequestListener = async (request, response) => {
	const url = new URL(request.url ?? '/', `http://${request.headers.host}`);
	const query = url.searchParams.get('q');
	const results = query ? await search(query) : [];

	response.end(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CAPI + TS</title>
</head>
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
		? `<ul id="results">${results
				.map((result) => `<li>${result.webTitle}</li>`)
				.join('\n')}
                </ul>`
		: '<!-- no search query -->'
}
    
</body>
</html>`);
};

const server = createServer(requestListener);
server.listen(port, host, () => {
	console.log(`Server is running on http://${host}:${port}`);
});

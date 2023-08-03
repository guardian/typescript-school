import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { search } from './capi.ts';

const app = new Hono();

app.get('/', async (c) => {
	const query = c.req.query('q');
	const results = query ? await search(query) : [];

	return c.html(`<!DOCTYPE html>
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
});

serve(app);
console.log('Listening on http://localhost:3000/');

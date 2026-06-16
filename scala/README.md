# Scala School

## Evaluating Scala snippets

We use [`mdoc`](https://scalameta.org/mdoc/) to automatically run & evaluate
all the Scala snippets in our Markdown in the `original-docs` folder, generating
the `evaluated-docs` folder copies of the original Markdown files, this time updated
to include the results of running that Scala code.

Use the `--watch` flag to have the evaluated Markdown regenerated every time
you save the original Markdown file:

```bash
cd scala/
sbt "mdoc --watch"
```

_this will also start a mdoc preview server at http://localhost:4000/_

You can then run the Slides server in [the normal way](../README.md), which will
serve http://localhost:8000/scala from the `evaluated-docs` folder.

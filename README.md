# POST - The TABLEFLIP contact form handler

Store and forward data posted to it from forms on static sites.
Data is stored in leveldb.
Periodically sent on to recipients.

## Getting started

`npm watch` => run site in dev mode.

- `server.js` is an express app.
- `db.js` handles storage via leveldb.
- `pages` dir is statically built out front end for managing our post routes.

## Routing / whitelisting of referrer

Expect all incoming messages to have a referrer (TBD, possibly not a good assumption... we should possibly encode the source in the url that we post to, eg. https://post.tableflip.io/marmalade-productions, where we expect marmalade-productions to match a route in the db.)

`leveldb key => recipe`

```
route!tableflip.io => { email: 'hello@tableflip.io', frequency: 'daily' }
route!tableflip.io/startup => { email: 'hello@tableflip.io', frequency: 'all' }
route!marmalade-productions.com => { email: 'hello@tableflip.io', frequency: 'daily' }
```

We look up for a specific match on domain + path, then a domain match if there isn't a specific match.

1. lookup `tableflip.io/foo/bar`, not found.
2. lookup `tableflip.io`. found; make it so.


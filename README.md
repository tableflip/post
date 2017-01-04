# POST - The TABLEFLIP contact form handler

Store and forward data posted to it from forms on static sites.
Data is stored in leveldb.
Periodically sent on to recipients.

## Getting started

Copy `config/defaults.json` to `config/local.json` and fill out your mailgun credentials.
Use a wordpress account to create an [Akismet](https://akismet.com/account/) api key.

**From the command line**

- `npm watch` => to run the site in dev mode, with automagic restarting on change.
- `npm start` => to run it for real.

**Files of note**

- `server.js` is an express app.
- `db.js` initialises a leveldb instance.
- `pages` dir holds our route. `/pages/home` is mounted under `/`

## P O S T usage

Create an html form. Set `method="post"` the `action` to point to  

`https://post.tableflip.io/butterfield-diet.com`

Replace `butterfield-diet.com` with your domain that will be sending the posts.

```html
<form action="https://post.tableflip.io/butterfield-diet.com" method="post">
  <label for="email" class="label">Your email address</label>
  <input id="email" name="email" type="email" required="" class="input border-box">
  <label for="info" class="label">Any info</label>
  <textarea id="info" name="info" rows="3" class="textarea border-box"></textarea>
  <button class="btn btn-primary">Send</button>
</form>
```

The `name` values on your inputs will show up as labels in your notification, to give the values some context.

Use the admin screen at `https://post.tableflip.io/routes` to configure a route for `https://butterfield-diet.com`, to tell it where to send the message, and where to redirect the user afterwards.

## Level DB

See: http://dailyjs.com/2013/04/18/leveldb-and-node-1/

For looking up where to send a message to, we have general purpose **domain** routes, that'll be used when a more specific **domain + path** route can't be found.

This let's you configure a default handler for all forms on a site, and occasionally override it for a specific form if you need to. The path can be as deeply nested as you need, it just needs to correspond to the path that you append to https://post.tableflip.io/yoursite.com/path/to/your/special/form/here

```
route!tableflip.io => { email: 'hello@tableflip.io', frequency: 'daily' }
route!tableflip.io/startup => { email: 'hello@tableflip.io', frequency: 'all' }
route!marmalade-productions.com => { email: 'hello@tableflip.io', frequency: 'daily' }
```

We look up for a specific match on domain + path, then a domain match if there isn't a specific match.

1. lookup `tableflip.io/foo/bar`, not found.
2. lookup `tableflip.io`. found; make it so.

---

A [(╯°□°）╯︵TABLEFLIP](https://tableflip.io) side project.

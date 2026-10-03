# Connecting this site to ContentSathi

ContentSathi publishes articles to this site by calling **`POST /api/contentsathi`**. The site checks the key,
saves the article as `content/blog/<slug>.json`, and shows it at **`/blog/<slug>`**. The files in
`lib/contentsathi/` and `app/api/contentsathi/route.ts` are copied from `bollywood/shared/contentsathi-connect/`
by `bollywood/shared/sync.sh` — edit them there, never here (the next sync overwrites this copy).

## Set it up — in this order

ContentSathi creates the key and shows it **once**, so the site goes live first and the key comes second.

1. **Deploy the site** at a public `https://` address. ContentSathi refuses `localhost`, private addresses and
   anything that is not https.
2. **Set these on the host** (see `env.example`): `NEXT_PUBLIC_SITE_URL`, and the three `GITHUB_CONTENT_*` values
   (below). Until `CONTENTSATHI_WEBHOOK_KEY` exists the receiver answers `503 not set up yet` — it never accepts
   anything without a key.
3. **In ContentSathi, switch to this site's workspace** (the wedding/personal site → *Personal Brand*; the classes
   site → *Bollywood Dance Classes*). A website connection belongs to one workspace and cannot be used from another.
   Open **Website updates → Connect a website** (it opens the SEO Harness, at `/seo-harness`; a Personal Brand
   workspace's sidebar has no SEO item, so use that button) and enter:
   - **Website URL:** `https://<your-domain>/blog`  ← the `/blog` matters: ContentSathi records `<URL>/<slug>` as
     the address of the published post.
   - **Webhook URL:** `https://<your-domain>/api/contentsathi`
   Copy the **receiver API key** it shows. It is not shown again.
4. **Put that key in `CONTENTSATHI_WEBHOOK_KEY` on the host** and redeploy.
5. **Check it:**
   ```bash
   curl -H "Authorization: Bearer <the key>" https://<your-domain>/api/contentsathi
   # → {"ok":true,"service":"contentsathi-receiver","store":"github"}
   ```
   `401` = wrong key. `503` = key or storage not set. `"store":null` plus a `problem` = storage not configured.

## Where posts are kept

A serverless host cannot write to its own disk, so in production the receiver **commits the article to this site's
GitHub repository**, and the host redeploys on the commit (about a minute). Free, versioned, no database.

Create a **fine-grained personal access token** limited to *this repository only* with **Contents: Read and write**
and nothing else, then set:

| Variable | Value |
|---|---|
| `GITHUB_CONTENT_TOKEN` | the token (a secret — host settings only, never committed) |
| `GITHUB_CONTENT_REPO` | `owner/name` of this site's repository |
| `GITHUB_CONTENT_BRANCH` | the branch the host deploys (default `main`) |

For local development no storage setting is needed: outside production the receiver writes to `content/blog/`
itself. In production it never does that implicitly.

## What ContentSathi sends, and what comes back

One receiver reads all three of ContentSathi's senders: the calendar publish flow, the SEO Harness, and the
env-ingest fallback (`Authorization: Bearer`). Fields it understands: `title`, `body` (or `content`), `slug`,
`category`, `tags`, `featuredImage` (https only), `metaTitle`, `metaDescription`, `publishImmediately`.

| Reply | Meaning |
|---|---|
| `200 {success, slug, status, created, unchanged, url}` | saved (`unchanged:true` = identical re-send, nothing written) |
| `400 {error, issues[]}` | the post was not accepted; every problem is listed |
| `401` | missing or wrong key |
| `413` | request over 256 KB |
| `502` | the post could not be saved (storage problem); safe to retry |
| `503` | not set up yet (no key, or no storage) |

- **Re-sending the same slug updates that post** and keeps its original publish date. Re-sending identical content
  does nothing, so a retry never duplicates a post or makes a pointless commit.
- **`publishImmediately: false` saves a draft.** Drafts are stored but never listed or served (their page is a 404)
  until ContentSathi sends them again as published.
- A body that arrives as HTML is converted to plain Markdown text; raw HTML is never rendered, scripts and event
  handlers are dropped, links must be `http`, `https`, `mailto` or `tel`, and images must be `https`.
- A payload with a `type` other than `post` is refused — **only articles are supported today.**

## Try it locally

```bash
CONTENTSATHI_WEBHOOK_KEY=test-key npm run dev
curl -X POST http://localhost:3000/api/contentsathi -H 'Content-Type: application/json' \
  -d '{"apiKey":"test-key","title":"Hello","body":"## Hi\n\nA first post.","publishImmediately":true}'
# then open http://localhost:3000/blog — and delete content/blog/hello.json afterwards
```
`npm test` runs the receiver's tests (no dependencies; Node's built-in runner).

## Schedules and announcements (not just articles)

Besides articles, ContentSathi can update two other things on a site that opts in:

| Type | What it is | Shown where |
|---|---|---|
| `announcement` | a banner: text, optional link, optional start and end time; switch it off with `active: false` | under the header on every page |
| `schedule` | the weekly class programme (classes site only) | `/classes` and the home page's class counts |

**What a site accepts is its own choice**, in `lib/contentsathi-site.ts` (never overwritten by `sync.sh`). The
wedding site takes `post` and `announcement`; the classes site takes `post`, `schedule` and `announcement`. Anything
else is refused with `400 This site does not accept … updates` — it is never stored. `GET /api/contentsathi`
(with the key) reports what a site accepts.

Received updates are saved as `content/announcement.json` and `content/schedule.json` — a fixed pair of names, so a
request can never choose a file. An identical re-send writes nothing. The pages read those files and fall back
(the classes site to its built-in programme; the banner to nothing) if one is missing or no longer valid, so a bad
file can never blank a page.

- **Timing.** The pages refresh at most every 15 minutes, so a banner's `startsAt` and `expiresAt` are honoured to
  within that. Publishing an update refreshes them at once.
- **A schedule replaces the whole programme.** Send every class, every time. `confirmed: true` means the owner has
  checked every row; while it is `false` the classes page tells visitors to call and confirm.

### Sending one from ContentSathi

Open **Website updates** in ContentSathi (sidebar: *Review & Publish → Website updates* in a Personal Brand workspace;
*Grow → Website updates*, and on the phone bar, in a general workspace; or go to `/website-content`). Choose the
website, choose *Announcement banner* or *Class schedule*, write it, and press **Preview what will go out**. That
sends nothing: ContentSathi shows you the exact words and issues an approval good for 15 minutes. Read them, tick
*I have read this, and it is correct*, and press **Publish**.

It is deliberately two steps, and the second cannot happen without the first (this is what stops a schedule going
live unread):

1. **Preview** — `POST /api/publish/website-content` with `{ websiteId, type, data }`. Nothing is sent. The reply
   has `rendered` (the exact words), a `digest`, and a `confirmToken`.
2. **Confirm** — the *same* body plus `confirmToken`. The token is bound to this exact content, this website, this
   user and this workspace; any edit, or someone else's token, is refused with `403 APPROVAL_INVALID`. Only then does
   the pre-publish gate run on the words visitors will read, and the update is sent.

On the screen, **changing anything after the preview removes the Publish button** until you preview again — the screen
never offers an approval that no longer fits. The screen remembers what you were typing, per workspace, in your
browser (never a preview or an approval). If you need the API directly, it uses your signed-in session; connection ids
are listed by `GET /api/website-connections`.

Clearing a banner is the same two steps ("Take the banner down") — and it works even if the compliance classifier is
down, because it publishes no words.

Rules ContentSathi enforces that you cannot lift from this side: only your own website connection in this
workspace is a destination (never the server-wide article ingest); switched-off, internal or non-https destinations
are refused; every publish is recorded in the audit log by its digest, not its words.

## Not built yet

- **Seeing what is on the site now, or what was sent before.** The Website updates screen starts from what you type;
  ContentSathi does not keep a copy of the live schedule to edit. (Every publish is recorded in the audit log by its
  digest.) For a schedule, send the whole list each time.
- **Prices, fees and other typed content.** A new kind of update needs three things added together: its strict shape in
  both `typed.ts` here and `src/lib/website/typed-content.ts` in ContentSathi (and a row in `contract-fixtures.json`),
  a page that shows it, and the site opting in. Nothing is accepted by accident.

# Open Spaces — Launch Checklist

A step-by-step guide to take this site from local development to live on the web.
Run through it top to bottom. Most of it is account setup and copy/paste — no coding required.

**The two accounts you need:** [Sanity](https://sanity.io) (the content system) and
[Vercel](https://vercel.com) (the host). A [GitHub](https://github.com) account is also
needed so Vercel can pull the code. All three have free tiers that are plenty to launch.

**Roughly:** 60–90 minutes for a first deploy. Keep a notes doc open to paste the keys
you collect along the way — you'll need them in Step 4.

---

## Step 1 — Create the Sanity project (content system)

Sanity is where Jeff & Jourdan (or whoever manages content) will edit the site.

1. Go to **https://sanity.io/manage** and sign in (Google/GitHub login is fine).
2. Click **Create new project**. Name it `Open Spaces`.
3. When asked about a dataset, use the default name **`production`** and set it to
   **Public** (this lets the website read content without an extra key).
4. Copy the **Project ID** (a short string like `a1b2c3d4`) into your notes — you'll
   need it twice.
5. In the project, go to **API → Tokens → Add API token**:
   - Name: `Website write token`
   - Permissions: **Editor**
   - Copy the token into your notes (you only see it once). This is only used by the
     automatic YouTube episode sync.
6. In **API → CORS origins**, click **Add origin** and add (with *Allow credentials* checked):
   - `http://localhost:3005` (for local editing)
   - You'll come back and add the live website URL after Step 5.

> ✅ End of Step 1 you should have: **Project ID** and a **write token** saved.

---

## Step 2 — Put the code on GitHub

Vercel deploys from a Git repository.

1. Create a GitHub account/org for Open Spaces if there isn't one.
2. Create a new **private** repository named `open-spaces`.
3. Push this project to it. (If you're not comfortable with Git, this is the one spot
   to grab a developer for 5 minutes — or ask me to walk you through the exact commands.)

> ✅ End of Step 2: the code is in a GitHub repo you control.

---

## Step 3 — Import the project into Vercel

1. Go to **https://vercel.com** and sign in **with GitHub**.
2. Click **Add New → Project**, then **Import** the `open-spaces` repo.
3. Vercel auto-detects Next.js — leave the build settings as their defaults.
4. **Don't click Deploy yet** — first add the environment variables (Step 4).

---

## Step 4 — Add environment variables in Vercel

In the import screen (or later under **Project → Settings → Environment Variables**),
add these. Paste the values you collected in Step 1.

**Required to launch:**

| Name | Value | Where it comes from |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | your Project ID | Step 1.4 |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | Step 1.3 |
| `SANITY_API_WRITE_TOKEN` | your write token | Step 1.5 |

**Optional — only if you want automatic episode syncing from YouTube:**

| Name | Value | Where it comes from |
|---|---|---|
| `YOUTUBE_API_KEY` | API key | Google Cloud Console → enable "YouTube Data API v3" |
| `YOUTUBE_CHANNEL_ID` | the Open Spaces channel ID (starts with `UC…`) | YouTube channel settings |
| `SYNC_SECRET` | any long random string you make up | invent one (e.g. a password generator) |

> Without the YouTube vars, episodes are simply added by hand in the Studio instead of
> syncing automatically — everything else works fine.

---

## Step 5 — Deploy

1. Click **Deploy**. Vercel builds the site (a couple of minutes).
2. You'll get a live URL like `open-spaces.vercel.app`. Open it — the site is live
   (still showing the built-in sample content until Step 6).
3. **Go back to Sanity → API → CORS origins** and add your new Vercel URL
   (e.g. `https://open-spaces.vercel.app`) with *Allow credentials* checked. This lets
   the content editor at `/studio` talk to Sanity.

> ✅ End of Step 5: the site is publicly live on a Vercel URL.

---

## Step 6 — Add the real content

1. Visit **`your-site-url/studio`** and sign in with the same Sanity account.
2. Fill in:
   - **Site Settings** — nav, social links, the **Donate/Giving URL** (your existing
     giving processor link), contact email, listen links (Apple/Spotify/YouTube).
   - **Home Page** — hero heading/body, hero image, the featured episode, reels.
   - **Episodes** — add episodes (or let the YouTube sync populate them).
   - **Articles** — write long-form posts.
3. As soon as real content is published, the site automatically switches from the
   sample placeholder content to your live Sanity content — no redeploy needed.

---

## Step 7 — Connect the domain

1. In **Vercel → Project → Settings → Domains**, add your domain
   (e.g. `theopenspacescollective.com`).
2. Vercel shows the DNS records to set. Add them at your domain registrar
   (GoDaddy/Squarespace/Cloudflare/wherever the domain lives).
3. Once DNS propagates (minutes to a few hours), the site is live on the real domain
   with HTTPS handled automatically.
4. Add the final domain to **Sanity CORS origins** too.

---

## Step 8 — Wire up the remaining pieces (when ready)

These aren't blockers for launch, but finish them for a fully functional site:

- [ ] **Newsletter signups** — the email forms currently don't submit anywhere. Point
      them at your email provider (HubSpot, Mailchimp, etc.). *Ask the developer / me to
      connect the form to your provider.*
- [ ] **Giving link** — confirm the real Donate URL is set in Site Settings.
- [ ] **Reel videos** — currently bundled with the site (fine to start). For the long
      term, host them on a video service (Mux / Cloudflare Stream) so the page stays fast.
- [ ] **Analytics** — add Vercel Analytics or Google Analytics if you want traffic data.

---

## Quick reference — what each account is for

| Account | Purpose | Who logs in |
|---|---|---|
| **Sanity** | Edit all website content (the `/studio`) | Whoever manages content |
| **Vercel** | Hosts the site, runs the auto-sync, manages the domain | Tech/admin owner |
| **GitHub** | Stores the code Vercel deploys from | Tech/admin owner |

---

*Questions on any step? The trickiest parts are usually Step 2 (Git) and the YouTube API
key — happy to walk through either live.*

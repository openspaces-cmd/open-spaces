import type {
  ArticleDetail,
  EpisodeListItem,
  HomeContent,
  SiteSettings,
  StoryItem,
} from "./queries";

// Placeholder content shown until a Sanity project is connected. Mirrors the
// live site (theopenspacescollective.com) so the build reads as the real thing.
export const sampleSettings: SiteSettings = {
  title: "Open Spaces",
  tagline: "Honest conversations that point people back to Jesus.",
  nav: [
    { label: "About", href: "/about" },
    { label: "Podcast", href: "/podcast" },
    { label: "Articles", href: "/articles" },
    { label: "Stories", href: "/stories" },
    { label: "Connect", href: "/connect" },
  ],
  givingUrl: "https://app.hubspot.com/payments/v6vTKckRhX?referrer=PAYMENT_LINK",
  newsletter: {
    heading: "Journey With Us",
    body: "Sign up to receive the latest updates from Open Spaces Collective.",
  },
  social: {
    instagram: "https://instagram.com/open.spaces.podcast",
    tiktok: "https://tiktok.com/@openspacespodcast",
    facebook: "https://facebook.com",
    youtube: "https://youtube.com",
  },
  listen: {
    applePodcasts: "https://podcasts.apple.com",
    spotify: "https://spotify.com",
    youtube: "https://youtube.com",
  },
  contactEmail: "questions@openspacespodcast.com",
};

// Real episodes from the live site, newest first. YouTube IDs taken from the
// live lightbox embeds so thumbnails render from i.ytimg.com.
export const sampleEpisodes: EpisodeListItem[] = [
  { _id: "ep-22", title: "Parenting: A Lifetime of Learning (A Conversation with Buddy Burks)", slug: "parenting-a-lifetime-of-learning-buddy-burks", youtubeId: "ljD-Ym-flcM", publishedAt: "2026-06-16T12:00:00Z", episodeNumber: 22, tags: ["family", "parenting"], excerpt: "Parenting is never something you fully figure out. Jeff and Jourdan sit down with Buddy Burks for an honest conversation about staying teachable and growing as a parent for the long haul.", guests: [{ _id: "g-buddy-burks", name: "Buddy Burks" }] },
  { _id: "ep-21", title: "Parenting: Raising Wise Kids in a Sexually Broken World", slug: "parenting-raising-wise-kids-in-a-sexually-broken-world", youtubeId: "q_x-Yv2V-sY", publishedAt: "2026-06-08T12:00:00Z", episodeNumber: 21, tags: ["family", "parenting"], excerpt: "How do you raise kids with wisdom and confidence in a culture that's confused and broken around sex and identity? A practical, grace-filled conversation for parents who want to lead the conversation instead of avoiding it." },
  { _id: "ep-20", title: "Parenting Through Divorce", slug: "parenting-through-divorce", youtubeId: "qHblrvIQKF8", publishedAt: "2026-05-20T12:00:00Z", episodeNumber: 20, tags: ["family", "parenting"], excerpt: "How do you parent well when a marriage ends? An honest look at co-parenting, grief, and extending grace to the kids caught in the middle." },
  { _id: "ep-19", title: "Talking to Kids About Porn", slug: "talking-to-kids-about-porn", youtubeId: "olg0OWhi3Q4", publishedAt: "2026-05-13T12:00:00Z", episodeNumber: 19, tags: ["family", "parenting"], excerpt: "A candid, age-appropriate guide to the conversation most parents dread — and why silence does more harm than the talk ever could." },
  { _id: "ep-18", title: "Honoring Our Moms", slug: "honoring-our-moms", youtubeId: "au5lh5YX_t0", publishedAt: "2026-05-06T12:00:00Z", episodeNumber: 18, tags: ["family"], excerpt: "Celebrating the women who shaped us — the complicated parts included — and what it really means to honor a parent as an adult." },
  { _id: "ep-17", title: "Owning Your Identity", slug: "owning-your-identity", youtubeId: "dfLGNDbK9Sc", publishedAt: "2026-04-29T12:00:00Z", episodeNumber: 17, tags: ["identity", "faith"], excerpt: "Who are you when the labels fall away? Finding your identity in Christ instead of performance, approval, or your past." },
  { _id: "ep-16", title: "Finding True Intimacy (feat. Rita Springer)", slug: "finding-true-intimacy-feat-rita-springer", youtubeId: "45onYTzPS9c", publishedAt: "2026-04-22T12:00:00Z", episodeNumber: 16, tags: ["marriage", "faith"], excerpt: "Worship leader Rita Springer joins us on closeness with God and others — and why real intimacy always costs us our masks.", guests: [{ _id: "g-rita", name: "Rita Springer", role: "Worship Leader & Songwriter" }] },
  { _id: "ep-15", title: "Community: What We Learned", slug: "community-what-we-learned", youtubeId: "iC685C8Lm28", publishedAt: "2026-04-15T12:00:00Z", episodeNumber: 15, series: "Community", tags: ["community"], excerpt: "Closing out our Community series with the biggest lessons on being known, staying, and doing life with other people." },
  { _id: "ep-14", title: "Community: Family Secrets and Forgiveness", slug: "community-family-secrets-and-forgiveness", youtubeId: "p7tUsqeACvU", publishedAt: "2026-04-08T12:00:00Z", episodeNumber: 14, series: "Community", tags: ["community", "family"], excerpt: "What happens when the secrets finally come out? A conversation about generational patterns, confession, and the long road of forgiveness." },
  { _id: "ep-13", title: "Community: The Messy Beginnings", slug: "community-the-messy-beginnings", youtubeId: "Hrs8qh4M22M", publishedAt: "2026-04-01T12:00:00Z", episodeNumber: 13, series: "Community", tags: ["community"], excerpt: "Every real community starts out awkward and uncomfortable. Why the messy beginning is worth pushing through." },
  { _id: "ep-12", title: "Community: You Make Sense", slug: "community-you-make-sense", youtubeId: "L6bWlOKLeZ8", publishedAt: "2026-03-25T12:00:00Z", episodeNumber: 12, series: "Community", tags: ["community", "identity"], excerpt: "On being fully known and still fully loved — and learning to offer that same grace to the people around us." },
  { _id: "ep-11", title: "Community: Don’t Fight Alone", slug: "community-dont-fight-alone", youtubeId: "CiVRarqc4xY", publishedAt: "2026-03-18T12:00:00Z", episodeNumber: 11, series: "Community", tags: ["community", "struggle"], excerpt: "Isolation tells you to hide. We talk about why your battles were never meant to be fought by yourself." },
  { _id: "ep-10", title: "Community: The Power of Being Known", slug: "community-the-power-of-being-known", youtubeId: "jKsZKDq2yeQ", publishedAt: "2026-03-11T12:00:00Z", episodeNumber: 10, series: "Community", tags: ["community"], excerpt: "Kicking off the Community series with the risk — and the reward — of letting people truly see you." },
  { _id: "ep-9", title: "Catching Up!", slug: "catching-up", youtubeId: "xW78Nd7SK-4", publishedAt: "2026-03-04T12:00:00Z", episodeNumber: 9, tags: ["faith"], excerpt: "Life updates, behind-the-scenes, and what’s ahead for Open Spaces — a candid catch-up with Jeff and Jourdan." },
  { _id: "ep-8", title: "Practical Steps for the Struggle", slug: "practical-steps-for-the-struggle", youtubeId: "K-9diAIP0Ls", publishedAt: "2026-02-25T12:00:00Z", episodeNumber: 8, tags: ["struggle", "faith"], excerpt: "Beyond willpower: concrete, grace-filled steps for walking through temptation and ongoing struggle." },
  { _id: "ep-7", title: "What I Needed Growing Up", slug: "what-i-needed-growing-up", youtubeId: "P9MyCjPsdOo", publishedAt: "2026-02-18T12:00:00Z", episodeNumber: 7, tags: ["family", "identity"], excerpt: "Looking back at the words, support, and truth we wish we’d had — and how to give it to the next generation." },
  { _id: "ep-6", title: "Top 5 Questions Answered", slug: "top-5-questions-answered", youtubeId: "k3IR8cha4ds", publishedAt: "2026-02-11T12:00:00Z", episodeNumber: 6, tags: ["q-and-a"], excerpt: "You asked, we answered. The five questions listeners send us most often, tackled honestly." },
  { _id: "ep-5", title: "The Impossible Becomes Possible", slug: "the-impossible-becomes-possible", youtubeId: "klWqNSidlDE", publishedAt: "2026-02-04T12:00:00Z", episodeNumber: 5, tags: ["faith", "struggle"], excerpt: "When God does what only God can do. Stories of redemption that rewrote what we thought was over." },
  { _id: "ep-4", title: "Navigating an Unconventional Relationship", slug: "navigating-an-unconventional-relationship", youtubeId: "NjBbfk2I9fk", publishedAt: "2026-01-28T12:00:00Z", episodeNumber: 4, tags: ["marriage"], excerpt: "Marriage doesn’t always look like the highlight reel. An honest conversation about building something real through the hard parts." },
  { _id: "ep-3", title: "Embracing What You Don’t Understand", slug: "embracing-what-you-dont-understand", youtubeId: "ykDTYEnMO6s", publishedAt: "2026-01-21T12:00:00Z", episodeNumber: 3, tags: ["faith"], excerpt: "Faith in the unanswered questions — learning to trust God when the story doesn’t make sense yet." },
  { _id: "ep-2", title: "Desires and Faith Collide", slug: "desires-and-faith-collide", youtubeId: "5b1ONYYASjQ", publishedAt: "2026-01-14T12:00:00Z", episodeNumber: 2, tags: ["struggle", "faith"], excerpt: "What do you do when what you want and what you believe pull in opposite directions? A vulnerable conversation about surrender." },
  { _id: "ep-1", title: "The Secret that Changed Everything", slug: "the-secret-that-changed-everything", youtubeId: "-Qpl4-RyGHQ", publishedAt: "2026-01-07T12:00:00Z", episodeNumber: 1, tags: ["marriage", "struggle"], excerpt: "Where the story begins. Jeff and Jourdan open up about the hidden struggle that nearly broke them — and the God who didn’t let it." },
];

export const isSampleEpisode = (id: string) => id.startsWith("ep-");

// --- Portable Text helpers (for sample show notes / articles) ---
type Block = Record<string, unknown>;
const span = (key: string, text: string, marks: string[] = []) => ({
  _type: "span",
  _key: key,
  text,
  marks,
});
const para = (key: string, text: string): Block => ({
  _type: "block",
  _key: key,
  style: "normal",
  markDefs: [],
  children: [span(`${key}s`, text)],
});
const heading = (key: string, style: "h2" | "h3", text: string): Block => ({
  _type: "block",
  _key: key,
  style,
  markDefs: [],
  children: [span(`${key}s`, text)],
});
const quote = (key: string, text: string): Block => ({
  _type: "block",
  _key: key,
  style: "blockquote",
  markDefs: [],
  children: [span(`${key}s`, text)],
});
const bullets = (keyBase: string, items: string[]): Block[] =>
  items.map((text, i) => ({
    _type: "block",
    _key: `${keyBase}-${i}`,
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [span(`${keyBase}-${i}s`, text)],
  }));

// --- Listener stories (sample fallback for the Stories wall) ---
export const sampleStories: StoryItem[] = [
  {
    _id: "story-1",
    title: "Freedom after twelve years",
    story:
      "I carried a secret for twelve years of my marriage. Episode 1 wrecked me — I pulled into my driveway and couldn't get out of the car. That night I told my wife everything. It's been eight months. We're in counseling, we're in community, and for the first time in my adult life I'm not hiding. Your story gave me the courage to start mine.",
    name: "Marcus",
    location: "Birmingham, AL",
    featured: true,
    submittedAt: "2026-05-28T12:00:00Z",
  },
  {
    _id: "story-2",
    story:
      "As a pastor's wife, I thought I had to have it together for everyone. Listening to Jourdan talk about staying — and being honest about how hard it was — gave me permission to stop performing. I told my small group the truth about our marriage last month. They didn't run. They came closer.",
    name: "Anonymous",
    anonymous: true,
    submittedAt: "2026-05-21T12:00:00Z",
  },
  {
    _id: "story-3",
    title: "The conversation I avoided for years",
    story:
      "Your episode on talking to kids about hard things pushed me to finally have the conversation with my 13-year-old that I'd been avoiding. It went nothing like I feared. He cried, I cried, and he said, \"I thought you'd be mad.\" We talk differently now.",
    name: "David",
    location: "Knoxville, TN",
    submittedAt: "2026-05-14T12:00:00Z",
  },
  {
    _id: "story-4",
    story:
      "I'm 23 and I've never heard people of faith talk this honestly. I drove my roommate crazy quoting the Community series. We started a group with four other girls because of it. Don't fight alone — we wrote it on our whiteboard.",
    name: "Hannah",
    location: "Athens, GA",
    submittedAt: "2026-05-07T12:00:00Z",
  },
  {
    _id: "story-5",
    title: "God wasn't finished",
    story:
      "After my divorce I was sure my story was over — that God was done with the broken version of me. A friend sent me The Impossible Becomes Possible. I've listened to it six times. I'm back in church for the first time in four years. Not fixed. But not hiding, and not alone.",
    name: "Renee",
    location: "Dallas, TX",
    featured: true,
    submittedAt: "2026-04-29T12:00:00Z",
  },
  {
    _id: "story-6",
    story:
      "My husband and I listen on our Friday drives. Episode 14 about family secrets started a conversation that lasted three hours in a parking lot. We called his mom that weekend. Forgiveness is slower than podcasts make it sound — but it started.",
    name: "Anonymous",
    anonymous: true,
    submittedAt: "2026-04-20T12:00:00Z",
  },
  {
    _id: "story-7",
    story:
      "I sent Episode 1 to my brother with the message \"this is me.\" It was the first time I told anyone. He called me within ten minutes and the first thing he said was \"I love you. Nothing changes that.\" We talk every week now.",
    name: "J.",
    location: "Phoenix, AZ",
    submittedAt: "2026-04-11T12:00:00Z",
  },
];

// --- Long-form articles (sample fallback) ---
export const sampleArticles: ArticleDetail[] = [
  {
    _id: "art-1",
    title: "When the Secret Finally Comes Out",
    slug: "when-the-secret-finally-comes-out",
    excerpt:
      "The day a hidden struggle comes to light can feel like the end of everything. Here’s what we wish someone had told us about the days that follow.",
    coverImageUrl: null,
    author: "Jeff Johnson",
    authorRole: "Co-host, Open Spaces",
    category: "Marriage",
    publishedAt: "2026-05-18T09:00:00Z",
    featured: true,
    body: [
      para(
        "a1-1",
        "For years I believed that if anyone really knew what I was carrying, I’d lose everything — my marriage, my ministry, the respect of my kids. So I kept it hidden. And the hiding nearly cost me more than the truth ever could have.",
      ),
      para(
        "a1-2",
        "When it finally came out, it didn’t feel like freedom. It felt like the ground giving way underneath us. But looking back now, that collapse was the most important thing that ever happened to our marriage.",
      ),
      heading("a1-3", "h2", "The truth is the beginning, not the end"),
      para(
        "a1-4",
        "We tend to think confession is the moment the story falls apart. In reality, it’s the moment God can finally start putting it back together. Nothing hidden can be healed. The thing you’re most afraid to say out loud is often the exact thing standing between you and freedom.",
      ),
      quote(
        "a1-5",
        "Confession isn’t the moment your story falls apart. It’s the moment God can finally start putting it back together.",
      ),
      heading("a1-6", "h2", "What actually helped"),
      ...bullets("a1-7", [
        "Telling one safe person before telling everyone.",
        "Finding a counselor who wasn’t shocked by us.",
        "Letting our community carry us when we couldn’t stand on our own.",
        "Measuring progress in honest days, not in a single dramatic fix.",
      ]),
      para(
        "a1-8",
        "If you’re holding something in the dark today, hear us gently: you were never meant to carry it alone. The road back is slow, but it is real — and there is grace for every step of it.",
      ),
    ],
  },
  {
    _id: "art-2",
    title: "Raising Kids Who Aren’t Afraid of Hard Conversations",
    slug: "raising-kids-who-arent-afraid-of-hard-conversations",
    excerpt:
      "If we want our kids to bring us the big stuff someday, we have to make our homes safe for the small stuff first.",
    coverImageUrl: null,
    author: "Jourdan Johnson",
    authorRole: "Co-host, Open Spaces",
    category: "Family",
    publishedAt: "2026-04-30T09:00:00Z",
    featured: false,
    body: [
      para(
        "a2-1",
        "Every parent says they want their kids to come to them with anything. But our kids aren’t deciding whether to trust us in the big moment — they’re deciding it in a thousand small ones, long before the hard conversation ever arrives.",
      ),
      heading("a2-2", "h2", "Safety is built in the small moments"),
      para(
        "a2-3",
        "When our kids bring us something little and we react with panic, lecture, or shame, we quietly teach them to bring us less next time. When we stay calm and curious, we teach them that home is a place where the truth is survivable.",
      ),
      quote(
        "a2-4",
        "Our kids decide whether to trust us with the big stuff based on how we handled the small stuff.",
      ),
      heading("a2-5", "h2", "A few things we try to do"),
      ...bullets("a2-6", [
        "Listen all the way through before we respond.",
        "Thank them for telling us, even when the news is hard.",
        "Separate the behavior from their belovedness — they’re never in danger of losing us.",
        "Go first with our own honesty so vulnerability feels normal in our house.",
      ]),
      para(
        "a2-7",
        "We won’t get this perfect, and we don’t have to. Kids don’t need flawless parents. They need parents who keep the door open.",
      ),
    ],
  },
  {
    _id: "art-3",
    title: "Community Is Supposed to Be Awkward at First",
    slug: "community-is-supposed-to-be-awkward-at-first",
    excerpt:
      "Real belonging almost never feels natural in the beginning. That discomfort isn’t a sign you’re doing it wrong.",
    coverImageUrl: null,
    author: "Jeff & Jourdan Johnson",
    authorRole: "Hosts, Open Spaces",
    category: "Community",
    publishedAt: "2026-04-02T09:00:00Z",
    featured: false,
    body: [
      para(
        "a3-1",
        "We’ve never once walked into a new group of people and felt instantly known. Every real friendship we have started with an awkward, slightly forced, why-am-I-here beginning. Somewhere along the way we decided that discomfort meant we’d found the wrong people. It usually just meant we were at the start.",
      ),
      heading("a3-2", "h2", "Belonging is on the other side of awkward"),
      para(
        "a3-3",
        "Connection asks something of us before it gives anything back. You have to show up again when it would be easier to stay home. You have to say the slightly-too-honest thing and see if it’s met with grace. The awkwardness isn’t the obstacle to community — it’s the price of admission.",
      ),
      quote(
        "a3-4",
        "The awkwardness isn’t the obstacle to community. It’s the price of admission.",
      ),
      para(
        "a3-5",
        "So if you’re in the uncomfortable early days with a new church, a new group, a new friendship — don’t bail yet. Stay through the awkward. What’s waiting on the other side is the kind of being-known we were all made for.",
      ),
    ],
  },
];

export const sampleHome: HomeContent = {
  heroHeading: "Your story matters",
  heroBody:
    "No matter what you’ve walked through, your story is not over. Open Spaces exists to create honest conversations that point people back to Jesus.",
  heroSubscribeLabel:
    "Subscribe for encouragement, new episodes, and honest conversations.",
  heroImageUrl: null,
  featuredHeading: "WHOA That’s Good with Sadie Robertson Huff",
  featuredBody:
    "We joined Sadie Robertson Huff on the WHOA That’s Good Podcast to talk about all things Open Spaces. Listen wherever you stream podcasts.",
  featuredYoutubeId: "b084e1tVGV8",
  reelsHeading: "Open Spaces",
  reels: [
    { url: "/reels/reel-1.mp4", poster: "/reels/reel-1.jpg" },
    { url: "/reels/reel-2.mp4", poster: "/reels/reel-2.jpg" },
    { url: "/reels/reel-3.mp4", poster: "/reels/reel-3.jpg" },
    { url: "/reels/reel-4.mp4", poster: "/reels/reel-4.jpg" },
    { url: "/reels/reel-5.mp4", poster: "/reels/reel-5.jpg" },
  ],
  // Curated first-listen path: the origin story arc — the first five episodes, in order.
  startHere: ["ep-1", "ep-2", "ep-3", "ep-4", "ep-5"]
    .map((id) => sampleEpisodes.find((e) => e._id === id))
    .filter((e): e is EpisodeListItem => Boolean(e)),
  aboutHeading: "About Us",
  aboutBody:
    "Jeff and Jourdan Johnson are worship leaders, pastors, and podcast hosts based in Atlanta, GA, with 25+ years of ministry experience. Their journey—shaped by God’s faithfulness—led them to launch Open Spaces, a podcast that encourages Jesus followers to share their stories with vulnerability while embracing the belief that God can do the impossible. Through worship, pastoring, and personal connections, they are passionate about helping others find freedom, embrace authenticity, and grow in their faith in Jesus.",
  aboutCtaLabel: "Keep Reading",
  aboutCtaUrl: "/about",
  aboutImageUrl: null,
  newsletterImageUrl: null,
};

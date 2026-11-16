import type { Metadata } from "next";
import { Azeret_Mono } from "next/font/google";

import FeedbackForm from "./FeedbackForm";

// The rest of the site no longer uses a mono face; this private form keeps
// its original design, so it loads Azeret Mono for itself only. The CSS
// module reads it through --font-mono.
const mono = Azeret_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Small Group Feedback | Open Spaces",
  description: "Share your feedback on the Open Spaces small group.",
  robots: { index: false, follow: false }, // link is shared privately with group members
};

export default function SmallGroupFeedbackPage() {
  return (
    <div className={mono.variable}>
      <FeedbackForm />
    </div>
  );
}

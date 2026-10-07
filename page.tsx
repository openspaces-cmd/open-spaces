import type { Metadata } from "next";
import FeedbackForm from "./FeedbackForm";

export const metadata: Metadata = {
  title: "Small Group Feedback | Open Spaces",
  description: "Share your feedback on the Open Spaces small group.",
  robots: { index: false, follow: false }, // link is shared privately with group members
};

export default function SmallGroupFeedbackPage() {
  return <FeedbackForm />;
}

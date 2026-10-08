// Question copy is verbatim from Jourdan's spec (Oct 1, 2026).
// Ids must match the COLUMNS keys in apps-script/Code.gs.

export type Question =
  | { id: string; type: "scale"; required: true; text: string; low: string; high: string }
  | { id: string; type: "radio"; required: boolean; text: string; options: string[]; other?: boolean }
  | { id: string; type: "checkbox"; required: true; text: string; hint?: string; options: string[] }
  | { id: string; type: "paragraph"; required?: false; text: string };

export type Section = { title: string; questions: Question[] };

export const SECTIONS: Section[] = [
  {
    title: "Overall Experience",
    questions: [
      { id: "q1", type: "scale", required: true, text: "Overall, how helpful was the Open Spaces small group for you?", low: "Not helpful", high: "Very helpful" },
      { id: "q2", type: "radio", required: true, text: "Compared to when you started, how supported do you feel now?", options: ["Much more supported", "Somewhat more supported", "About the same", "Less supported"] },
      { id: "q3", type: "scale", required: true, text: "How likely are you to recommend this group to another woman in a similar situation?", low: "Not likely", high: "Very likely" },
    ],
  },
  {
    title: "What Helped and What Was Missing",
    questions: [
      { id: "q4", type: "checkbox", required: true, text: "Which parts of our time together were most helpful to you?", hint: "Pick all that apply.", options: ["Opening check-in time", "Story sharing", "Group discussion", "Questions for Jourdan"] },
      { id: "q5", type: "paragraph", text: "What has been the most helpful part of the group for you, and why?" },
      { id: "q6", type: "radio", required: true, other: true, text: "How did the “no cross-talk, feelings instead of advice” format feel?", options: ["It helped me feel safe to share", "It was fine", "I would have liked more back-and-forth conversation"] },
      { id: "q7", type: "radio", required: true, text: "Did you feel you had enough time to share?", options: ["Yes, plenty", "Mostly", "Not enough"] },
      { id: "q8", type: "scale", required: true, text: "How helpful was the story guide in preparing to share your story?", low: "Not helpful", high: "Very helpful" },
      { id: "q9", type: "paragraph", text: "Was there anything in the story guide that felt unnecessary or that you would leave out?" },
      { id: "q10", type: "radio", required: true, other: true, text: "How did you feel about sharing your story with the group?", options: ["Safe and supported", "Nervous at first, then more comfortable", "Uncomfortable most of the time", "I chose not to share much"] },
      { id: "q11", type: "paragraph", text: "Is there anything you’d like me to know about your experience sharing your story?" },
      { id: "q12", type: "paragraph", text: "What felt missing, or what do you wish we had done differently?" },
    ],
  },
  {
    title: "Format",
    questions: [
      { id: "q13", type: "radio", required: true, other: true, text: "Our sessions ended up running about 2 hours instead of the planned 90 minutes. How did that feel?", options: ["Two hours felt right", "I’d prefer 90 minutes", "I’d be open to even longer"] },
      { id: "q14", type: "radio", required: true, text: "We met for 6 weeks. How did that length feel?", options: ["Too short, I wish it had gone longer", "Just right", "Too long"] },
      { id: "q15", type: "radio", required: true, text: "For a group like this, how many weeks feels ideal?", options: ["6 weeks", "8 weeks", "10–12 weeks", "Ongoing, with no set end date"] },
      { id: "q16", type: "radio", required: true, other: true, text: "For a group like this, how often is ideal to meet?", options: ["Weekly", "Every other week", "Monthly"] },
      { id: "q17", type: "radio", required: true, text: "How did the size of the group feel?", options: ["Too small", "Just right", "Too big"] },
      { id: "q18", type: "radio", required: true, text: "Did the day and time of our meetings work for you?", options: ["Yes", "Mostly", "No"] },
      { id: "q19", type: "paragraph", text: "Anything else about the format (length, size, schedule, Zoom) you’d change?" },
    ],
  },
  {
    title: "Looking Ahead",
    questions: [
      { id: "q20", type: "radio", required: true, text: "Would you like to hear about other Open Spaces resources (podcast, events, future offerings)?", options: ["Yes", "Maybe", "No, thank you"] },
      { id: "q21", type: "paragraph", text: "What would make a group like this even better for other women in the future?" },
    ],
  },
  {
    title: "Closing",
    questions: [
      { id: "q22", type: "paragraph", text: "Is there anything else you’d like to share with me?" },
      { id: "q23", type: "radio", required: true, text: "May I share an anonymous quote from your feedback to help other women find Open Spaces?", options: ["Yes", "No", "Please ask me first"] },
      { id: "q24", type: "radio", required: false, text: "Future Open Spaces groups may have a fee. What would feel fair to pay for a 6-week group like this one?", options: ["Less than $300", "$500", "$750", "$1000+"] },
    ],
  },
];

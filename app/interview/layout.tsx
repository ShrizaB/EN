import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interview Process | EduGuide",
  description: "Upload your resume and complete the interview process to get personalized feedback",
};

export default function InterviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

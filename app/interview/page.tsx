"use client"

import dynamic from 'next/dynamic';

// Import the client component with no SSR to avoid hydration issues with canvas
const InterviewClient = dynamic(
  () => import('@/components/interview/interview-client'),
  { ssr: false }
);

export default function InterviewPage() {
  return <InterviewClient />
}
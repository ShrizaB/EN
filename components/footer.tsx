import Link from "next/link"
import { BookOpen, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0 z-50 bg-black/85">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} EduNova. All rights reserved.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/about" className="text-sm text-muted-foreground hover:underline">
            About
          </Link>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
            Privacy
          </Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
            Terms
          </Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
            Contact
          </Link>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> by EduNova Team
          </div>
        </div>
      </div>
    </footer>
  )
}

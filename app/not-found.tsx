import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="text-8xl font-bold text-muted-foreground/30">404</div>
        <div>
          <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
          <p className="text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Link href="/">
            <Button>
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          Try using <kbd className="px-1.5 py-0.5 rounded border bg-muted font-mono text-xs">⌘K</kbd> to navigate
        </p>
      </div>
    </div>
  )
}

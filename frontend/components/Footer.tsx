import { Github, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-12 py-8 border-t border-border/40 bg-surface/50 backdrop-blur-sm">
      <div className="px-4 lg:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-muted">
        <div className="flex items-center gap-1">
          <span>© 2025 ADmyBRAND. All rights reserved.</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
          <span>by</span>
          <a
            href="https://github.com/rajat-malhotra0"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-primary hover:text-primary-dark transition-colors font-semibold hover:underline decoration-2 underline-offset-2"
          >
            <Github size={14} />
            Rajat Malhotra
          </a>
        </div>
      </div>
    </footer>
  );
}

import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-8 py-6 border-t border-border bg-surface">
      <div className="px-4 lg:px-6 flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-text-muted">
        <span>Made by</span>
        <a
          href="https://github.com/rajat-malhotra0"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors font-medium"
        >
          <Github size={16} />
          Rajat Malhotra
        </a>
      </div>
    </footer>
  );
}

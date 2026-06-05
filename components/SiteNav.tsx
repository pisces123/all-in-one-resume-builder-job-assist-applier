import {
  BriefcaseBusiness,
  Chrome,
  FileText,
  Github,
  LayoutDashboard,
  Map,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { href: "/", label: "Home", icon: Sparkles },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/resume", label: "Resume", icon: FileText },
  { href: "/jobs", label: "Jobs", icon: BriefcaseBusiness },
  { href: "/extension", label: "Extension", icon: Chrome },
  { href: "/roadmap", label: "Roadmap", icon: Map }
];

export function SiteNav() {
  return (
    <header className="siteNav">
      <Link className="siteBrand" href="/">
        <img src="/icon-128.png" alt="" width={42} height={42} />
        <span>
          <strong>All in One Resume</strong>
          <small>Build, tailor, track, apply</small>
        </span>
      </Link>

      <nav className="navLinks" aria-label="Primary navigation">
        {navLinks.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <Icon size={16} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="navActions">
        <ThemeToggle />
        <a
          className="navRepo"
          href="https://github.com/pisces123/all-in-one-resume-builder-job-assist-applier"
          target="_blank"
          rel="noreferrer"
        >
          <Github size={16} />
          <span>GitHub</span>
        </a>
      </div>
    </header>
  );
}

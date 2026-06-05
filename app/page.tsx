import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Chrome,
  FileText,
  Mail,
  ShieldCheck,
  WandSparkles
} from "lucide-react";
import Link from "next/link";
import { InteractiveHero } from "@/components/InteractiveHero";

const flow = [
  {
    icon: FileText,
    title: "Build the base resume",
    copy: "Start from a guided profile or import what you already have, then keep one clean source of truth."
  },
  {
    icon: BriefcaseBusiness,
    title: "Save every job",
    copy: "Use the Chrome saver or add roles manually so each opportunity has a job description, status, and notes."
  },
  {
    icon: WandSparkles,
    title: "Tailor before applying",
    copy: "Generate a targeted draft, ATS readiness estimate, cover letter, and next-best action list."
  }
];

const stats = [
  ["7", "pipeline stages"],
  ["PDF", "one-click export"],
  ["DOCX", "editable copies"],
  ["MV3", "Chrome capture"]
];

export default function LandingPage() {
  return (
    <main className="landingShell">
      <InteractiveHero>
        <div className="heroGradientLayer" aria-hidden="true" />
        <div className="heroShade" />
        <div className="heroCopy">
          <p className="heroKicker">
            <ShieldCheck size={18} />
            All in One Resume Builder
          </p>
          <h1>Apply with a sharper resume.</h1>
          <p>
            Build a clean base resume, save every job, tailor your application,
            and keep the whole search moving from one focused workspace.
          </p>
          <div className="heroActions">
            <Link className="heroPrimary" href="/dashboard">
              <WandSparkles size={18} />
              Launch Workspace
            </Link>
            <Link className="heroSecondary" href="/extension">
              <Chrome size={18} />
              Chrome Saver
            </Link>
          </div>
        </div>
      </InteractiveHero>

      <section className="landingMetrics" aria-label="Product highlights">
        {stats.map(([value, label]) => (
          <div key={label}>
            <span>{value}</span>
            <p>{label}</p>
          </div>
        ))}
      </section>

      <section className="featureBand">
        <div className="sectionLead">
          <p className="eyebrow">Application flow</p>
          <h2>One clean loop from job discovery to ready-to-send docs.</h2>
        </div>
        <div className="flowGrid">
          {flow.map(({ icon: Icon, title, copy }) => (
            <article key={title} className="featureTile">
              <Icon size={24} />
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="splitBand">
        <div className="showcasePanel">
          <img src="/hero-stock.jpg" alt="" width={1280} height={853} />
        </div>
        <div className="launchList">
          <p className="eyebrow">Live MVP</p>
          <h2>Already online, already open source.</h2>
          <ul>
            <li>
              <CheckCircle2 size={18} />
              <span>Demo mode works without Supabase or DeepSeek keys.</span>
            </li>
            <li>
              <CheckCircle2 size={18} />
              <span>Server routes are ready for connected storage and AI.</span>
            </li>
            <li>
              <CheckCircle2 size={18} />
              <span>Exports, scoring, and tailoring fallbacks run today.</span>
            </li>
          </ul>
          <Link className="textArrow" href="/roadmap">
            Roadmap
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="ctaBand">
        <div>
          <p className="eyebrow">Ready workspace</p>
          <h2>Open the dashboard and start shaping the first resume/job flow.</h2>
        </div>
        <Link className="heroPrimary" href="/dashboard">
          <Mail size={18} />
          Go to Dashboard
        </Link>
      </section>
    </main>
  );
}

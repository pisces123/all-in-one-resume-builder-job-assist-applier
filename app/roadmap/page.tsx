import { Github, Map, Rocket, ShieldCheck, WandSparkles } from "lucide-react";

export const metadata = {
  title: "Roadmap"
};

const roadmap = [
  "Supabase-backed authentication UI",
  "Editable job-specific resume versions",
  "Job-board-specific scraping adapters",
  "Recruiter contact notes and follow-up reminders",
  "Interview prep cards from job descriptions",
  "Firefox and Edge extension ports"
];

export default function RoadmapPage() {
  return (
    <main className="contentPage">
      <section className="pageHero roadmapHero">
        <p className="heroKicker">
          <Map size={18} />
          Open-source roadmap
        </p>
        <h1>Keep the product free, useful, and honest about AI.</h1>
        <p>
          The MVP is online now. The next releases should make storage,
          tailoring, extension capture, and job-search coaching deeper without
          locking the core behind a paywall.
        </p>
        <a
          className="heroPrimary"
          href="https://github.com/pisces123/all-in-one-resume-builder-job-assist-applier"
          target="_blank"
          rel="noreferrer"
        >
          <Github size={18} />
          Open GitHub
        </a>
      </section>

      <section className="roadmapGrid">
        <article className="featureTile">
          <Rocket size={24} />
          <h3>Now</h3>
          <p>Live demo shell, API routes, exports, Chrome saver, and RLS schema.</p>
        </article>
        <article className="featureTile">
          <ShieldCheck size={24} />
          <h3>Next</h3>
          <p>Connected accounts, stored versions, service keys, and usage limits.</p>
        </article>
        <article className="featureTile">
          <WandSparkles size={24} />
          <h3>Later</h3>
          <p>Richer coaching, better parsing, more browsers, and team/community input.</p>
        </article>
      </section>

      <section className="checklistPanel">
        {roadmap.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </section>
    </main>
  );
}

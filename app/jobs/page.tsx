import { Bell, BriefcaseBusiness, CheckCircle2, ClipboardList, Search } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Job Tracker"
};

const stages = ["Saved", "Tailored", "Applied", "Interviewing", "Offer", "Rejected", "Archived"];

export default function JobsPage() {
  return (
    <main className="contentPage">
      <section className="pageHero jobsHero">
        <p className="heroKicker">
          <BriefcaseBusiness size={18} />
          Job tracker
        </p>
        <h1>Keep every role, document, and follow-up in one place.</h1>
        <p>
          The tracker is built around the real application loop: save, tailor,
          apply, follow up, interview, and close the loop.
        </p>
        <Link className="heroPrimary" href="/dashboard">
          <ClipboardList size={18} />
          Open Tracker
        </Link>
      </section>

      <section className="timelineBand">
        {stages.map((stage, index) => (
          <article key={stage} className="stageTile">
            <span>{index + 1}</span>
            <strong>{stage}</strong>
          </article>
        ))}
      </section>

      <section className="splitBand">
        <div className="launchList">
          <p className="eyebrow">Job-search moves</p>
          <h2>Application support beyond the resume file.</h2>
          <ul>
            <li>
              <Search size={18} />
              <span>Recruiter and hiring-manager search suggestions.</span>
            </li>
            <li>
              <Bell size={18} />
              <span>Follow-up timing and interview-prep prompts.</span>
            </li>
            <li>
              <CheckCircle2 size={18} />
              <span>Per-job readiness checks before applying.</span>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}

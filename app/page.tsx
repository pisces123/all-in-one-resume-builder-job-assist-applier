import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Chrome,
  FileText,
  Search,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { InteractiveHero } from "@/components/InteractiveHero";

const workflow = [
  {
    label: "01",
    title: "Keep one master resume",
    copy: "Import the resume you already have or build it section by section. The clean version stays in one place."
  },
  {
    label: "02",
    title: "Save the role before it disappears",
    copy: "Right-click a posting with the Chrome saver, or add the job by hand. The link, company, description, and notes stay with the application."
  },
  {
    label: "03",
    title: "Prepare the application packet",
    copy: "Compare the job against your resume, draft a better version, write the cover letter, and move the job through the tracker."
  }
];

const stats = [
  ["7", "clear job stages"],
  ["PDF", "ready-to-send export"],
  ["DOCX", "editable resume copies"],
  ["MV3", "right-click Chrome saver"]
];

const queue = [
  ["Saved", "Product Designer", "Resume match: 74"],
  ["Tailored", "Ops Coordinator", "Cover letter ready"],
  ["Interviewing", "Customer Success", "Prep notes due"]
];

export default function LandingPage() {
  return (
    <main className="landingShell">
      <InteractiveHero>
        <div className="heroDeskLayer" aria-hidden="true">
          <div className="deskLamp" />
          <div className="deskObject deskResumeSheet">
            <span className="deskTag">Master resume</span>
            <strong>Jordan Lee</strong>
            <span className="deskLine wide" />
            <span className="deskLine" />
            <span className="deskLine short" />
            <span className="deskScore">ATS readiness 82</span>
          </div>
          <div className="deskObject deskJobBrief">
            <span className="deskTag">Saved job</span>
            <strong>Marketing Analyst</strong>
            <span className="deskLine wide" />
            <span className="deskLine" />
            <span className="deskLine tiny" />
            <span className="deskStatus">Tailor next</span>
          </div>
          <div className="deskObject deskNote">
            <span>Recruiter note</span>
            <strong>Find hiring manager before applying.</strong>
          </div>
          <div className="deskObject deskLetter">
            <span className="deskTag">Cover letter</span>
            <span className="deskLine wide" />
            <span className="deskLine wide" />
            <span className="deskLine short" />
          </div>
        </div>
        <div className="heroShade" />
        <div className="heroCopy">
          <p className="heroKicker">
            <ShieldCheck size={18} />
            Built for real job searches
          </p>
          <h1>A proper desk for every job application.</h1>
          <p>
            Save the job, shape the resume, write the letter, and track what
            happened next without rebuilding everything from scratch.
          </p>
          <div className="heroActions">
            <Link className="heroPrimary" href="/dashboard">
              <FileText size={18} />
              Open Workspace
            </Link>
            <Link className="heroSecondary" href="/extension">
              <Chrome size={18} />
              Add Chrome Saver
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

      <section className="workflowBand">
        <div className="workflowIntro">
          <p className="eyebrow">The application desk</p>
          <h2>Everything you need before you hit apply.</h2>
          <p>
            Job hunting gets messy because every role needs a slightly different
            packet. This keeps the pieces together so you can move with less panic.
          </p>
        </div>
        <ol className="workflowList">
          {workflow.map(({ label, title, copy }) => (
            <li key={title}>
              <span>{label}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="casefileBand">
        <div className="applicationQueue" aria-label="Example job tracker queue">
          <div className="queueHeader">
            <span>Job desk</span>
            <strong>3 active applications</strong>
          </div>
          {queue.map(([stage, role, note]) => (
            <div className="queueRow" key={role}>
              <span>{stage}</span>
              <strong>{role}</strong>
              <p>{note}</p>
            </div>
          ))}
        </div>
        <div className="launchList">
          <p className="eyebrow">What it helps with</p>
          <h2>A calmer path from saved link to ready application.</h2>
          <ul>
            <li>
              <CheckCircle2 size={18} />
              <span>Keep each job description, URL, status, and note together.</span>
            </li>
            <li>
              <CheckCircle2 size={18} />
              <span>See what your resume is missing before you send it.</span>
            </li>
            <li>
              <CheckCircle2 size={18} />
              <span>Bring the right resume, cover letter, and interview notes back when you need them.</span>
            </li>
          </ul>
          <Link className="textArrow" href="/roadmap">
            See the roadmap
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="ctaBand">
        <div>
          <p className="eyebrow">Start with one role</p>
          <h2>Open the workspace, add a job, and make the next application less scattered.</h2>
        </div>
        <Link className="heroPrimary" href="/dashboard">
          <BriefcaseBusiness size={18} />
          Open Workspace
        </Link>
        <Link className="heroSecondary ctaSecondary" href="/jobs">
          <Search size={18} />
          View Job Tracker
        </Link>
      </section>
    </main>
  );
}

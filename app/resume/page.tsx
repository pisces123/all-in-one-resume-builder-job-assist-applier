import { Download, FileText, ShieldCheck, Upload, WandSparkles } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Resume Builder"
};

export default function ResumePage() {
  return (
    <main className="contentPage">
      <section className="pageHero resumeHero">
        <p className="heroKicker">
          <FileText size={18} />
          Resume builder
        </p>
        <h1>Turn one resume profile into job-ready versions.</h1>
        <p>
          Keep the base profile clean, then generate targeted drafts for each
          saved job without losing the original.
        </p>
        <Link className="heroPrimary" href="/dashboard">
          <WandSparkles size={18} />
          Open Builder
        </Link>
      </section>

      <section className="featureBand compact">
        <div className="flowGrid four">
          <article className="featureTile">
            <Upload size={24} />
            <h3>Import</h3>
            <p>Paste or upload text-readable resume content into the profile.</p>
          </article>
          <article className="featureTile">
            <ShieldCheck size={24} />
            <h3>Check</h3>
            <p>Score match, structure, measurable impact, and ATS-friendly formatting.</p>
          </article>
          <article className="featureTile">
            <WandSparkles size={24} />
            <h3>Tailor</h3>
            <p>Draft job-specific summaries, bullets, and emphasized skills.</p>
          </article>
          <article className="featureTile">
            <Download size={24} />
            <h3>Export</h3>
            <p>Create PDF and DOCX files for applications and editable backups.</p>
          </article>
        </div>
      </section>
    </main>
  );
}

import { Chrome, Link2, MousePointerClick, Save, Settings } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Chrome Extension"
};

export default function ExtensionPage() {
  return (
    <main className="contentPage">
      <section className="pageHero extensionHero">
        <p className="heroKicker">
          <Chrome size={18} />
          Manifest V3 extension
        </p>
        <h1>Right-click a job link and send it to the workspace.</h1>
        <p>
          The extension captures a URL first, then scrapes visible title,
          company, location, and description when the page allows it.
        </p>
        <Link className="heroPrimary" href="/dashboard">
          <Save size={18} />
          View Saved Jobs
        </Link>
      </section>

      <section className="featureBand compact">
        <div className="flowGrid four">
          <article className="featureTile">
            <MousePointerClick size={24} />
            <h3>Context menu</h3>
            <p>Chrome right-click actions for links and current pages.</p>
          </article>
          <article className="featureTile">
            <Link2 size={24} />
            <h3>URL fallback</h3>
            <p>Every save keeps the link even when page scraping is limited.</p>
          </article>
          <article className="featureTile">
            <Settings size={24} />
            <h3>App URL</h3>
            <p>The extension defaults to the live Vercel deployment.</p>
          </article>
          <article className="featureTile">
            <Chrome size={24} />
            <h3>Chrome first</h3>
            <p>Firefox and Edge ports stay on the open-source roadmap.</p>
          </article>
        </div>
      </section>
    </main>
  );
}

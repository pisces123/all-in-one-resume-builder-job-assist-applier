"use client";

import {
  BriefcaseBusiness,
  CheckCircle2,
  Chrome,
  ClipboardList,
  Download,
  FileText,
  Mail,
  Rocket,
  Save,
  Search,
  ShieldCheck,
  Upload,
  WandSparkles
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { analyzeAts } from "@/lib/ats";
import { defaultJobs, defaultResumeProfile, stages } from "@/lib/demo-data";
import { buildJobTips, createDemoCoverLetter, createDemoTailoring } from "@/lib/generation";
import { normalizeListInput, parseResumeText } from "@/lib/resume";
import type { CoverLetterDraft, JobRecord, JobStage, ResumeProfile, TailoringDraft } from "@/lib/types";

type HealthStatus = {
  mode: "connected" | "demo";
  supabasePublicConfigured: boolean;
  supabaseServerConfigured: boolean;
  aiConfigured: boolean;
  aiProvider: string;
};

const emptyJob = {
  title: "",
  company: "",
  location: "",
  url: "",
  description: "",
  notes: ""
};

function useStoredState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return fallback;
    const stored = window.localStorage.getItem(key);
    if (!stored) return fallback;
    try {
      return JSON.parse(stored) as T;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

function toTextareaList(items: string[]) {
  return items.join("\n");
}

function fromTextareaList(value: string) {
  return value
    .split("\n")
    .map((item) => item.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);
}

function scoreClass(score: number) {
  if (score >= 80) return "scoreGood";
  if (score >= 60) return "scoreOkay";
  return "scoreNeedsWork";
}

export default function Home() {
  const [profile, setProfile] = useStoredState<ResumeProfile>(
    "aio-resume-profile",
    defaultResumeProfile
  );
  const [jobs, setJobs] = useStoredState<JobRecord[]>("aio-jobs", defaultJobs);
  const [selectedJobId, setSelectedJobId] = useStoredState<string>(
    "aio-selected-job",
    defaultJobs[0]?.id || ""
  );
  const [resumeImportText, setResumeImportText] = useState("");
  const [newJob, setNewJob] = useState(emptyJob);
  const [tailoringDraft, setTailoringDraft] = useState<TailoringDraft | null>(null);
  const [coverLetter, setCoverLetter] = useState<CoverLetterDraft | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const selectedJob =
    jobs.find((job) => job.id === selectedJobId) || jobs[0] || null;
  const atsReport = useMemo(
    () =>
      selectedJob
        ? analyzeAts(profile, { description: selectedJob.description })
        : null,
    [profile, selectedJob]
  );
  const tips = useMemo(
    () => (selectedJob ? buildJobTips(selectedJob) : []),
    [selectedJob]
  );

  useEffect(() => {
    fetch("/api/health")
      .then((response) => response.json())
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  function updateProfile<K extends keyof ResumeProfile>(
    key: K,
    value: ResumeProfile[K]
  ) {
    setProfile((current) => ({
      ...current,
      [key]: value
    }));
  }

  async function importResume() {
    if (!resumeImportText.trim()) return;
    const parsed = parseResumeText(resumeImportText);
    setProfile((current) => ({
      ...current,
      ...parsed,
      skills: parsed.skills.length ? parsed.skills : current.skills,
      experience: parsed.experience.length ? parsed.experience : current.experience,
      education: parsed.education.length ? parsed.education : current.education
    }));
  }

  async function importResumeFile(file: File | null) {
    if (!file) return;
    const text = await file.text();
    setResumeImportText(text);
    const parsed = parseResumeText(text);
    setProfile((current) => ({ ...current, ...parsed }));
  }

  function saveJob() {
    const now = new Date().toISOString();
    const job: JobRecord = {
      id: crypto.randomUUID(),
      title: newJob.title || "Untitled job",
      company: newJob.company || "Unknown company",
      location: newJob.location,
      url: newJob.url,
      description: newJob.description,
      notes: newJob.notes,
      stage: "Saved",
      createdAt: now,
      updatedAt: now
    };
    setJobs((current) => [job, ...current]);
    setSelectedJobId(job.id);
    setNewJob(emptyJob);
    setTailoringDraft(null);
    setCoverLetter(null);
  }

  function updateJobStage(jobId: string, stage: JobStage) {
    setJobs((current) =>
      current.map((job) =>
        job.id === jobId
          ? { ...job, stage, updatedAt: new Date().toISOString() }
          : job
      )
    );
  }

  async function tailorSelectedJob() {
    if (!selectedJob) return;
    setIsBusy(true);
    try {
      const response = await fetch(`/api/jobs/${selectedJob.id}/tailor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          job: selectedJob
        })
      });
      const payload = (await response.json()) as { draft?: TailoringDraft };
      const draft = payload.draft || createDemoTailoring(profile, selectedJob);
      setTailoringDraft(draft);
      updateJobStage(selectedJob.id, "Tailored");
    } finally {
      setIsBusy(false);
    }
  }

  async function createCoverLetterForJob() {
    if (!selectedJob) return;
    setIsBusy(true);
    try {
      const response = await fetch(`/api/jobs/${selectedJob.id}/cover-letter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          job: selectedJob
        })
      });
      const payload = (await response.json()) as { draft?: CoverLetterDraft };
      setCoverLetter(payload.draft || createDemoCoverLetter(profile, selectedJob));
    } finally {
      setIsBusy(false);
    }
  }

  async function exportDocument(format: "pdf" | "docx", kind: "resume" | "cover-letter") {
    if (!selectedJob && kind === "cover-letter") return;
    const response = await fetch("/api/documents/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind,
        format,
        profile,
        job: selectedJob
          ? {
              title: selectedJob.title,
              company: selectedJob.company
            }
          : undefined,
        coverLetter
      })
    });
    const blob = await response.blob();
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `${profile.fullName || "resume"}-${kind}.${format}`
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, "-");
    link.click();
    URL.revokeObjectURL(href);
  }

  return (
    <main className="appShell">
      <header className="topBar">
        <div>
          <p className="eyebrow">Free open-source job search workspace</p>
          <h1>All in One Resume Builder and Job Assist Applier</h1>
        </div>
        <div className="statusCluster" aria-label="System status">
          <span className={health?.supabaseServerConfigured ? "pill green" : "pill amber"}>
            <ShieldCheck size={16} />
            {health?.supabaseServerConfigured ? "Supabase live" : "Demo storage"}
          </span>
          <span className={health?.aiConfigured ? "pill green" : "pill amber"}>
            <WandSparkles size={16} />
            {health?.aiConfigured ? `${health.aiProvider} live` : "Demo AI"}
          </span>
        </div>
      </header>

      <section className="commandBand">
        <div className="metrics">
          <div>
            <span>{jobs.length}</span>
            <p>Jobs saved</p>
          </div>
          <div>
            <span>{jobs.filter((job) => job.stage === "Applied").length}</span>
            <p>Applied</p>
          </div>
          <div>
            <span>{atsReport?.score ?? 0}%</span>
            <p>ATS readiness</p>
          </div>
        </div>
        <img
          src="/product-snapshot.png"
          alt=""
          className="productPreview"
          width={460}
          height={180}
        />
      </section>

      <section className="workspaceGrid" aria-label="Application workspace">
        <article className="panel resumePanel">
          <div className="panelHeader">
            <FileText size={20} />
            <h2>Resume Builder</h2>
          </div>

          <div className="importRow">
            <label className="fileButton">
              <Upload size={16} />
              Import
              <input
                type="file"
                accept=".txt,.md,.doc,.docx,.pdf"
                onChange={(event) => importResumeFile(event.target.files?.[0] || null)}
              />
            </label>
            <button className="ghostButton" onClick={importResume}>
              <Save size={16} />
              Parse Text
            </button>
          </div>

          <textarea
            className="importBox"
            placeholder="Paste resume text here"
            value={resumeImportText}
            onChange={(event) => setResumeImportText(event.target.value)}
          />

          <div className="formGrid">
            <label>
              Name
              <input
                value={profile.fullName}
                onChange={(event) => updateProfile("fullName", event.target.value)}
              />
            </label>
            <label>
              Headline
              <input
                value={profile.headline}
                onChange={(event) => updateProfile("headline", event.target.value)}
              />
            </label>
            <label>
              Email
              <input
                value={profile.email}
                onChange={(event) => updateProfile("email", event.target.value)}
              />
            </label>
            <label>
              Phone
              <input
                value={profile.phone}
                onChange={(event) => updateProfile("phone", event.target.value)}
              />
            </label>
            <label className="wide">
              Location
              <input
                value={profile.location}
                onChange={(event) => updateProfile("location", event.target.value)}
              />
            </label>
            <label className="wide">
              Summary
              <textarea
                value={profile.summary}
                onChange={(event) => updateProfile("summary", event.target.value)}
              />
            </label>
            <label className="wide">
              Skills
              <input
                value={profile.skills.join(", ")}
                onChange={(event) =>
                  updateProfile("skills", normalizeListInput(event.target.value))
                }
              />
            </label>
            <label className="wide">
              Experience Bullets
              <textarea
                value={toTextareaList(profile.experience)}
                onChange={(event) =>
                  updateProfile("experience", fromTextareaList(event.target.value))
                }
              />
            </label>
            <label className="wide">
              Education
              <textarea
                value={toTextareaList(profile.education)}
                onChange={(event) =>
                  updateProfile("education", fromTextareaList(event.target.value))
                }
              />
            </label>
          </div>
        </article>

        <article className="panel jobPanel">
          <div className="panelHeader">
            <BriefcaseBusiness size={20} />
            <h2>Job Database</h2>
          </div>

          <div className="formGrid">
            <label>
              Role
              <input
                value={newJob.title}
                onChange={(event) =>
                  setNewJob((current) => ({ ...current, title: event.target.value }))
                }
              />
            </label>
            <label>
              Company
              <input
                value={newJob.company}
                onChange={(event) =>
                  setNewJob((current) => ({ ...current, company: event.target.value }))
                }
              />
            </label>
            <label>
              Location
              <input
                value={newJob.location}
                onChange={(event) =>
                  setNewJob((current) => ({ ...current, location: event.target.value }))
                }
              />
            </label>
            <label>
              URL
              <input
                value={newJob.url}
                onChange={(event) =>
                  setNewJob((current) => ({ ...current, url: event.target.value }))
                }
              />
            </label>
            <label className="wide">
              Job Description
              <textarea
                value={newJob.description}
                onChange={(event) =>
                  setNewJob((current) => ({
                    ...current,
                    description: event.target.value
                  }))
                }
              />
            </label>
          </div>

          <button className="primaryButton" onClick={saveJob}>
            <Save size={16} />
            Save Job
          </button>

          <div className="jobList">
            {jobs.map((job) => (
              <button
                key={job.id}
                className={job.id === selectedJob?.id ? "jobItem selected" : "jobItem"}
                onClick={() => {
                  setSelectedJobId(job.id);
                  setTailoringDraft(null);
                  setCoverLetter(null);
                }}
              >
                <span>{job.title}</span>
                <small>
                  {job.company} · {job.stage}
                </small>
              </button>
            ))}
          </div>
        </article>

        <article className="panel actionPanel">
          <div className="panelHeader">
            <ClipboardList size={20} />
            <h2>Apply Workspace</h2>
          </div>

          {selectedJob ? (
            <>
              <div className="selectedJob">
                <div>
                  <p className="eyebrow">Selected job</p>
                  <h3>{selectedJob.title}</h3>
                  <p>{selectedJob.company}</p>
                </div>
                <select
                  value={selectedJob.stage}
                  onChange={(event) =>
                    updateJobStage(selectedJob.id, event.target.value as JobStage)
                  }
                >
                  {stages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>

              {atsReport && (
                <div className={`scorePanel ${scoreClass(atsReport.score)}`}>
                  <div>
                    <span>{atsReport.score}%</span>
                    <p>ATS readiness estimate</p>
                  </div>
                  <ShieldCheck size={34} />
                </div>
              )}

              <div className="buttonRow">
                <button className="primaryButton" onClick={tailorSelectedJob} disabled={isBusy}>
                  <WandSparkles size={16} />
                  Tailor Resume
                </button>
                <button className="secondaryButton" onClick={createCoverLetterForJob} disabled={isBusy}>
                  <Mail size={16} />
                  Cover Letter
                </button>
              </div>

              <div className="buttonRow">
                <button className="ghostButton" onClick={() => exportDocument("pdf", "resume")}>
                  <Download size={16} />
                  Resume PDF
                </button>
                <button className="ghostButton" onClick={() => exportDocument("docx", "resume")}>
                  <Download size={16} />
                  Resume DOCX
                </button>
              </div>

              <div className="reportList">
                {atsReport?.categories.map((category) => (
                  <div key={category.label} className="reportRow">
                    <div>
                      <strong>{category.label}</strong>
                      <p>{category.detail}</p>
                    </div>
                    <span>{category.score}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="emptyState">Save a job to start tailoring.</p>
          )}
        </article>
      </section>

      <section className="detailsGrid">
        <article className="panel">
          <div className="panelHeader">
            <WandSparkles size={20} />
            <h2>Tailored Resume Draft</h2>
          </div>
          {tailoringDraft ? (
            <div className="draftBlock">
              <span className={tailoringDraft.mode === "ai" ? "pill green" : "pill amber"}>
                {tailoringDraft.mode === "ai" ? "AI draft" : "Demo draft"}
              </span>
              <h3>Summary</h3>
              <p>{tailoringDraft.summary}</p>
              <h3>Bullets</h3>
              <ul>
                {tailoringDraft.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="emptyState">Tailor a selected job to generate an editable draft.</p>
          )}
        </article>

        <article className="panel">
          <div className="panelHeader">
            <Mail size={20} />
            <h2>Cover Letter</h2>
          </div>
          {coverLetter ? (
            <div className="draftBlock">
              <span className={coverLetter.mode === "ai" ? "pill green" : "pill amber"}>
                {coverLetter.mode === "ai" ? "AI draft" : "Demo draft"}
              </span>
              <h3>{coverLetter.subject}</h3>
              <pre>{coverLetter.body}</pre>
              <div className="buttonRow">
                <button
                  className="ghostButton"
                  onClick={() => exportDocument("pdf", "cover-letter")}
                >
                  <Download size={16} />
                  PDF
                </button>
                <button
                  className="ghostButton"
                  onClick={() => exportDocument("docx", "cover-letter")}
                >
                  <Download size={16} />
                  DOCX
                </button>
              </div>
            </div>
          ) : (
            <p className="emptyState">Generate a cover letter from the selected job.</p>
          )}
        </article>

        <article className="panel">
          <div className="panelHeader">
            <Search size={20} />
            <h2>Next Best Actions</h2>
          </div>
          <ul className="tipsList">
            {tips.map((tip) => (
              <li key={tip}>
                <CheckCircle2 size={16} />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="extensionBand">
        <div>
          <div className="panelHeader">
            <Chrome size={20} />
            <h2>Chrome Job Saver</h2>
          </div>
          <p>Extension source is packaged in <code>extension/</code>.</p>
        </div>
        <div className="extensionActions">
          <span className="pill neutral">
            <Rocket size={16} />
            Manifest V3
          </span>
          <span className="pill neutral">
            <BriefcaseBusiness size={16} />
            Right-click save
          </span>
        </div>
      </section>
    </main>
  );
}

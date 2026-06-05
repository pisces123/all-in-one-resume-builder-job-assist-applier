import { parseResumeText } from "@/lib/resume";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  let text = "";
  let filename = "resume";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("file");
    const pasted = formData.get("text");
    if (typeof pasted === "string") {
      text = pasted;
    }
    if (file instanceof File) {
      filename = file.name;
      if (!text) {
        text = await file.text();
      }
    }
  } else {
    const body = (await request.json().catch(() => ({}))) as {
      text?: string;
      filename?: string;
    };
    text = body.text || "";
    filename = body.filename || filename;
  }

  if (!text.trim()) {
    return Response.json(
      {
        error: "Resume text is required for this MVP import flow.",
        hint: "Paste text or upload a text-readable resume export."
      },
      { status: 400 }
    );
  }

  return Response.json({
    filename,
    profile: parseResumeText(text)
  });
}

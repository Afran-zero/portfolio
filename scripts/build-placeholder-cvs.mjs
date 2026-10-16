// Generates placeholder PDFs for `/cv/{academic,industry,master}` until real CVs land.
// Hand-built (no npm dep) — ~1 KB per file vs ~150 KB from pdfkit.

import { writeFile } from "node:fs/promises";
import path from "node:path";

const NAME = "Md Kaif Afran Khan";
const ROLE = "AI Engineer & Researcher";
const LOCATION = "Dhaka, Bangladesh";
const EMAIL = "kaif.khan@northsouth.edu";
const SITE = "kaif.dev";
const GITHUB = "github.com/Afran-zero";

function escape(text) {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

const variants = [
  {
    out: "public/media/cv/academic-cv.pdf",
    title: "Academic CV (Placeholder)",
    subtitle: "Research / Grad school audience",
    blurb:
      "Placeholder PDF — replace with the latest academic CV. " +
      "Expected sections: thesis, publications, ongoing research lines, " +
      "conferences, methods, academic projects, education, certifications.",
  },
  {
    out: "public/media/cv/industry-cv.pdf",
    title: "Industry CV (Placeholder)",
    subtitle: "Hiring managers / Clients audience",
    blurb:
      "Placeholder PDF — replace with the latest industry CV. " +
      "Expected sections: AI engineering at The Data Island, shipped " +
      "full-stack and data projects, certifications, languages, experience.",
  },
  {
    out: "public/media/cv/master-cv.pdf",
    title: "Master CV (Placeholder)",
    subtitle: "Single-document overview",
    blurb:
      "Placeholder PDF — replace with the latest master CV. " +
      "Expected sections: identity, education, experience, projects, " +
      "research, certifications, languages.",
  },
];

function buildPdfBytes({ title, subtitle, blurb }) {
  const lines = [
    { text: title, size: 22, y: 740 },
    { text: subtitle, size: 11, y: 715 },
    { text: "", size: 11, y: 690 },
    { text: NAME, size: 14, y: 660 },
    { text: `${ROLE} — ${LOCATION}`, size: 11, y: 640 },
    { text: "", size: 11, y: 610 },
    { text: `Email:    ${EMAIL}`, size: 11, y: 580 },
    { text: `Site:     https://${SITE}`, size: 11, y: 560 },
    { text: `GitHub:   https://${GITHUB}`, size: 11, y: 540 },
    { text: "", size: 11, y: 510 },
    { text: "Notes", size: 14, y: 480 },
    { text: blurb, size: 11, y: 450, wrap: true },
    { text: "", size: 11, y: 360 },
    { text: "— Replace this file before launch —", size: 12, y: 320 },
  ];

  const ops = ["BT", "/F1 12 Tf 50 800 Td"];
  for (const ln of lines) {
    const text = escape(ln.text ?? "");
    if (ln.wrap) {
      // Soft wrap to 80 chars per line, multiple Td-drops
      const wrapped = text.match(/.{1,80}/g) ?? [text];
      ops.push(`${ln.size} Tf`);
      for (let i = 0; i < wrapped.length; i++) {
        ops.push(`0 -${i * 16} Td`);
        ops.push(`(${wrapped[i]}) Tj`);
      }
    } else {
      ops.push(`${ln.size} Tf`);
      ops.push(`0 -${800 - ln.y} Td`);
      ops.push(`(${text}) Tj`);
    }
  }
  ops.push("ET");

  const contentStream = ops.join("\n");
  const objects = [
    `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj`,
    `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj`,
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj`,
    `4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj`,
    `5 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream\nendobj`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += `${obj}\n`;
  }
  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += `0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${offsets[i].toString().padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
  return Buffer.from(pdf, "latin1");
}

for (const v of variants) {
  const buf = buildPdfBytes(v);
  const out = path.resolve(v.out);
  await writeFile(out, buf);
  console.log(`wrote ${v.out} (${buf.length} bytes)`);
}
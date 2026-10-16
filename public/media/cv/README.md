# CV PDFs

These PDFs are served from `/cv/{academic,industry,professional,master}` via
static redirects defined in `next.config.ts -> redirects()`.

| File               | Route              | Audience                          |
| ------------------ | ------------------ | --------------------------------- |
| `academic-cv.pdf`  | `/cv/academic`     | Research / Grad school            |
| `industry-cv.pdf`  | `/cv/industry`     | Hiring managers / Clients         |
| `industry-cv.pdf`  | `/cv/professional` | Alias for `/cv/industry` (SOP-aligned) |
| `master-cv.pdf`    | `/cv/master`       | Single-document overview          |

**Status**: placeholders, per **D-017**. Replace any of these with the latest
version whenever the CV is updated. The placeholder PDFs were hand-written
during scaffolding and contain only the bare name + role lines — they are
clearly not the final CV.

Landing page: `app/cv/page.tsx` lists all four variants.
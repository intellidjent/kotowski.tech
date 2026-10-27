# kotowski.me

My CV site, served by GitHub Pages from `master`.

The CV lives in [`cv.yml`](cv.yml), and case studies are Markdown files in [`work/`](work/). Everything else a visitor sees is generated from them:

| File | What it is |
| --- | --- |
| `index.html` | The site, rendered from `templates/index.html` |
| `work/<slug>.html` | A case study, rendered from `work/<slug>.md` with `templates/work.html` |
| `img/social-preview.png` | The 1200×630 image shown when the link is shared, screenshotted from `templates/social.html` |
| `Ruslan_Kotowski_CV.pdf` | Chrome's print of `index.html`, laid out by the `@media print` rules in `css/modern-style.css` |
| `cv.md` | The CV as plain Markdown |
| `llms.txt` | An index for AI agents ([llmstxt.org](https://llmstxt.org/)) |
| `sitemap.xml` | For search engines |

## Update the CV

```bash
pip3 install -r requirements.txt   # once
# edit cv.yml
python3 build.py                   # rebuilds everything, including the PDF (needs Chrome)
git add -A && git commit
```

To add a case study, create `work/<slug>.md` with `title`, `summary`, `role`, `published` and `updated` in its front matter, then list it in `cv.yml` under `work:` as `- page: work/<slug>.md`. Images go in `img/work/`.

`python3 build.py --no-chrome` skips the PDF and the social image. CI runs `python3 build.py --check` and fails if the generated text files don't match `cv.yml`.

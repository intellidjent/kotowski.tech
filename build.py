#!/usr/bin/env python3
"""Build kotowski.me from cv.yml and the case studies in work/.

    python3 build.py              # pages, cv.md, llms.txt, sitemap.xml, PDF, social image
    python3 build.py --no-chrome  # skip the PDF and social image (both need Chrome)
    python3 build.py --check      # exit 1 if the committed text files are out of date

Each work/<slug>.md becomes work/<slug>.html once cv.yml lists it under work.
The PDF is Chrome's print of index.html, so the @media print rules in
css/modern-style.css are its only layout. The social preview is a Chrome
screenshot of templates/social.html. Set CHROME to a browser binary if it
isn't found automatically.
"""

import argparse
import html
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from datetime import date
from pathlib import Path
from string import Template

import markdown
import yaml

ROOT = Path(__file__).resolve().parent
SOURCE_URL = "https://github.com/intellidjent/kotowski.tech/blob/master/cv.yml"
SOCIAL_IMAGE = "img/social-preview.png"  # 1200×630, referenced by both page templates
LINK = re.compile(r"\[([^\]]+)\]\(([^)\s]+)\)")
MARK = re.compile(r"==(.+?)==")
CHROME_CANDIDATES = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "google-chrome",
    "google-chrome-stable",
    "chromium",
    "chromium-browser",
]

esc = html.escape


# --- Inline markup: [text](url) and ==highlight== ---------------------------

def inline_html(text):
    out = esc(text)
    out = MARK.sub(r'<span class="miro-highlight">\1</span>', out)
    return LINK.sub(r'<a href="\2" target="_blank" rel="noopener" class="link">\1</a>', out)


def inline_md(text):
    return MARK.sub(r"\1", text)


def plain(text):
    return LINK.sub(r"\1", inline_md(text))


def indent(lines, spaces):
    pad = " " * spaces
    return "\n".join(pad + line if line else "" for line in lines).rstrip()


# --- Shared facts -------------------------------------------------------------

def as_date(value):
    return date.fromisoformat(value) if isinstance(value, str) else value


def updated(doc):
    return as_date(doc["updated"])


def long_date(day):
    return f"{day.day} {day:%B %Y}"


def tel(phone):
    return "tel:" + re.sub(r"[^\d+]", "", phone)


def linkedin_handle(url):
    return url.rstrip("/").rsplit("/", 1)[-1]


def current_job(cv):
    job = cv["experience"][0]
    return job if job["roles"][0]["dates"].endswith("Present") else None


def load_page(source):
    """A work/<slug>.md case study: front matter, Markdown body, and output path."""
    text = (ROOT / source).read_text(encoding="utf-8")
    _, front, body = text.split("---\n", 2)
    page = yaml.safe_load(front)
    page.update(source=source, html=source[: -len(".md")] + ".html", body=body.strip() + "\n")
    return page


def work_items(cv):
    """Selected work in cv.yml order. Case studies take their card text from the page."""
    items = []
    for entry in cv.get("work") or []:
        if "page" in entry:
            page = load_page(entry["page"])
            items.append({"kind": "Case study", "title": page["title"], "url": page["html"],
                          "note": page["summary"], "page": page})
        else:
            items.append(entry)
    return items


# --- index.html ---------------------------------------------------------------

def nav_html(cv, root=""):
    links = [("about", "About"), ("experience", "Experience")]
    if cv.get("work"):
        links.append(("work", "Work"))
    links += [("skills", "Skills"), ("contact", "Contact")]
    return indent([f'<a href="{root}#{i}" class="nav-link">{label}</a>' for i, label in links], 16)


def experience_html(cv):
    out = []
    for job in cv["experience"]:
        out += [
            '<div class="timeline-item">',
            '    <div class="timeline-marker"></div>',
            '    <div class="timeline-content">',
        ]
        for i, role in enumerate(job["roles"]):
            out += [
                '        <div class="timeline-role">',
                '            <div class="timeline-header">',
                f'                <h3 class="timeline-title">{esc(role["title"])}</h3>',
            ]
            if i == 0:
                out.append(
                    f'                <a href="{esc(job["url"])}" target="_blank" rel="noopener" '
                    f'class="timeline-company">{esc(job["company"])}</a>'
                )
            out += [
                f'                <span class="timeline-date">{esc(role["dates"])}</span>',
                '            </div>',
                f'            <p class="timeline-description">{inline_html(role["summary"])}</p>',
            ]
            if role.get("highlights"):
                out.append('            <ul class="timeline-highlights">')
                out += [f'                <li>{inline_html(h)}</li>' for h in role["highlights"]]
                out.append('            </ul>')
            out.append('        </div>')
        out += ['    </div>', '</div>', '']
    return indent(out, 20)


def work_html(cv):
    items = work_items(cv)
    if not items:
        return ""
    cards = []
    for item in items:
        external = "" if "page" in item else ' target="_blank" rel="noopener"'
        cards += [
            f'<a href="{esc(item["url"])}" class="work-card"{external}>',
            f'    <span class="work-kind">{esc(item.get("kind", "Published docs"))}</span>',
            f'    <h3 class="work-title">{esc(item["title"])}</h3>',
        ]
        if item.get("note"):
            cards.append(f'    <p class="work-note">{inline_html(item["note"])}</p>')
        cards.append("</a>")
    lines = [
        "<!-- Work Section -->",
        '<section class="work" id="work">',
        '    <div class="container">',
        '        <h2 class="section-title">Selected work</h2>',
        '        <div class="work-grid">',
        *["            " + line for line in cards],
        "        </div>",
        "    </div>",
        "</section>",
    ]
    return "\n" + indent(lines, 8) + "\n"


def skills_html(cv):
    out = []
    for group in cv["skills"]:
        out += [
            '<div class="skill-category">',
            f'    <h3 class="skill-title">{esc(group["category"])}</h3>',
            '    <ul class="skill-list">',
            *[f'        <li>{esc(item)}</li>' for item in group["items"]],
            '    </ul>',
            '</div>',
        ]
    return indent(out, 20)


def contact_rows(cv):
    """(label, display text, href or None) for each contact detail."""
    c = cv["contact"]
    rows = [("Email", c["email"], "mailto:" + c["email"])]
    if c.get("phone"):
        rows.append(("Phone", c["phone"], tel(c["phone"])))
    rows.append(("Location", cv["location"], None))
    if c.get("linkedin"):
        rows.append(("LinkedIn", linkedin_handle(c["linkedin"]), c["linkedin"]))
    return rows


def contact_html(cv):
    out = []
    for label, text, href in contact_rows(cv):
        if href is None:
            value = f'<span class="contact-value">{esc(text)}</span>'
        elif href.startswith("http"):
            value = f'<a href="{esc(href)}" target="_blank" rel="noopener" class="contact-value">{esc(text)}</a>'
        else:
            value = f'<a href="{esc(href)}" class="contact-value">{esc(text)}</a>'
        out += [
            '<div class="contact-item">',
            f'    <span class="contact-label">{label}</span>',
            f'    {value}',
            '</div>',
        ]
    return indent(out, 24)


def contact_line_html(cv):
    """One line of contact details under the name. Only shown in print and the PDF."""
    parts = []
    for label, text, href in contact_rows(cv):
        if label == "LinkedIn":
            text = href.split("//", 1)[-1].replace("www.", "").rstrip("/")
        parts.append(f'<a href="{esc(href)}">{esc(text)}</a>' if href else esc(text))
    return " · ".join(parts)


def person_id(cv):
    """One stable id, so search engines know the home page and the articles share an author."""
    return f'{cv["url"]}/#person'


def person(cv):
    city, _, country = cv["location"].partition(", ")
    data = {
        "@type": "Person",
        "@id": person_id(cv),
        "name": cv["name"],
        # The official title of the current role, not the positioning title.
        "jobTitle": cv["experience"][0]["roles"][0]["title"],
        "description": plain(cv["description"]),
        "url": cv["url"] + "/",
        "image": f'{cv["url"]}/{cv["photo"]}',
        "email": cv["contact"]["email"],
        "address": {"@type": "PostalAddress", "addressLocality": city, "addressCountry": country},
        "sameAs": [cv["contact"]["linkedin"]] if cv["contact"].get("linkedin") else [],
        "knowsAbout": [item for group in cv["skills"] for item in group["items"]],
    }
    if cv["contact"].get("phone"):
        data["telephone"] = tel(cv["contact"]["phone"])[len("tel:"):]
    job = current_job(cv)
    if job:
        data["worksFor"] = {"@type": "Organization", "name": job["company"], "url": job["url"]}
    return data


def json_ld(data):
    text = json.dumps(data, indent=4, ensure_ascii=False).replace("</", "<\\/")
    return indent(text.splitlines(), 4)


def profile_jsonld(cv):
    return json_ld({
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "url": cv["url"] + "/",
        "dateModified": updated(cv).isoformat(),
        "mainEntity": person(cv),
    })


def article_jsonld(cv, page):
    url = f'{cv["url"]}/{page["html"]}'
    return json_ld({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": page["title"],
        "description": plain(page["summary"]),
        "url": url,
        "mainEntityOfPage": url,
        "image": f'{cv["url"]}/{SOCIAL_IMAGE}',
        "datePublished": as_date(page["published"]).isoformat(),
        "dateModified": updated(page).isoformat(),
        "author": {"@type": "Person", "@id": person_id(cv), "name": cv["name"], "url": cv["url"] + "/"},
    })


def footer_html(cv, root=""):
    return (
        f'Built from <a href="{SOURCE_URL}">one YAML file</a> with Python and GitHub Actions'
        f' · Also as <a href="{root}cv.md">Markdown</a> and <a href="{root}llms.txt">llms.txt</a>'
        f' · Updated {updated(cv):%B %Y}'
    )


def render_html(cv):
    template = Template((ROOT / "templates" / "index.html").read_text(encoding="utf-8"))
    return template.substitute(
        # Under ~60 characters, or search results cut it off.
        page_title=esc(f'{cv["name"]} — {cv["title"]}'),
        description=esc(plain(cv["description"])),
        url=cv["url"],
        name=esc(cv["name"]),
        title=esc(cv["title"]),
        jsonld=profile_jsonld(cv),
        nav=nav_html(cv),
        contact_line=contact_line_html(cv),
        summary=inline_html(cv["summary"]),
        pdf=esc(cv["pdf"]),
        photo=esc(cv["photo"]),
        experience=experience_html(cv),
        work=work_html(cv),
        skills=skills_html(cv),
        contact=contact_html(cv),
        footer=footer_html(cv),
    )


# --- work/<slug>.html -----------------------------------------------------------

def dates_html(page):
    published, changed = as_date(page["published"]), updated(page)
    out = f'Published <time datetime="{published.isoformat()}">{long_date(published)}</time>'
    if changed != published:
        out += f' · Updated <time datetime="{changed.isoformat()}">{long_date(changed)}</time>'
    return out


def render_work_page(cv, page):
    template = Template((ROOT / "templates" / "work.html").read_text(encoding="utf-8"))
    return template.substitute(
        jsonld=article_jsonld(cv, page),
        dates=dates_html(page),
        page_title=esc(f'{page["title"]} — {cv["name"]}'),
        title=esc(page["title"]),
        description=esc(plain(page["summary"])),
        url=f'{cv["url"]}/{page["html"]}',
        site=cv["url"],
        markdown=esc(Path(page["source"]).name),
        source=page["source"],
        name=esc(cv["name"]),
        nav=nav_html(cv, root="../"),
        role=esc(page.get("role", "")),
        summary=inline_html(page["summary"]),
        body=markdown.markdown(page["body"], extensions=["extra", "sane_lists"]),
        footer=footer_html(cv, root="../"),
    )


# --- cv.md, llms.txt, sitemap.xml ---------------------------------------------

def render_md(cv):
    contact = []
    for label, text, href in contact_rows(cv):
        if label == "Location":
            continue
        contact.append(f"[{text if label != 'LinkedIn' else 'LinkedIn'}]({href})" if href else text)
    out = [
        f'# {cv["name"]}',
        "",
        f'**{cv["title"]}** · {cv["location"]}  ',
        " · ".join(contact),
        "",
        inline_md(cv["summary"]),
        "",
        "## Experience",
    ]
    for job in cv["experience"]:
        for role in job["roles"]:
            out += [
                "",
                f'### {role["title"]} · [{job["company"]}]({job["url"]})',
                "",
                f'_{role["dates"]}_',
                "",
                inline_md(role["summary"]),
            ]
            if role.get("highlights"):
                out.append("")
                out += [f"- {inline_md(h)}" for h in role["highlights"]]
    items = work_items(cv)
    if items:
        out += ["", "## Selected work", ""]
        for item in items:
            url = f'{cv["url"]}/{item["url"]}' if "page" in item else item["url"]
            note = f' — {inline_md(item["note"])}' if item.get("note") else ""
            out.append(f'- [{item["title"]}]({url}){note}')
    out += ["", "## Skills", ""]
    out += [f'- **{g["category"]}:** {" · ".join(g["items"])}' for g in cv["skills"]]
    out += [
        "",
        "---",
        "",
        f'Updated {updated(cv):%B %Y} · Web: <{cv["url"]}> · PDF: <{cv["url"]}/{cv["pdf"]}>',
        "",
    ]
    return "\n".join(out)


def render_llms(cv):
    c = cv["contact"]
    out = [
        f'# {cv["name"]}',
        "",
        f'> {plain(cv["description"])}',
        "",
        plain(cv["summary"]),
        "",
        "## CV",
        "",
        f'- [CV in Markdown]({cv["url"]}/cv.md): Experience, skills, and contact details.',
        f'- [CV as PDF]({cv["url"]}/{cv["pdf"]}): The same CV, formatted for print.',
        "",
    ]
    items = work_items(cv)
    if items:
        out += ["## Work", ""]
        for item in items:
            # Point agents at the Markdown source of a case study, not its HTML.
            url = f'{cv["url"]}/{item["page"]["source"]}' if "page" in item else item["url"]
            note = plain(item.get("note", ""))
            out.append(f'- [{item["title"]}]({url})' + (f": {note}" if note else ""))
        out.append("")
    out += [
        "## Contact",
        "",
        f'- [Email](mailto:{c["email"]})',
    ]
    if c.get("linkedin"):
        out.append(f'- [LinkedIn]({c["linkedin"]})')
    out.append("")
    return "\n".join(out)


def render_sitemap(cv):
    urls = [(f'{cv["url"]}/', updated(cv))]
    for item in work_items(cv):
        if "page" in item:
            urls.append((f'{cv["url"]}/{item["url"]}', updated(item["page"])))
    entries = "".join(
        f"    <url>\n        <loc>{loc}</loc>\n        <lastmod>{day.isoformat()}</lastmod>\n    </url>\n"
        for loc, day in urls
    )
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f"{entries}"
        "</urlset>\n"
    )


# --- PDF and social image (Chrome) --------------------------------------------

def find_chrome():
    if os.environ.get("CHROME"):
        return os.environ["CHROME"]
    for candidate in CHROME_CANDIDATES:
        path = candidate if os.path.isabs(candidate) else shutil.which(candidate)
        if path and os.path.exists(path):
            return path
    return None


def run_chrome(page, out, *flags):
    """Load page (HTML with paths relative to the repo root) in headless Chrome to write out."""
    chrome = find_chrome()
    if not chrome:
        sys.exit("Chrome not found. Set CHROME to a browser binary, or run with --no-chrome.")
    page = page.replace("<head>", f'<head>\n    <base href="{ROOT.as_uri()}/">', 1)
    if out.exists():
        out.unlink()
    with tempfile.TemporaryDirectory() as tmp:
        source = Path(tmp) / "page.html"
        source.write_text(page, encoding="utf-8")
        result = subprocess.run(
            [
                chrome,
                "--headless",
                "--disable-gpu",
                "--hide-scrollbars",
                f"--user-data-dir={tmp}/profile",
                "--virtual-time-budget=10000",  # let the web fonts load
                *flags,
                source.as_uri(),
            ],
            capture_output=True,
            text=True,
            timeout=120,
        )
    if result.returncode != 0 or not out.exists():
        sys.exit(f"Chrome failed to write {out.name}:\n{result.stderr}")


def build_pdf(cv, page, out):
    # Print a script-free copy: the print layout needs no JS, and with the JS
    # running, the highlighted "Miro" lands out of reading order in the PDF text.
    page = re.sub(r'\s*<script src="[^"]*"></script>', "", page)
    # Case-study links must point at the live site, not at files on this machine.
    page = page.replace('href="work/', f'href="{cv["url"]}/work/')
    run_chrome(page, out, "--no-pdf-header-footer", f"--print-to-pdf={out}")


def build_social_image(cv, out):
    template = Template((ROOT / "templates" / "social.html").read_text(encoding="utf-8"))
    # Keep hyphenated words like "docs-as-code" on one line.
    headline = re.sub(r"(\S+-\S+)", r'<span style="white-space: nowrap">\1</span>', esc(cv["headline"]))
    page = template.substitute(
        name=esc(cv["name"]),
        title=esc(cv["title"]),
        headline=headline,
        photo=esc(cv["photo"]),
        domain=esc(cv["url"].split("//", 1)[-1]),
    )
    run_chrome(page, out, "--window-size=1200,630", f"--screenshot={out}")


# --- Main ---------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Build kotowski.me from cv.yml.")
    parser.add_argument("--check", action="store_true", help="fail if generated files are out of date")
    parser.add_argument("--no-chrome", action="store_true", help="skip the PDF and social image")
    args = parser.parse_args()

    cv = yaml.safe_load((ROOT / "cv.yml").read_text(encoding="utf-8"))
    outputs = {
        "index.html": render_html(cv),
        "cv.md": render_md(cv),
        "llms.txt": render_llms(cv),
        "sitemap.xml": render_sitemap(cv),
    }
    for item in work_items(cv):
        if "page" in item:
            outputs[item["url"]] = render_work_page(cv, item["page"])

    if args.check:
        stale = [
            name for name, text in outputs.items()
            if not (ROOT / name).exists() or (ROOT / name).read_text(encoding="utf-8") != text
        ]
        if stale:
            print(f"Out of date: {', '.join(stale)}. Run python3 build.py and commit the result.")
            return 1
        print("Generated files match cv.yml.")
        return 0

    for name, text in outputs.items():
        (ROOT / name).write_text(text, encoding="utf-8")
        print(f"wrote {name}")
    if not args.no_chrome:
        build_pdf(cv, outputs["index.html"], ROOT / cv["pdf"])
        print(f"wrote {cv['pdf']}")
        build_social_image(cv, ROOT / SOCIAL_IMAGE)
        print(f"wrote {SOCIAL_IMAGE}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

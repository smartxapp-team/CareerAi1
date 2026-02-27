"""
resume_upload.py
----------------
Handles resume file upload, text extraction, skill detection,
and job matching for CareerAI.

Supported formats: PDF, DOCX, TXT
"""

import io
from jobscraper import get_jobs

# ──────────────────────────────────────────────
# Skill keyword list
# ──────────────────────────────────────────────
SKILLS_LIST = [
    "Python", "Java", "SQL", "React", "SpringBoot",
    "Machine Learning", "AWS", "HTML", "CSS", "JavaScript",
    "C++", "Django", "Flask", "NodeJS", "Power BI",
    "Excel", "TensorFlow", "Docker", "Kubernetes", "Git",
    "MongoDB", "PostgreSQL", "MySQL", "TypeScript", "Angular",
    "Vue", "Kotlin", "Swift", "Go", "Rust",
    "PyTorch", "Pandas", "NumPy", "Scikit-learn", "Hadoop",
    "Spark", "Tableau", "Linux", "Bash", "REST API",
    "GraphQL", "Redis", "Elasticsearch", "Figma", "Flutter",
]


# ──────────────────────────────────────────────
# 1. TEXT EXTRACTION
# ──────────────────────────────────────────────
def extract_text(file) -> str:
    """
    Extract raw text from an uploaded file object.
    Supports PDF, DOCX, and TXT formats.

    Args:
        file: werkzeug.FileStorage object from Flask request.

    Returns:
        Extracted text as a string.
    """
    filename = file.filename.lower()

    # ── PDF ──
    if filename.endswith(".pdf"):
        return _extract_from_pdf(file)

    # ── DOCX ──
    elif filename.endswith(".docx"):
        return _extract_from_docx(file)

    # ── TXT ──
    elif filename.endswith(".txt"):
        return _extract_from_txt(file)

    else:
        raise ValueError(f"Unsupported file type: '{file.filename}'. Please upload PDF, DOCX, or TXT.")


def _extract_from_pdf(file) -> str:
    """Extract text from a PDF file using PyPDF2."""
    try:
        import PyPDF2
        reader = PyPDF2.PdfReader(io.BytesIO(file.read()))
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text.strip()
    except ImportError:
        raise ImportError("PyPDF2 is not installed. Run: pip install PyPDF2")
    except Exception as e:
        raise RuntimeError(f"Failed to read PDF: {e}")


def _extract_from_docx(file) -> str:
    """Extract text from a DOCX file using python-docx."""
    try:
        from docx import Document
        doc = Document(io.BytesIO(file.read()))
        paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
        return "\n".join(paragraphs)
    except ImportError:
        raise ImportError("python-docx is not installed. Run: pip install python-docx")
    except Exception as e:
        raise RuntimeError(f"Failed to read DOCX: {e}")


def _extract_from_txt(file) -> str:
    """Extract text from a plain TXT file."""
    try:
        raw = file.read()
        # Try UTF-8 first, fall back to latin-1
        try:
            return raw.decode("utf-8").strip()
        except UnicodeDecodeError:
            return raw.decode("latin-1").strip()
    except Exception as e:
        raise RuntimeError(f"Failed to read TXT: {e}")


# ──────────────────────────────────────────────
# 2. SKILL EXTRACTION
# ──────────────────────────────────────────────
def extract_skills(text: str) -> list:
    """
    Detect known tech skills mentioned in the resume text.

    Args:
        text: Raw text extracted from the resume.

    Returns:
        List of matched skill strings (deduplicated, ordered).
    """
    text_lower = text.lower()
    found = []

    for skill in SKILLS_LIST:
        # Match whole-word-ish (handles e.g. "C++" and "NodeJS")
        if skill.lower() in text_lower:
            found.append(skill)

    # Deduplicate while preserving order
    return list(dict.fromkeys(found))


# ──────────────────────────────────────────────
# 3. JOB MATCHING
# ──────────────────────────────────────────────
def match_jobs(skills: list) -> list:
    """
    Match user skills against the jobs database and return
    relevant job listings sorted by number of skill matches.

    Args:
        skills: List of skills extracted from the user's resume.

    Returns:
        List of matching job dicts with title, company, location,
        matched_skills, and match_score.
    """
    all_jobs = get_jobs()
    skills_lower = {s.lower() for s in skills}

    scored = []
    for job in all_jobs:
        job_skills = [s.lower() for s in job.get("skills", [])]
        matched = [s for s in job_skills if s in skills_lower]
        if matched:
            scored.append({
                "title":          job.get("title", "Unknown"),
                "company":        job.get("company", "Unknown"),
                "location":       job.get("location", "Unknown"),
                "matched_skills": [s.capitalize() for s in matched],
                "match_score":    len(matched),
                "salary":         job.get("salary", "Competitive"),
                "link":           job.get("link", ""),
            })

    # Sort by most matches first
    scored.sort(key=lambda x: x["match_score"], reverse=True)

    # Return top 10
    return scored[:10]

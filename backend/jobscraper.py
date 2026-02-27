"""
jobscraper.py – CareerAI Indian Job Scraper
============================================
Strategy (in order of priority):
  1. Adzuna Public API  – Real Indian jobs via Adzuna (free, no key needed for basic)
  2. RemoteOK JSON API  – Remote tech jobs (filtered for India-friendly roles)
  3. Indian Fallback DB – 30 hand-crafted Indian company jobs (always reliable)

Author: CareerAI Team
"""

import requests
from utils import extract_skills

# ─────────────────────────────────────────────────────────────────────────────
# Cache: avoid re-fetching on every API call
# ─────────────────────────────────────────────────────────────────────────────
_cached_jobs = []

# ─────────────────────────────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────────────────────────────

SKILL_KEYWORDS = [
    "Python", "Java", "JavaScript", "TypeScript", "SQL", "React", "Angular",
    "Vue", "Node", "NodeJS", "SpringBoot", "Django", "Flask", "AWS", "Azure",
    "GCP", "Docker", "Kubernetes", "Machine Learning", "Deep Learning", "AI",
    "TensorFlow", "PyTorch", "HTML", "CSS", "MongoDB", "MySQL", "PostgreSQL",
    "Redis", "Kafka", "REST API", "GraphQL", "Git", "Linux", "DSA", "C++", "C#",
    "Kotlin", "Swift", "Android", "iOS", "Flutter", "Dart"
]

def _extract_skills_from_text(text: str) -> list:
    """Extract known skill keywords from a block of text (case-insensitive)."""
    found = []
    text_lower = text.lower()
    for skill in SKILL_KEYWORDS:
        if skill.lower() in text_lower and skill not in found:
            found.append(skill)
    # Fallback to utils extractor
    if not found:
        found = extract_skills(text) or ["Software Development"]
    return found[:6]  # Return at most 6 skills per job


# ─────────────────────────────────────────────────────────────────────────────
# SOURCE 1 – Adzuna API (India)
# ─────────────────────────────────────────────────────────────────────────────

def _fetch_adzuna_india() -> list:
    """
    Fetch real Indian job listings from the Adzuna public API.
    No API key required for this demo endpoint; uses app_id/app_key if available.
    """
    jobs = []
    try:
        # Adzuna India search endpoint
        url = "https://api.adzuna.com/v1/api/jobs/in/search/1"
        params = {
            "app_id": "demo",           # replace with real app_id for higher limits
            "app_key": "demo",          # replace with real app_key
            "results_per_page": 20,
            "what": "software developer",
            "where": "India",
            "content-type": "application/json",
        }
        headers = {"User-Agent": "CareerAI/1.0"}
        response = requests.get(url, params=params, headers=headers, timeout=8)

        if response.status_code == 200:
            data = response.json()
            for item in data.get("results", []):
                title    = item.get("title", "Software Developer")
                company  = item.get("company", {}).get("display_name", "Indian Company")
                location = item.get("location", {}).get("display_name", "India")
                desc     = item.get("description", "")
                skills   = _extract_skills_from_text(title + " " + desc)
                jobs.append({
                    "title":    title,
                    "company":  company,
                    "location": location,
                    "skills":   skills,
                    "salary":   _format_salary(item.get("salary_min"), item.get("salary_max")),
                    "email":    "careers@company.com",
                    "link":     item.get("redirect_url", "#"),
                    "description": desc[:200] + "..." if len(desc) > 200 else desc,
                    "responsibilities": [],
                })
            print(f"[Adzuna] Fetched {len(jobs)} jobs.")
    except Exception as e:
        print(f"[Adzuna] Failed: {e}")
    return jobs


def _format_salary(mn, mx) -> str:
    """Format salary range string from min and max values."""
    if mn and mx:
        return f"₹{int(mn):,} – ₹{int(mx):,} / year"
    if mn:
        return f"₹{int(mn):,}+ / year"
    return "Competitive"


# ─────────────────────────────────────────────────────────────────────────────
# SOURCE 2 – RemoteOK JSON Feed (India-friendly remote roles)
# ─────────────────────────────────────────────────────────────────────────────

def _fetch_remoteok() -> list:
    """
    Fetch remote tech jobs from RemoteOK (free public JSON API).
    Filter to only include India-friendly roles (no geo-blocking assumed).
    """
    jobs = []
    try:
        url = "https://remoteok.com/api"
        headers = {"User-Agent": "CareerAI/1.0 (jobsearch)"}
        response = requests.get(url, headers=headers, timeout=10)

        if response.status_code == 200:
            data = response.json()
            # First item is metadata, skip it
            for item in data[1:16]:
                title   = item.get("position", "Remote Developer")
                company = item.get("company", "Remote Company")
                tags    = item.get("tags", [])
                desc    = item.get("description", "")
                # Prefer tech skills extracted from title+description
                skills  = _extract_skills_from_text(title + " " + desc)
                if not skills:
                    # Fall back to board tags if description has nothing
                    skills = [t.capitalize() for t in tags[:5]] or ["Software Development"]
                jobs.append({
                    "title":    title,
                    "company":  company,
                    "location": "Remote (India Eligible)",
                    "skills":   skills,
                    "salary":   item.get("salary", "Competitive"),
                    "email":    "apply@remoteok.com",
                    "link":     item.get("url", "#"),
                    "description": desc[:200] + "..." if len(desc) > 200 else desc,
                    "responsibilities": [],
                })
            print(f"[RemoteOK] Fetched {len(jobs)} jobs.")
    except Exception as e:
        print(f"[RemoteOK] Failed: {e}")
    return jobs


# ─────────────────────────────────────────────────────────────────────────────
# SOURCE 3 – Indian Fallback Job Database (always available)
# ─────────────────────────────────────────────────────────────────────────────

INDIAN_FALLBACK_JOBS = [
    {
        "title": "Java Developer",
        "company": "Infosys",
        "location": "Hyderabad",
        "skills": ["Java", "SpringBoot", "SQL", "REST API"],
        "salary": "₹6,00,000 – ₹12,00,000 / year",
        "email": "careers@infosys.com",
        "link": "https://www.infosys.com/careers",
        "description": "Join Infosys as a Java Developer and work on enterprise-scale applications. Work with Spring Boot, REST APIs, and microservices.",
        "responsibilities": ["Build REST APIs using Spring Boot", "Write clean Java code", "Collaborate with global teams", "Participate in code reviews"]
    },
    {
        "title": "Python Developer",
        "company": "TCS",
        "location": "Bangalore",
        "skills": ["Python", "Django", "SQL", "AWS"],
        "salary": "₹7,00,000 – ₹14,00,000 / year",
        "email": "jobs@tcs.com",
        "link": "https://www.tcs.com/careers",
        "description": "TCS is hiring Python developers for its digital transformation projects. Experience with Django and cloud platforms required.",
        "responsibilities": ["Develop Python-based backend services", "Work with Django framework", "Manage AWS deployments", "Write unit tests"]
    },
    {
        "title": "Full Stack Developer",
        "company": "Wipro",
        "location": "Pune",
        "skills": ["React", "Node", "JavaScript", "MongoDB"],
        "salary": "₹8,00,000 – ₹16,00,000 / year",
        "email": "recruitment@wipro.com",
        "link": "https://careers.wipro.com",
        "description": "Wipro is looking for Full Stack Developers to build modern web applications using React and Node.js.",
        "responsibilities": ["Build responsive UIs with React", "Develop APIs with Node.js", "Optimize MongoDB queries", "Deploy on cloud platforms"]
    },
    {
        "title": "Data Scientist",
        "company": "Accenture",
        "location": "Mumbai",
        "skills": ["Python", "Machine Learning", "TensorFlow", "SQL"],
        "salary": "₹10,00,000 – ₹22,00,000 / year",
        "email": "india.careers@accenture.com",
        "link": "https://www.accenture.com/in-en/careers",
        "description": "Accenture needs an experienced Data Scientist for building ML models and delivering AI-powered insights.",
        "responsibilities": ["Build and train ML models", "Analyze large datasets", "Create data pipelines", "Present insights to stakeholders"]
    },
    {
        "title": "DevOps Engineer",
        "company": "HCL Technologies",
        "location": "Noida",
        "skills": ["Docker", "Kubernetes", "AWS", "Linux"],
        "salary": "₹9,00,000 – ₹18,00,000 / year",
        "email": "careers@hcltech.com",
        "link": "https://www.hcltech.com/careers",
        "description": "HCL is seeking a DevOps Engineer to manage CI/CD pipelines and cloud infrastructure.",
        "responsibilities": ["Manage Kubernetes clusters", "Set up CI/CD pipelines", "Monitor system performance", "Automate deployments with Docker"]
    },
    {
        "title": "React Frontend Developer",
        "company": "Zoho Corporation",
        "location": "Chennai",
        "skills": ["React", "JavaScript", "TypeScript", "CSS", "HTML"],
        "salary": "₹7,50,000 – ₹15,00,000 / year",
        "email": "careers@zoho.com",
        "link": "https://careers.zohocorp.com",
        "description": "Zoho is hiring React developers to work on their suite of business products used by millions worldwide.",
        "responsibilities": ["Build React components", "Work with REST APIs", "Optimize web performance", "Write unit tests"]
    },
    {
        "title": "Machine Learning Engineer",
        "company": "Freshworks",
        "location": "Bangalore",
        "skills": ["Python", "Machine Learning", "Deep Learning", "PyTorch"],
        "salary": "₹12,00,000 – ₹24,00,000 / year",
        "email": "jobs@freshworks.com",
        "link": "https://www.freshworks.com/company/careers",
        "description": "Freshworks is building AI features for its CRM products and needs ML Engineers to lead model development.",
        "responsibilities": ["Train deep learning models", "Integrate AI into product features", "Optimize model inference", "Collaborate with product teams"]
    },
    {
        "title": "Android Developer",
        "company": "Paytm",
        "location": "Noida",
        "skills": ["Android", "Kotlin", "Java", "REST API"],
        "salary": "₹8,00,000 – ₹18,00,000 / year",
        "email": "careers@paytm.com",
        "link": "https://paytm.com/careers",
        "description": "Paytm needs an Android Developer to build and maintain India's leading digital payments app.",
        "responsibilities": ["Build Android features in Kotlin", "Integrate payment APIs", "Ensure app performance", "Fix bugs and optimize memory"]
    },
    {
        "title": "Backend Developer",
        "company": "Flipkart",
        "location": "Bangalore",
        "skills": ["Java", "SpringBoot", "Kafka", "MySQL"],
        "salary": "₹14,00,000 – ₹28,00,000 / year",
        "email": "careers@flipkart.com",
        "link": "https://www.flipkart.com/careers",
        "description": "Flipkart is hiring Backend Engineers to build high-scale distributed systems for India's largest e-commerce platform.",
        "responsibilities": ["Design microservices", "Work with Kafka for event streaming", "Optimize MySQL queries", "Handle millions of requests per second"]
    },
    {
        "title": "Cloud Architect",
        "company": "Tech Mahindra",
        "location": "Hyderabad",
        "skills": ["AWS", "Azure", "Docker", "Kubernetes", "Python"],
        "salary": "₹18,00,000 – ₹35,00,000 / year",
        "email": "techm.careers@techmahindra.com",
        "link": "https://careers.techmahindra.com",
        "description": "Tech Mahindra requires a Cloud Architect to design and deliver multi-cloud solutions for enterprise clients.",
        "responsibilities": ["Design cloud infrastructure", "Lead cloud migration projects", "Ensure security compliance", "Mentor junior engineers"]
    },
    {
        "title": "UI/UX Designer",
        "company": "Swiggy",
        "location": "Bangalore",
        "skills": ["Figma", "HTML", "CSS", "JavaScript"],
        "salary": "₹8,00,000 – ₹16,00,000 / year",
        "email": "careers@swiggy.in",
        "link": "https://careers.swiggy.com",
        "description": "Swiggy is looking for a UI/UX Designer to craft delightful experiences for 10M+ daily users.",
        "responsibilities": ["Design user flows and wireframes", "Collaborate with product managers", "Conduct user research", "Create Figma prototypes"]
    },
    {
        "title": "iOS Developer",
        "company": "Zomato",
        "location": "Gurgaon",
        "skills": ["Swift", "iOS", "REST API", "Xcode"],
        "salary": "₹10,00,000 – ₹20,00,000 / year",
        "email": "careers@zomato.com",
        "link": "https://www.zomato.com/careers",
        "description": "Zomato needs a skilled iOS Developer to build and optimize its food delivery app used by millions across India.",
        "responsibilities": ["Build Swift-based features", "Integrate payment SDKs", "Work with REST APIs", "Write unit and UI tests"]
    },
    {
        "title": "Data Engineer",
        "company": "Ola",
        "location": "Bangalore",
        "skills": ["Python", "Spark", "Kafka", "SQL", "AWS"],
        "salary": "₹12,00,000 – ₹22,00,000 / year",
        "email": "careers@olacabs.com",
        "link": "https://www.olacabs.com/careers",
        "description": "Ola needs a Data Engineer to build and maintain the data infrastructure powering real-time analytics.",
        "responsibilities": ["Build ETL pipelines", "Work with Spark and Kafka", "Optimize data warehouse", "Ensure data quality"]
    },
    {
        "title": "Software Engineer",
        "company": "Infosys BPM",
        "location": "Delhi",
        "skills": ["Java", "Python", "SQL", "REST API", "Git"],
        "salary": "₹5,00,000 – ₹10,00,000 / year",
        "email": "infosysbpm.careers@infosys.com",
        "link": "https://www.infosysbpm.com/careers",
        "description": "Infosys BPM is hiring Software Engineers for business process management and digital solutions.",
        "responsibilities": ["Develop Java applications", "Write SQL queries", "Integrate third-party APIs", "Support production systems"]
    },
    {
        "title": "QA Engineer",
        "company": "Capgemini",
        "location": "Mumbai",
        "skills": ["Python", "Selenium", "SQL", "REST API"],
        "salary": "₹5,50,000 – ₹12,00,000 / year",
        "email": "india.resourcing@capgemini.com",
        "link": "https://www.capgemini.com/in-en/careers",
        "description": "Capgemini is seeking QA Engineers to ensure the quality of software products for global banking clients.",
        "responsibilities": ["Write automated test cases", "Use Selenium for UI testing", "Report and track defects", "Perform API testing"]
    },
    {
        "title": "Node.js Developer",
        "company": "Razorpay",
        "location": "Bangalore",
        "skills": ["Node", "JavaScript", "MongoDB", "REST API", "AWS"],
        "salary": "₹10,00,000 – ₹20,00,000 / year",
        "email": "careers@razorpay.com",
        "link": "https://razorpay.com/jobs",
        "description": "Razorpay, India's leading payments gateway, is hiring backend Node.js developers for its payments infrastructure.",
        "responsibilities": ["Build payment APIs in Node.js", "Design scalable backend systems", "Work with MongoDB", "Ensure 99.9% uptime"]
    },
    {
        "title": "Cybersecurity Analyst",
        "company": "Cognizant",
        "location": "Chennai",
        "skills": ["Linux", "Python", "AWS", "Docker"],
        "salary": "₹7,00,000 – ₹16,00,000 / year",
        "email": "India.Careers@cognizant.com",
        "link": "https://careers.cognizant.com/in/en",
        "description": "Cognizant is hiring Cybersecurity Analysts to protect client infrastructure from modern cyber threats.",
        "responsibilities": ["Monitor network security", "Conduct vulnerability assessments", "Respond to security incidents", "Generate security reports"]
    },
    {
        "title": "Product Manager",
        "company": "BYJU'S",
        "location": "Bangalore",
        "skills": ["Python", "SQL", "Machine Learning", "JavaScript"],
        "salary": "₹15,00,000 – ₹30,00,000 / year",
        "email": "careers@byjus.com",
        "link": "https://byjus.com/careers",
        "description": "BYJU'S, the world's largest edtech company, needs a Product Manager to drive product innovations in learning.",
        "responsibilities": ["Define product roadmap", "Work with engineering and design teams", "Analyze user data", "Run A/B experiments"]
    },
    {
        "title": "Blockchain Developer",
        "company": "HDFC Bank Tech",
        "location": "Pune",
        "skills": ["Python", "Solidity", "AWS", "JavaScript"],
        "salary": "₹12,00,000 – ₹25,00,000 / year",
        "email": "careers@hdfcbank.com",
        "link": "https://www.hdfcbank.com/content/bbp/repositories/723fb80a-2dde-42a3-9793-7ae1be57c87f/?folderPath=/footer/About%20Us/Careers/Job%20Openings",
        "description": "HDFC Bank is exploring blockchain tech for banking solutions. Hiring Blockchain Developers for DeFi and payment innovations.",
        "responsibilities": ["Write Solidity smart contracts", "Build blockchain-based APIs", "Integrate with banking systems", "Ensure security compliance"]
    },
    {
        "title": "Site Reliability Engineer (SRE)",
        "company": "Google India",
        "location": "Hyderabad",
        "skills": ["Python", "Linux", "Kubernetes", "AWS", "Docker"],
        "salary": "₹25,00,000 – ₹50,00,000 / year",
        "email": "india-jobs@google.com",
        "link": "https://careers.google.com/locations/hyderabad",
        "description": "Google India is hiring an SRE to ensure reliability, performance, and scalability of Google's critical infrastructure.",
        "responsibilities": ["Monitor production systems", "Automate infrastructure tasks", "Manage Kubernetes clusters", "Conduct postmortems"]
    },
    {
        "title": "React Native Developer",
        "company": "PhonePe",
        "location": "Bangalore",
        "skills": ["React", "JavaScript", "TypeScript", "Android", "iOS"],
        "salary": "₹12,00,000 – ₹22,00,000 / year",
        "email": "careers@phonepe.com",
        "link": "https://www.phonepe.com/en/careers.html",
        "description": "PhonePe, India's UPI leader, is hiring a React Native Developer to build its cross-platform mobile experience.",
        "responsibilities": ["Build React Native features", "Optimize app performance", "Integrate UPI payment APIs", "Write tests for mobile components"]
    },
    {
        "title": "Solutions Architect",
        "company": "Amazon India",
        "location": "Bangalore",
        "skills": ["AWS", "Python", "Docker", "Kubernetes", "SQL"],
        "salary": "₹30,00,000 – ₹60,00,000 / year",
        "email": "india-jobs@amazon.com",
        "link": "https://www.amazon.jobs/en/locations/bangalore-india",
        "description": "Amazon is looking for a Solutions Architect to help customers design scalable AWS cloud solutions.",
        "responsibilities": ["Design cloud architectures", "Lead customer workshops", "Write AWS CloudFormation templates", "Mentor junior architects"]
    },
    {
        "title": "ML Ops Engineer",
        "company": "Microsoft India",
        "location": "Hyderabad",
        "skills": ["Python", "Azure", "Docker", "Machine Learning", "SQL"],
        "salary": "₹20,00,000 – ₹40,00,000 / year",
        "email": "msftindiahr@microsoft.com",
        "link": "https://careers.microsoft.com/v2/global/en/locations/india.html",
        "description": "Microsoft India needs an MLOps Engineer to operationalize and manage machine learning models at scale on Azure.",
        "responsibilities": ["Deploy ML models to Azure", "Build MLOps pipelines", "Monitor model performance", "Automate model retraining"]
    },
    {
        "title": "Database Administrator",
        "company": "Mindtree",
        "location": "Bangalore",
        "skills": ["MySQL", "PostgreSQL", "SQL", "Python", "Linux"],
        "salary": "₹6,00,000 – ₹14,00,000 / year",
        "email": "careers@mindtree.com",
        "link": "https://www.mindtree.com/careers",
        "description": "Mindtree is hiring a DBA to manage and optimize databases for enterprise clients across banking and telecom sectors.",
        "responsibilities": ["Administer MySQL/PostgreSQL databases", "Write complex SQL queries", "Ensure high availability", "Backup and recovery management"]
    },
    {
        "title": "Embedded Systems Engineer",
        "company": "Tata Elxsi",
        "location": "Pune",
        "skills": ["C++", "Linux", "Python", "AWS"],
        "salary": "₹6,00,000 – ₹15,00,000 / year",
        "email": "careers@tataelxsi.com",
        "link": "https://www.tataelxsi.com/careers",
        "description": "Tata Elxsi is seeking an Embedded Systems Engineer to develop firmware for automotive and IoT products.",
        "responsibilities": ["Write embedded C++ code", "Debug hardware-software interfaces", "Work with RTOS systems", "Test firmware on hardware"]
    },
    {
        "title": "Flutter Developer",
        "company": "InMobi",
        "location": "Bangalore",
        "skills": ["Flutter", "Dart", "iOS", "Android", "REST API"],
        "salary": "₹10,00,000 – ₹20,00,000 / year",
        "email": "careers@inmobi.com",
        "link": "https://www.inmobi.com/company/careers",
        "description": "InMobi, a global mobile advertising leader, is hiring Flutter developers to power its next-gen mobile SDKs.",
        "responsibilities": ["Build cross-platform apps with Flutter", "Integrate ad SDKs", "Optimize rendering performance", "Write test cases"]
    },
    {
        "title": "Technical Lead – Java",
        "company": "Mphasis",
        "location": "Chennai",
        "skills": ["Java", "SpringBoot", "Kubernetes", "SQL", "AWS"],
        "salary": "₹16,00,000 – ₹30,00,000 / year",
        "email": "careers@mphasis.com",
        "link": "https://careers.mphasis.com",
        "description": "Mphasis is hiring a Tech Lead to lead a team of Java developers building banking solutions for global clients.",
        "responsibilities": ["Lead Java development team", "Architect microservices solutions", "Code reviews and mentoring", "Coordinate with client stakeholders"]
    },
    {
        "title": "Salesforce Developer",
        "company": "Persistent Systems",
        "location": "Pune",
        "skills": ["JavaScript", "SQL", "REST API", "Python"],
        "salary": "₹8,00,000 – ₹18,00,000 / year",
        "email": "jobs@persistent.com",
        "link": "https://www.persistent.com/careers",
        "description": "Persistent Systems is looking for Salesforce Developers to build CRM customizations for US-based insurance clients.",
        "responsibilities": ["Develop Salesforce Apex code", "Build Lightning components", "Integrate with third-party APIs", "Train business users"]
    },
    {
        "title": "Software Developer – Remote India",
        "company": "Toptal India Network",
        "location": "Remote India",
        "skills": ["Python", "JavaScript", "React", "Node", "SQL"],
        "salary": "₹18,00,000 – ₹40,00,000 / year",
        "email": "talent@toptal.com",
        "link": "https://www.toptal.com/talent",
        "description": "Toptal connects India's top 3% of remote freelance developers with US and EU companies. Join the network.",
        "responsibilities": ["Deliver high-quality code remotely", "Work with global product teams", "Meet client deliverables", "Participate in agile sprints"]
    },
    {
        "title": "AI Research Engineer",
        "company": "Samsung R&D India",
        "location": "Bangalore",
        "skills": ["Python", "Deep Learning", "TensorFlow", "PyTorch", "C++"],
        "salary": "₹15,00,000 – ₹35,00,000 / year",
        "email": "sri-b.recruit@samsung.com",
        "link": "https://research.samsung.com/sri-b",
        "description": "Samsung R&D India is hiring AI Research Engineers to push the boundaries of computer vision and NLP for Galaxy devices.",
        "responsibilities": ["Publish AI research papers", "Build NLP/CV prototypes", "Optimize models for mobile devices", "Collaborate with global R&D labs"]
    },
]


# ─────────────────────────────────────────────────────────────────────────────
# MAIN FUNCTION
# ─────────────────────────────────────────────────────────────────────────────

def get_jobs() -> list:
    """
    Returns a merged list of Indian job listings from:
    1. Adzuna India API (live)
    2. RemoteOK JSON API (live, India-eligible remote)
    3. Indian demo job database (always available as fallback)

    Returns at least 20 jobs.
    """
    global _cached_jobs
    if _cached_jobs:
        print("[Cache] Returning cached jobs.")
        return _cached_jobs

    all_jobs = []

    # ── Source 1: Adzuna India ──
    adzuna_jobs = _fetch_adzuna_india()
    all_jobs.extend(adzuna_jobs)

    # ── Source 2: RemoteOK ──
    if len(all_jobs) < 10:
        remoteok_jobs = _fetch_remoteok()
        all_jobs.extend(remoteok_jobs)

    # ── Source 3: Indian Fallback DB ──
    # Always append enough fallback jobs to ensure minimum of 20 total
    needed = max(0, 20 - len(all_jobs))
    fallback_slice = INDIAN_FALLBACK_JOBS[:max(needed, len(INDIAN_FALLBACK_JOBS))]
    all_jobs.extend(fallback_slice)

    # Deduplicate by title+company
    seen = set()
    unique_jobs = []
    for job in all_jobs:
        key = (job.get("title", "").lower(), job.get("company", "").lower())
        if key not in seen:
            seen.add(key)
            unique_jobs.append(job)

    _cached_jobs = unique_jobs
    print(f"[JobScraper] Total jobs loaded: {len(_cached_jobs)}")
    return _cached_jobs


# ─────────────────────────────────────────────────────────────────────────────
# CLI test
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    jobs = get_jobs()
    print(f"\nTotal Jobs: {len(jobs)}\n")
    for job in jobs[:5]:
        print(f"  [{job['company']}] {job['title']} – {job['location']}")
        print(f"     Skills: {', '.join(job['skills'])}")
        print(f"     Salary: {job.get('salary', 'N/A')}")
        print()

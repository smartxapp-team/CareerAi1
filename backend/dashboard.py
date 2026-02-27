from collections import Counter
from jobscraper import get_jobs

def get_dashboard():
    """
    Calculate real trends based on scraped job data for the dashboard.
    Returns: Quick Stats, Trending Jobs, Hiring Companies, Demanding Skills, and Recent Jobs.
    """
    jobs = get_jobs()
    
    titles = Counter()
    companies = Counter()
    skills = Counter()
    
    for job in jobs:
        # Count titles
        title = job.get('title')
        if title:
            titles[title] += 1
            
        # Count companies
        company = job.get('company')
        if company:
            companies[company] += 1
            
        # Count skills
        job_skills = job.get('skills', [])
        for skill in job_skills:
            skills[skill] += 1

    # Extract top stat for the quick stats overview
    top_skill = skills.most_common(1)[0][0] if skills else "N/A"
    top_company = companies.most_common(1)[0][0] if companies else "N/A"
    top_title = titles.most_common(1)[0][0] if titles else "N/A"
    
    # Store top 5 components
    trending_jobs = [{"title": title, "count": count} for title, count in titles.most_common(5)]
    hiring_companies = [{"name": name, "jobs": count} for name, count in companies.most_common(5)]
    demanding_skills = [{"skill": skill, "count": count} for skill, count in skills.most_common(5)]
    
    # Get last 5 recent jobs listed
    recent_jobs_list = []
    # Taking the most recent from the end of the jobs list, alternatively if 'jobs' is sorted oldest to newest. 
    # Usually scraped jobs are newest first, so we'll take the first 5.
    for job in jobs[:5]:
        recent_jobs_list.append({
            "title": job.get("title", "Unknown"),
            "company": job.get("company", "Unknown"),
            "location": job.get("location", "Unknown")
        })

    # Assemble and return the complete dashboard JSON structure
    dashboard_data = {
        "quick_stats": {
            "total_jobs": len(jobs),
            "top_skill": top_skill,
            "top_company": top_company,
            "top_role": top_title
        },
        "trending_jobs": trending_jobs,
        "hiring_companies": hiring_companies,
        "demanding_skills": demanding_skills,
        "recent_jobs": recent_jobs_list
    }
    
    return dashboard_data

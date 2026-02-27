from collections import Counter
from jobscraper import get_jobs

def get_trends():
    """
    Calculate real trends based on the jobs data.
    Returns Top 5 Trending Jobs, Hiring Companies, and Demanding Skills.
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
            
    # Format output to match the desired JSON structure
    trends_data = {
        "trending_jobs": [
            {"title": title, "count": count}
            for title, count in titles.most_common(5)
        ],
        "hiring_companies": [
            {"name": name, "jobs": count}
            for name, count in companies.most_common(5)
        ],
        "demanding_skills": [
            {"skill": skill, "count": count}
            for skill, count in skills.most_common(5)
        ]
    }
    
    return trends_data

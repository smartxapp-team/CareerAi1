from jobscraper import get_jobs

def match_resume(user_skills):
    """
    Matches user's skills with available jobs.
    Return matching jobs based on intersected skills.
    """
    matched_jobs = []
    all_jobs = get_jobs()

    # Convert user skills to lowercase for resilient matching
    user_skills_lower = [skill.lower() for skill in user_skills]

    for job in all_jobs:
        job_skills_lower = [skill.lower() for skill in job.get("skills", [])]
        
        # Check if there is any intersection between user skills and job skills
        for user_skill in user_skills_lower:
            if user_skill in job_skills_lower:
                matched_jobs.append(job)
                break # Move to the next job once a match is found to avoid duplicates

    return matched_jobs

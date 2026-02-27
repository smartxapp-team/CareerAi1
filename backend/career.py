def career_paths(skill):
    """
    Suggests multiple career options paths for a given skill.
    Returns a JSON-serializable dictionary with matching careers and their required skills.
    """
    skill = skill.lower().strip()

    # Define the career options and their required skills
    careers_db = [
        {
            "career": "Software Engineer",
            "required_skills": ["Java", "C++", "Python", "DSA", "OOP", "Git", "System Design"]
        },
        {
            "career": "Backend Developer",
            "required_skills": ["Java", "Python", "NodeJS", "SpringBoot", "Django", "REST API", "MySQL", "MongoDB"]
        },
        {
            "career": "Frontend Developer",
            "required_skills": ["HTML", "CSS", "JavaScript", "React", "Vue", "Angular", "UI Design"]
        },
        {
            "career": "Full Stack Developer",
            "required_skills": ["JavaScript", "React", "NodeJS", "SQL", "APIs", "MongoDB"]
        },
        {
            "career": "Data Analyst",
            "required_skills": ["SQL", "Excel", "Power BI", "Python", "Tableau"]
        },
        {
            "career": "Data Scientist",
            "required_skills": ["Python", "R", "Machine Learning", "Statistics", "Pandas", "Numpy"]
        },
        {
            "career": "Machine Learning Engineer",
            "required_skills": ["Python", "Deep Learning", "TensorFlow", "Scikit-learn", "PyTorch"]
        },
        {
            "career": "AI Engineer",
            "required_skills": ["Python", "Deep Learning", "NLP", "LLMs", "TensorFlow"]
        },
        {
            "career": "Mobile Developer",
            "required_skills": ["Java", "Kotlin", "Swift", "Android", "Flutter", "React Native", "Android Studio"]
        },
        {
            "career": "DevOps Engineer",
            "required_skills": ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux", "Jenkins"]
        },
        {
            "career": "Cyber Security Engineer",
            "required_skills": ["Networking", "Ethical Hacking", "Linux", "Security Tools", "Python"]
        },
        {
            "career": "Cloud Engineer",
            "required_skills": ["AWS", "Azure", "Cloud Computing", "Linux", "GCP"]
        },
        {
            "career": "Game Developer",
            "required_skills": ["Unity", "C#", "C++", "Game Physics", "Unreal Engine"]
        },
        {
            "career": "Web Developer",
            "required_skills": ["HTML", "CSS", "JavaScript", "Hosting", "PHP"]
        }
    ]

    matched_careers = []
    
    # Iterate over our defined database and see if the user's skill matches any required skills
    for career in careers_db:
        # Convert required skills to lowercase for resilient matching
        required_skills_lower = [s.lower() for s in career["required_skills"]]
        
        # Check against the input skill
        if skill in required_skills_lower:
            # Reconstruct the career object removing the user's skill from required (or showing all)
            # The prompt says: Return career & required_skills.
            # However, since the frontend expects `learn` and `role` to display it correctly,
            # we'll map the standard frontend fields to not break the UI flow chart.
            matched_careers.append({
                "career": career["career"],
                "role": career["career"], # Added for frontend UI combability
                "required_skills": career["required_skills"],
                "learn": ', '.join([s for s in career["required_skills"] if s.lower() != skill][:2]) # Added for frontend UI compatibility
            })
            
    # If no exact matches are found, return a default suggestion
    if not matched_careers:
        return {
            "skill": skill,
            "career_paths": [
                {
                    "career": "Software Engineer",
                    "role": "Software Engineer",
                    "required_skills": ["Problem Solving", "DSA", "OOP", "Git"],
                    "learn": "Problem Solving"
                }
            ]
        }

    return {
        "skill": skill.capitalize(),
        "career_paths": matched_careers
    }

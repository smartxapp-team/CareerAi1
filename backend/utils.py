def extract_skills(text):
    """
    Extracts skills from text using keyword matching.
    Check for keywords like Python, Java, SQL, etc.
    """
    text = text.lower()
    
    known_skills = [
        "Python", "Java", "SQL", "React", "SpringBoot", 
        "Django", "Machine Learning", "AI", "HTML", 
        "CSS", "JavaScript", "Pandas", "AWS", "Node.js"
    ]
    
    found_skills = []
    for skill in known_skills:
        if skill.lower() in text:
            found_skills.append(skill)
            
    return list(set(found_skills))

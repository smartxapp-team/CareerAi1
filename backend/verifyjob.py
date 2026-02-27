def verify(email):
    """
    Verifies if an email belongs to a generic domain.
    If generic (gmail.com, yahoo.com, hotmail.com), return Suspicious.
    Otherwise, return Safe.
    """
    suspicious_domains = ["gmail.com", "yahoo.com", "hotmail.com"]
    
    email_lower = email.lower()
    for domain in suspicious_domains:
        if domain in email_lower:
            return {"status": "Suspicious"}
            
    return {"status": "Safe"}

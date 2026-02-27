from flask import Flask, jsonify, request
from flask_cors import CORS
from jobscraper import get_jobs
from career import career_paths
from trends import get_trends
from dashboard import get_dashboard
from resume_match import match_resume
from verifyjob import verify
from resume_upload import extract_text, extract_skills, match_jobs

# Initialize the Flask application
app = Flask(__name__)
# Enable CORS for all routes and origins
CORS(app)

# -----------------------------------------------------------------------------
# 1. HOME ROUTE
# -----------------------------------------------------------------------------
@app.route('/', methods=['GET'])
def home():
    """
    Returns a simple success message indicating the backend is running.
    """
    return "Backend Running Successfully"

# -----------------------------------------------------------------------------
# 2. JOBS API
# -----------------------------------------------------------------------------
@app.route('/jobs', methods=['GET'])
def api_jobs():
    """
    Returns real job listings scraped from public websites.
    """
    jobs = get_jobs()
    return jsonify(jobs)

# -----------------------------------------------------------------------------
# 3. CAREER PATH API
# -----------------------------------------------------------------------------
@app.route('/career', methods=['POST'])
def api_career():
    """
    Returns career paths based on the input skill provided in the request body.
    Expects JSON: {"skill": "Java"}
    """
    # Parse JSON data from the request
    data = request.get_json()
    
    # Check if skill is in the dictionary
    if not data or 'skill' not in data:
        return jsonify({"error": "Please provide a 'skill' in the JSON body"}), 400
        
    skill = data['skill']
    paths = career_paths(skill)
    return jsonify(paths)

# -----------------------------------------------------------------------------
# 4. DASHBOARD API
# -----------------------------------------------------------------------------
@app.route('/dashboard', methods=['GET'])
def api_dashboard():
    """
    Returns complete dashboard JSON including:
    - Quick Stats
    - Trending Jobs
    - Top Hiring Companies
    - Most Demanding Skills
    - Recent Jobs
    """
    data = get_dashboard()
    return jsonify(data)

# -----------------------------------------------------------------------------
# 5. TRENDS DASHBOARD API (LEGACY)
# -----------------------------------------------------------------------------
@app.route('/resume', methods=['POST'])
def api_resume():
    """
    Matches input skills against the available jobs and returns a list of matched jobs.
    Expects JSON: {"skills": ["Java", "SQL"]}
    """
    # Parse JSON data from the request
    data = request.get_json()
    
    # Validation step
    if not data or 'skills' not in data:
        return jsonify({"error": "Please provide 'skills' in the JSON body"}), 400
        
    skills = data['skills']
    matched = match_resume(skills)
    return jsonify(matched)

# -----------------------------------------------------------------------------
# 6. FAKE JOB DETECTION API
# -----------------------------------------------------------------------------
@app.route('/verifyjob', methods=['POST'])
def api_verifyjob():
    """
    Verifies if a job offer is legitimate based on the employer's email.
    Expects JSON: {"email": "hr@company.com"}
    """
    # Parse JSON data from the request
    data = request.get_json()
    
    # Ensure email is in the dictionary
    if not data or 'email' not in data:
        return jsonify({"error": "Please provide an 'email' in the JSON body"}), 400
        
    email = data['email']
    status = verify(email)
    return jsonify(status)

# -----------------------------------------------------------------------------
# 7. RESUME UPLOAD & JOB MATCHING API
# -----------------------------------------------------------------------------
@app.route('/upload_resume', methods=['POST'])
def upload_resume():
    """
    Accepts a resume file (PDF, DOCX, TXT), extracts text and skills,
    then returns a list of matching jobs from the jobs database.

    Input:  multipart/form-data  →  file field named 'file'
    Output: JSON { extracted_skills: [...], matching_jobs: [...] }
    """
    # Validate file presence
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded. Send a file with field name 'file'."}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "File name is empty. Please select a valid file."}), 400

    try:
        # Step 1: Extract text from resume
        text = extract_text(file)

        if not text.strip():
            return jsonify({"error": "Could not extract any text from the file. Please check the file content."}), 422

        # Step 2: Identify skills in the text
        skills = extract_skills(text)

        # Step 3: Match skills against jobs database
        jobs = match_jobs(skills)

        return jsonify({
            "extracted_skills": skills,
            "matching_jobs": jobs
        })

    except ValueError as e:
        return jsonify({"error": str(e)}), 415
    except (ImportError, RuntimeError) as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500


# -----------------------------------------------------------------------------
# Application Execution
# -----------------------------------------------------------------------------
if __name__ == '__main__':
    # Start the application on localhost port 5000 in debug mode
    print("Starting Flask Backend...")
    app.run(host='127.0.0.1', port=5000, debug=True)

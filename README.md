# ResumeForge

A web-based Resume Editor with AI enhancement capabilities and FastAPI backend.

## Project Overview

ResumeForge allows users to:
- Upload and edit resumes (.pdf, .docx)
- Enhance resume sections using AI
- Save and retrieve resume data
- Download the final resume as JSON

## Backend Architecture

The backend is built with FastAPI and follows a structured architecture:

```
backend/
├── app/
│   ├── models/       # Pydantic data models
│   ├── routers/      # API endpoints
│   ├── services/     # Business logic
│   └── main.py       # FastAPI application
├── data/             # Stored resume data
└── server.py         # Server entry point
```

## API Routes

### AI Enhancement

- **POST /api/ai-enhance**
  - Input: `{"section": "summary", "content": "Experienced developer..."}`
  - Output: Returns AI-enhanced version of the content
  - Implementation: Currently mocked, future integration with Google Gemini AI

### Resume Storage

- **POST /api/save-resume**
  - Input: Complete resume JSON
  - Output: Resume with metadata (ID, timestamp)
  - Implementation: Saves to JSON file in data directory

- **GET /api/resume/{resume_id}**
  - Input: Resume ID in path
  - Output: Complete resume data
  - Implementation: Retrieves from JSON file in data directory

- **GET /api/resumes**
  - Output: List of all stored resumes with basic metadata
  - Implementation: Lists all resume files in data directory

### File Upload

- **POST /api/upload-resume**
  - Input: .pdf or .docx file (multipart/form-data)
  - Output: Parsed resume data (mocked for demo)
  - Implementation: Currently returns mock data, future integration with document parsing

## Data Models

### Resume Structure

```json
{
  "personal_info": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1 (555) 123-4567",
    "address": "123 Main St, Anytown, USA",
    "linkedin": "linkedin.com/in/johndoe",
    "github": "github.com/johndoe",
    "summary": "Experienced software developer..."
  },
  "education": [
    {
      "institution": "University of Technology",
      "degree": "Bachelor of Science",
      "field_of_study": "Computer Science",
      "start_date": "2015-09",
      "end_date": "2019-05",
      "description": "Focused on software engineering..."
    }
  ],
  "experience": [
    {
      "company": "Tech Solutions Inc.",
      "position": "Senior Software Engineer",
      "start_date": "2021-06",
      "end_date": "Present",
      "description": "Lead developer for cloud-based applications.",
      "achievements": [
        "Implemented CI/CD pipeline reducing deployment time by 40%",
        "Optimized database queries resulting in 30% faster load times"
      ]
    }
  ],
  "skills": [
    {"name": "JavaScript", "level": "Expert", "category": "Programming"},
    {"name": "Python", "level": "Advanced", "category": "Programming"}
  ],
  "certifications": [
    "AWS Certified Solutions Architect",
    "Certified Scrum Master"
  ],
  "languages": [
    "English (Native)",
    "Spanish (Intermediate)"
  ]
}
```

## AI Enhancement

### Current Implementation

The AI enhancement service currently provides mocked responses based on the section type. These mocks simulate AI-enhanced content by adding professional terminology and achievements to the original text.

### Future Gemini AI Integration

Plans for integrating with Google's Gemini AI include:

1. **Setup**: 
   - Create a Google AI Studio account and obtain an API key
   - Add the key to environment variables or a secure configuration

2. **Implementation**:
   - The `integrate_gemini_ai` method in `ai_service.py` will be updated to connect to Gemini API
   - Each resume section will have specialized prompts to guide AI enhancement

3. **Configuration**:
   To prepare for future integration, the following will be needed:
   ```python
   # Environment variables (to be added)
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Enhancement Types**:
   - **Summary**: Professional tone, achievements, core competencies
   - **Experience**: Action verbs, quantifiable results, industry-specific terminology
   - **Education**: Academic achievements, relevant coursework, extracurricular highlights
   - **Skills**: Industry context, expertise level calibration, trending skill identification

## Setup and Installation

### Windows (Quick Start)

1. Clone the repository
2. Run the all-in-one launcher script:
   ```powershell
   .\start_all.ps1
   ```
   This will:
   - Install all dependencies
   - Start the FastAPI backend on port 8000
   - Start a simple HTTP server for the frontend on port 8080
   
   Both services will run in separate PowerShell windows.

### Windows (Backend Only)

If you only need to run the backend API:
```powershell
.\start_server.ps1
```

### macOS/Linux

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the backend server:
   ```bash
   cd backend
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
4. In a new terminal, run a simple HTTP server for the frontend:
   ```bash
   cd frontend
   python -m http.server 8080
   ```

Once running:
- API will be available at http://localhost:8000
- API documentation available at http://localhost:8000/docs
- Frontend will be available at http://localhost:8080

### Stopping the Services

- For Windows, simply close the PowerShell windows where the services are running
- For macOS/Linux, press Ctrl+C in each terminal window to stop the respective services

## Frontend Integration

The frontend should interact with the API endpoints to:
1. Upload resume files
2. Edit resume data
3. Send sections for AI enhancement
4. Save the complete resume
5. Download the final resume

## Advanced Features

### PDF Generation

The API provides two endpoints for generating professionally formatted PDF resumes:

- **POST /api/generate-pdf** - Generates a PDF from a JSON resume
- **GET /api/resume/{resume_id}/pdf** - Gets a saved resume as a PDF

The PDF generation supports multiple layouts and formatting to create professional-looking documents.

### AI Enhancement with Gemini

The application integrates with Google's Gemini AI when available:

1. Obtain a Gemini API key from https://aistudio.google.com/
2. Add your API key to the `.env` file
3. Restart the server

When properly configured, the AI enhancement will use Gemini to provide sophisticated content improvements. If the API key is not available or the library is not installed, the system automatically falls back to mock enhancements.

## Future Enhancements

1. ✅ Integration with Google Gemini AI for real AI-powered enhancements
2. ✅ PDF export functionality
3. Implement document parsing for PDF and DOCX files
4. Add authentication and user accounts
5. Support for multiple resume templates

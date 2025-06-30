# ResumeForge API Testing Guide

This document provides instructions for testing the ResumeForge API endpoints using Postman.

## Table of Contents
- [API Base URL](#api-base-url)
- [Endpoints](#endpoints)
  - [1. Resume Upload](#1-resume-upload)
  - [2. AI Enhancement](#2-ai-enhancement)
  - [3. Save Resume](#3-save-resume)
  - [4. Get Resume by ID](#4-get-resume-by-id)
  - [5. List All Resumes](#5-list-all-resumes)
  - [6. Get AI Status](#6-get-ai-status)
  - [7. Get AI Sections](#7-get-ai-sections)
  - [8. Generate PDF from JSON](#8-generate-pdf-from-json)
  - [9. Get Resume as PDF](#9-get-resume-as-pdf)
- [Error Handling](#error-handling)
- [Testing Workflow](#testing-workflow)

## API Base URL

For local development: `http://localhost:8000/api`

## Endpoints

### 1. Resume Upload

**Endpoint:** `POST /upload-resume`

**Description:** Upload a resume file (.pdf or .docx) and get parsed content.

**Request:**
- Type: `multipart/form-data`
- Form Field:
  - Key: `file`
  - Value: Select a .pdf or .docx file

**Postman Setup:**
1. Select POST method
2. Enter URL: `http://localhost:8000/api/upload-resume`
3. Go to Body tab
4. Select form-data
5. Add a key named `file` and select File type from the dropdown
6. Upload a PDF or DOCX file

**Expected Response:**
```json
{
  "message": "Resume yourfile.pdf uploaded successfully",
  "parsed_resume": {
    "personal_info": {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1 (555) 123-4567",
      "address": "123 Main St, Anytown, USA",
      "linkedin": "linkedin.com/in/johndoe",
      "github": "github.com/johndoe",
      "summary": "Experienced software developer with 5+ years of experience in web development and cloud technologies."
    },
    "education": [
      {
        "institution": "University of Technology",
        "degree": "Bachelor of Science",
        "field_of_study": "Computer Science",
        "start_date": "2015-09",
        "end_date": "2019-05",
        "description": "Focused on software engineering and data structures."
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
      },
      {
        "company": "Digital Innovations",
        "position": "Software Developer",
        "start_date": "2019-07",
        "end_date": "2021-05",
        "description": "Developed front-end components using React.",
        "achievements": [
          "Created reusable component library used across 5 projects",
          "Collaborated with UX team to implement responsive designs"
        ]
      }
    ],
    "skills": [
      {"name": "JavaScript", "level": "Expert", "category": "Programming"},
      {"name": "Python", "level": "Advanced", "category": "Programming"},
      {"name": "React", "level": "Advanced", "category": "Frontend"},
      {"name": "Node.js", "level": "Advanced", "category": "Backend"},
      {"name": "AWS", "level": "Intermediate", "category": "Cloud"},
      {"name": "Docker", "level": "Intermediate", "category": "DevOps"}
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
}
```

**Possible Errors:**
- 400 Bad Request: If the file is not a PDF or DOCX
- 400 Bad Request: If no file is provided

### 2. AI Enhancement

**Endpoint:** `POST /ai-enhance`

**Description:** Enhance resume content using AI (currently mocked).

**Request:**
- Type: `application/json`
- Body: 
```json
{
  "section": "summary",
  "content": "Experienced software developer with 5+ years of experience."
}
```

**Postman Setup:**
1. Select POST method
2. Enter URL: `http://localhost:8000/api/ai-enhance`
3. Go to Headers tab
4. Add header: `Content-Type: application/json`
5. Go to Body tab
6. Select raw, JSON
7. Enter the JSON payload (example above)

**Expected Response:**
```json
{
  "enhanced_content": "Experienced software developer with 5+ years of experience. Demonstrated expertise in leading cross-functional teams and delivering high-impact solutions that drive business growth and operational efficiency."
}
```

**Valid Section Values:**
- "summary"
- "experience"
- "education"
- "skills"
- "projects"
- "certifications"

**Possible Errors:**
- 400 Bad Request: If section or content is empty
- 400 Bad Request: If an invalid section is provided

### 3. Save Resume

**Endpoint:** `POST /save-resume`

**Description:** Save a complete resume to the backend.

**Request:**
- Type: `application/json`
- Body: Complete resume JSON (see example below)

**Postman Setup:**
1. Select POST method
2. Enter URL: `http://localhost:8000/api/save-resume`
3. Go to Headers tab
4. Add header: `Content-Type: application/json`
5. Go to Body tab
6. Select raw, JSON
7. Enter the JSON payload (example below)

**Example Request Body:**
```json
{
  "personal_info": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1 (555) 123-4567",
    "address": "123 Main St, Anytown, USA",
    "linkedin": "linkedin.com/in/johndoe",
    "github": "github.com/johndoe",
    "summary": "Experienced software developer with 5+ years of experience in web development and cloud technologies."
  },
  "education": [
    {
      "institution": "University of Technology",
      "degree": "Bachelor of Science",
      "field_of_study": "Computer Science",
      "start_date": "2015-09",
      "end_date": "2019-05",
      "description": "Focused on software engineering and data structures."
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
    "AWS Certified Solutions Architect"
  ],
  "languages": [
    "English (Native)"
  ]
}
```

**Expected Response:**
```json
{
  "personal_info": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1 (555) 123-4567",
    "address": "123 Main St, Anytown, USA",
    "linkedin": "linkedin.com/in/johndoe",
    "github": "github.com/johndoe",
    "summary": "Experienced software developer with 5+ years of experience in web development and cloud technologies."
  },
  "education": [
    {
      "institution": "University of Technology",
      "degree": "Bachelor of Science",
      "field_of_study": "Computer Science",
      "start_date": "2015-09",
      "end_date": "2019-05",
      "description": "Focused on software engineering and data structures."
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
    "AWS Certified Solutions Architect"
  ],
  "languages": [
    "English (Native)"
  ],
  "id": "8f9e5722-c5f0-4ac2-8901-3b2fb167d5b9",
  "last_updated": "2025-06-26T14:30:45.123456"
}
```

Note: The response will include an `id` and `last_updated` timestamp that were added by the server.

### 4. Get Resume by ID

**Endpoint:** `GET /resume/{resume_id}`

**Description:** Retrieve a resume by its ID.

**Request:**
- Type: `GET`
- URL Parameter: `resume_id` (uuid string)

**Postman Setup:**
1. Select GET method
2. Enter URL: `http://localhost:8000/api/resume/{resume_id}`
   (Replace `{resume_id}` with an actual ID from a previously saved resume)

**Expected Response:**
The complete resume JSON with all fields, identical to the response from the save endpoint.

**Possible Errors:**
- 404 Not Found: If no resume with the given ID exists

### 5. List All Resumes

**Endpoint:** `GET /resumes`

**Description:** List all saved resumes with basic metadata.

**Request:**
- Type: `GET`
- No parameters required

**Postman Setup:**
1. Select GET method
2. Enter URL: `http://localhost:8000/api/resumes`

**Expected Response:**
```json
[
  {
    "id": "8f9e5722-c5f0-4ac2-8901-3b2fb167d5b9",
    "name": "John Doe",
    "last_updated": "2025-06-26T14:30:45.123456"
  },
  {
    "id": "2a3b4c5d-6e7f-8g9h-0i1j-2k3l4m5n6o7p",
    "name": "Jane Smith",
    "last_updated": "2025-06-26T15:45:12.789012"
  }
]
```

## Error Handling

The API uses standard HTTP status codes:

- 200 OK: Successful request
- 400 Bad Request: Invalid input (validation errors)
- 404 Not Found: Resource not found
- 500 Internal Server Error: Server-side issue

Error responses include a detail message:

```json
{
  "detail": "Resume with ID abc123 not found"
}
```

### 6. Get AI Status

**Endpoint:** `GET /ai-status`

**Description:** Get the current status of AI enhancement capabilities.

**Request:**
- Type: `GET`
- No parameters required

**Postman Setup:**
1. Select GET method
2. Enter URL: `http://localhost:8000/api/ai-status`

**Expected Response:**
```json
{
  "gemini_available": true,
  "gemini_configured": true,
  "using_mock": false
}
```

Note: If Gemini AI is not configured or the library is not installed, `using_mock` will be `true` and the AI enhancement will use mock responses instead.

### 7. Get AI Sections

**Endpoint:** `GET /ai-sections`

**Description:** Get the list of resume sections that can be enhanced with AI.

**Request:**
- Type: `GET`
- No parameters required

**Postman Setup:**
1. Select GET method
2. Enter URL: `http://localhost:8000/api/ai-sections`

**Expected Response:**
```json
{
  "valid_sections": [
    {
      "name": "summary",
      "description": "Professional summary or objective statement"
    },
    {
      "name": "experience",
      "description": "Work experience descriptions"
    },
    {
      "name": "education",
      "description": "Education history and descriptions"
    },
    {
      "name": "skills",
      "description": "Professional skills and competencies"
    },
    {
      "name": "projects",
      "description": "Project descriptions and accomplishments"
    },
    {
      "name": "certifications",
      "description": "Professional certifications and licenses"
    }
  ]
}
```

### 8. Generate PDF from JSON

**Endpoint:** `POST /generate-pdf`

**Description:** Generate a PDF from the provided resume data.

**Request:**
- Type: `application/json`
- Body: Complete resume JSON (same format as /save-resume)

**Postman Setup:**
1. Select POST method
2. Enter URL: `http://localhost:8000/api/generate-pdf`
3. Go to Headers tab
4. Add header: `Content-Type: application/json`
5. Go to Body tab
6. Select raw, JSON
7. Enter the resume JSON (same as for /save-resume)

**Expected Response:**
- Content-Type: `application/pdf`
- A downloadable PDF file containing the formatted resume

**Possible Errors:**
- 501 Not Implemented: If PDF generation libraries are not available
- 500 Internal Server Error: If PDF generation fails

### 9. Get Resume as PDF

**Endpoint:** `GET /resume/{resume_id}/pdf`

**Description:** Get a saved resume as a PDF file.

**Request:**
- Type: `GET`
- URL Parameter: `resume_id` (uuid string)

**Postman Setup:**
1. Select GET method
2. Enter URL: `http://localhost:8000/api/resume/{resume_id}/pdf`
   (Replace `{resume_id}` with an actual ID from a previously saved resume)

**Expected Response:**
- Content-Type: `application/pdf`
- A downloadable PDF file containing the formatted resume

**Possible Errors:**
- 404 Not Found: If resume with the given ID doesn't exist
- 501 Not Implemented: If PDF generation libraries are not available
- 500 Internal Server Error: If PDF generation fails

## Testing Workflow

For a complete end-to-end test, follow these steps:

1. **Upload a Resume**
   - Send a POST request to `/api/upload-resume` with a sample PDF/DOCX
   - Copy the parsed resume JSON from the response

2. **Enhance a Section**
   - Send a POST request to `/api/ai-enhance` with the summary section
   - Note the enhanced content

3. **Save the Resume**
   - Send a POST request to `/api/save-resume` with the complete resume
   - Save the returned ID

4. **Retrieve the Resume**
   - Send a GET request to `/api/resume/{id}` using the ID from step 3
   - Verify that all data matches what was saved

5. **List All Resumes**
   - Send a GET request to `/api/resumes`
   - Verify that your saved resume appears in the list

6. **Generate PDF**
   - Send a GET request to `/api/resume/{id}/pdf` using the ID from step 3
   - Verify that a PDF file is downloaded with the resume information

## Notes for Development Testing

- Remember that the file parsing is currently mocked, so any PDF or DOCX will return the same mock data
- The AI enhancement is also mocked, adding predefined content based on the section type
- Saved resume data is stored in the `backend/data` directory as JSON files

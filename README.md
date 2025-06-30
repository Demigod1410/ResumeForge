# ResumeForge

A modern web-based Resume Editor with AI enhancement capabilities, FastAPI backend, and a vibrant, animated UI.

![ResumeForge UI](https://example.com/resumeforge-screenshot.png)

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/resumeforge.git
cd resumeforge

# Backend setup
pip install -r requirements.txt
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# In a new terminal - Frontend setup
cd frontend
npm install
npm run dev

# Access the application
# Backend API: http://localhost:8000
# Frontend: http://localhost:9002
```

For Windows users, simply run:
```powershell
.\start_all.ps1
```

## Project Overview

ResumeForge allows users to:
- Upload and edit resumes (.pdf, .docx)
- Enhance resume sections using AI
- Save and retrieve resume data
- Download the final resume as JSON or PDF

### Architecture Overview

ResumeForge follows a modern web application architecture:

```
┌─────────────────┐      ┌──────────────────┐      ┌───────────────────┐
│                 │      │                  │      │                   │
│  Next.js        │◄────►│  FastAPI         │◄────►│  Storage & AI     │
│  Frontend       │      │  Backend         │      │  Services         │
│                 │      │                  │      │                   │
└─────────────────┘      └──────────────────┘      └───────────────────┘
    - UI Components        - API Endpoints           - Resume Storage
    - Form Handling        - Data Validation         - AI Enhancement
    - API Integration      - Business Logic          - PDF Generation
    - Animations           - Error Handling          - File Processing
```

#### Technology Stack

- **Frontend**: Next.js, TypeScript, TailwindCSS, Framer Motion, Radix UI
- **Backend**: FastAPI, Pydantic, Python 3.8+
- **AI Integration**: Google Gemini AI (via Google Generative AI SDK)
- **PDF Processing**: ReportLab, WeasyPrint, PyPDF2, pdfplumber
- **Document Handling**: python-docx, xhtml2pdf

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

### Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+**: Required for the FastAPI backend. [Download Python](https://www.python.org/downloads/)
- **Node.js 18+ and npm**: Required for the Next.js frontend. [Download Node.js](https://nodejs.org/)
- **Git**: For cloning the repository. [Download Git](https://git-scm.com/downloads)

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/resumeforge.git
   cd resumeforge
   ```

### Backend Setup

1. Install Python dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

2. (Optional) Create a virtual environment to isolate dependencies:
   ```powershell
   # Create virtual environment
   python -m venv venv

   # Activate on Windows
   .\venv\Scripts\activate

   # Activate on macOS/Linux
   source venv/bin/activate

   # Then install dependencies
   pip install -r requirements.txt
   ```

3. Configure environment variables (optional, for AI features):
   - Create a `.env` file in the `backend` directory
   - Add your Google Gemini API key (if available):
     ```
     GEMINI_API_KEY=your_api_key_here
     ```

4. Start the FastAPI backend server:
   ```powershell
   cd backend
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

5. The backend server will be available at:
   - API: http://localhost:8000
   - API Documentation (Swagger UI): http://localhost:8000/docs

### Frontend Setup

1. Navigate to the frontend directory:
   ```powershell
   cd frontend
   ```

2. Install Node.js dependencies:
   ```powershell
   npm install
   ```

3. Start the development server:
   ```powershell
   npm run dev
   ```
   
4. The frontend will be available at: http://localhost:9002

### Quick Start (Windows Only)

If you're on Windows, you can use our all-in-one launcher script:

1. Run the script from the project root:
   ```powershell
   .\start_all.ps1
   ```

   This will:
   - Install all Python dependencies
   - Start the FastAPI backend on port 8000
   - Start a simple HTTP server for the frontend on port 8080
   
   Both services will run in separate PowerShell windows.

### Windows (Backend Only)

If you only need to run the backend API:

```powershell
.\start_server.ps1
```

### Alternative Setup with VS Code Tasks

1. Open the project in VS Code
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS)
3. Type "Run Task" and select "Tasks: Run Task"
4. Choose "Run FastAPI Server" to start the backend

### Using Docker (Optional)

To run the application with Docker:

```bash
# Build the docker image
docker build -t resumeforge .

# Run the container
docker run -p 8000:8000 -p 9002:9002 resumeforge
```

### Stopping the Services

- For Windows quick start: Simply close the PowerShell windows where the services are running
- For individually started servers: Press `Ctrl+C` in each terminal window to stop the respective services
- For Docker: Use `docker stop <container_id>`

## Frontend Integration

### Overview

The frontend is built with Next.js and includes modern UI components featuring:
- Vibrant animated background with particles and grid effects
- Glassmorphic UI elements with subtle glow effects
- Dark mode support
- Modern, responsive design

### Key Components

- **AnimatedBackground**: Creates a visually engaging particle and grid animation with vibrant effects
  ```tsx
  // Usage example
  import { AnimatedBackground } from '@/components/ui/animated-background';
  
  <div className="relative h-screen w-full">
    <AnimatedBackground />
    <div className="relative z-10">
      {/* Your content goes here */}
    </div>
  </div>
  ```

- **GlassCard**: Glassmorphic card components with subtle glow and blur effects
  ```tsx
  // Usage example
  import { GlassCard } from '@/components/ui/glass-card';
  
  <GlassCard>
    <h2>Card Title</h2>
    <p>Card content with glassmorphic effect</p>
  </GlassCard>
  ```

- **ModernSpinner** and **ModernProgress**: Animated loading indicators
  ```tsx
  // Usage examples
  import { ModernSpinner } from '@/components/ui/modern-spinner';
  import { ModernProgress } from '@/components/ui/modern-progress';
  
  // Loading spinner
  <ModernSpinner size="medium" />
  
  // Progress indicator
  <ModernProgress value={75} />
  ```

- **ModernFileUpload**: Stylized file upload component with drag and drop
  ```tsx
  // Usage example
  import { ModernFileUpload } from '@/components/ui/modern-file-upload';
  
  <ModernFileUpload 
    onFileSelect={(file) => handleFileUpload(file)}
    acceptedTypes={['.pdf', '.docx']}
  />
  ```

- **FloatingActionButton**: Accessible floating action buttons
  ```tsx
  // Usage example
  import { FloatingActionButton } from '@/components/ui/floating-action-button';
  
  <FloatingActionButton 
    icon={<PlusIcon />} 
    onClick={handleClick}
    tooltip="Add new item"
  />
  ```

### API Integration

The frontend interacts with the FastAPI backend through the following functions:

1. **Upload Resume Files**:
   ```typescript
   // Located in src/api.ts
   async function uploadResume(file: File): Promise<Resume> {
     // Implementation details
   }
   ```

2. **Edit Resume Data**:
   ```typescript
   // Located in src/api.ts
   async function updateResume(resumeData: Resume): Promise<Resume> {
     // Implementation details
   }
   ```

3. **AI Enhancement**:
   ```typescript
   // Located in src/api.ts
   async function enhanceSection(section: string, content: string): Promise<string> {
     // Implementation details
   }
   ```

4. **Save & Download**:
   ```typescript
   // Located in src/api.ts
   async function saveResume(resumeData: Resume): Promise<string> {
     // Implementation details
   }
   
   async function downloadResume(resumeId: string, format: 'json' | 'pdf'): Promise<Blob> {
     // Implementation details
   }
   ```

### Frontend Development

To make changes to the frontend:

1. Navigate to the frontend directory
2. Run the development server: `npm run dev`
3. Make changes to components in `src/components/ui/`
4. Update pages in `src/app/`
5. Styling can be modified in `src/app/globals.css`

## Frontend Design and UI Components

ResumeForge features a modern, visually appealing interface with several key design elements:

### Animated Background

The application uses a vibrant, animated canvas background with multiple visual elements:
- **Particles**: Floating points with subtle movement and glow effects
- **Grid Effect**: A subtle grid pattern providing depth and structure
- **Glow Overlay**: Soft glow effects to enhance the visual appeal

```typescript
// Key implementation in animated-background.tsx
const AnimatedBackground = () => {
  // Dynamic canvas with particles, grid, and subtle glow
};
```

### Glassmorphic UI

The interface uses glassmorphism design principles:
- **Glass Cards**: Semi-transparent containers with backdrop blur
- **Subtle Borders**: Light borders to define component boundaries
- **Depth Effects**: Shadows and highlights to create depth perception

```typescript
// Example from glass-card.tsx
const GlassCard = ({ children, className, ...props }) => {
  return (
    <div 
      className={cn(
        "rounded-xl bg-background/80 p-6 backdrop-blur-lg border border-primary/10 shadow-glow",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
```

### Modern UI Components

Custom UI components enhance user experience:
- **ModernSpinner**: Animated loading indicator for async operations
- **ModernProgress**: Stylized progress bar with animation
- **FloatingActionButton**: Accessible floating action buttons
- **ModernFileUpload**: Enhanced file upload interface with drag-and-drop

### Responsive Design

The UI adapts seamlessly to different screen sizes:
- Fluid layouts using Flexbox and Grid
- Mobile-first approach with responsive breakpoints
- Touch-friendly interaction for mobile devices

### Theme and Styling

The application uses a carefully crafted color scheme:
- **Dark Mode**: Optimized for reduced eye strain
- **Accent Colors**: Strategic use of accent colors for visual hierarchy
- **CSS Variables**: Theme colors defined in globals.css for consistent styling

```css
/* From globals.css */
:root {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --primary: 252 100% 67%;
  --primary-foreground: 0 0% 98%;
  /* Additional theme variables... */
}
```

### Motion and Animation

Subtle animations enhance the user experience:
- Loading state animations
- Transition effects between states
- Micro-interactions for better feedback

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

## Troubleshooting

### Common Issues

1. **Backend won't start**
   - Ensure Python 3.8+ is installed and in your PATH
   - Check if port 8000 is already in use by another application
   - Verify all dependencies are installed: `pip install -r requirements.txt`
   - Look for error messages in the console output

2. **Frontend development server issues**
   - Ensure Node.js 18+ and npm are installed
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check if port 9002 is already in use
   - Verify your npm packages: `npm list --depth=0`

3. **API Connection Problems**
   - Verify the backend is running at http://localhost:8000
   - Check browser console for CORS errors
   - Ensure frontend API calls use the correct base URL

4. **Python Dependency Issues**
   - Use a virtual environment to isolate dependencies
   - If you encounter "module not found" errors, ensure all packages are installed:
     ```bash
     pip install -r requirements.txt
     ```

5. **AI Enhancement Not Working**
   - Verify your `.env` file contains a valid GEMINI_API_KEY
   - Check backend logs for API key validation errors
   - Ensure internet connectivity for API requests

### Getting Help

If you encounter issues not covered in this troubleshooting guide:
1. Check the Issues tab in the GitHub repository
2. Search for similar problems in the project discussions
3. Submit a new issue with detailed reproduction steps

## Contributing

We welcome contributions to ResumeForge! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a pull request

Please follow the project's coding style and include appropriate tests.

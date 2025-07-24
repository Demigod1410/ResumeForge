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

## Updated Components

### Backend Components
- **Environment Variables**: Improved loading from `.env` file with proper error handling
- **AI Service**: Enhanced error handling in `ai_service.py` for robust API integration
- **Resume Parser**: Added comprehensive error handling in `resume_parser_service.py`
- **Upload Router**: Fixed file handling and error reporting in `upload_router.py`
- **PDF Generation**: Improved `pdf_service.py` for better PDF generation

### Frontend Components
- **Animated Background**: Enhanced with particles, grid, and glow effects
- **Glass Card**: Modernized with glassmorphism design principles
- **Modern UI Components**:
  - `modern-spinner.tsx`: Animated loading indicator
  - `modern-progress.tsx`: Stylized progress bar
  - `modern-file-upload.tsx`: Enhanced file upload interface
  - `floating-action-button.tsx`: Accessible action buttons
- **Theme System**: Updated color scheme in `globals.css` for better contrast and visual appeal

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
  - Output: Parsed and AI-enhanced resume data
  - Implementation: Uses `ResumeParserService` to extract text from PDF/DOCX files and parse into structured data
  
  ```python
  @router.post("/upload-resume")
  async def upload_resume(file: UploadFile = File(...)):
      """
      Upload and process a resume file.
      """
      try:
          # Validate file type
          file_ext = os.path.splitext(file.filename)[1].lower() if file.filename else ""
          valid_extensions = [".pdf", ".docx"]
          
          # Process the file using ResumeParserService
          parser = ResumeParserService()
          parsed_resume = parser.parse_resume(tmp_path, file.filename)
          
          # Enhance with AI if available
          ai_service = AIService()
          enhanced_resume = ai_service.enhance_resume(parsed_resume)
          
          # Return enhanced resume data
          return JSONResponse(content={
              "message": f"Resume {file.filename} uploaded, enhanced, and saved successfully",
              "resume_id": resume_id,
              "parsed_resume": saved_resume
          })
      except Exception as e:
          logger.error(f"Error processing resume: {str(e)}")
          raise HTTPException(status_code=500, detail=f"Error processing resume: {str(e)}")
  ```

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

The AI enhancement service uses Google's Gemini AI to enhance resume content. The system has robust error handling and fallback mechanisms.

```python
class AIService:
    """
    Service class to handle AI operations like text generation and enhancement.
    Uses Google's Gemini API for text generation.
    """
    
    def __init__(self):
        """Initialize the AI service with API key."""
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            logger.warning("GEMINI_API_KEY not found in environment variables")
            self.is_available = False
        else:
            try:
                # Configure the Gemini API
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel('gemini-1.5-pro')
                self.is_available = True
                logger.info("AI service initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize AI service: {str(e)}")
                self.is_available = False
    
    def enhance_text(self, text: str, context: str = "") -> str:
        """
        Enhance text using AI to make it more professional and impactful.
        """
        if not self.is_available or not text:
            logger.warning("AI service not available or empty text provided, returning original text")
            return text
        
        try:
            prompt = f"""
            Please enhance the following text to be more professional, impactful, and suitable for a resume:
            
            ORIGINAL TEXT:
            {text}
            
            CONTEXT (if any):
            {context}
            
            Enhance the text to be:
            - More professional and polished
            - Action-oriented with strong verbs
            - Quantifiable with metrics where possible
            - Concise but comprehensive
            - Free of grammatical errors
            
            Provide ONLY the enhanced text without any additional comments or explanations.
            """
            
            response = self.model.generate_content(prompt)
            enhanced_text = response.text.strip()
            
            # If response is empty or failed, return the original
            if not enhanced_text:
                logger.warning("AI returned empty response, using original text")
                return text
                
            return enhanced_text
        except Exception as e:
            logger.error(f"Error enhancing text with AI: {str(e)}")
            return text  # Return original text if enhancement fails
```

### Enhancement Types

The AI service enhances different resume sections with specialized prompts:

1. **Summary**: Professional tone, achievements, core competencies
   ```python
   personal_info["summary"] = self.enhance_text(
       personal_info["summary"],
       "Professional summary highlighting key strengths and career focus"
   )
   ```

2. **Experience**: Action verbs, quantifiable results, industry-specific terminology
   ```python
   exp["description"] = self.enhance_text(
       exp["description"],
       "Work experience description highlighting achievements and responsibilities"
   )
   ```

3. **Education**: Academic achievements, relevant coursework, extracurricular highlights
4. **Skills**: Industry context, expertise level calibration, trending skill identification

### Configuration

The AI enhancement requires a Google Gemini API key in the `.env` file:

```
GEMINI_API_KEY=your_api_key_here
```

## Setup and Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+**: Required for the FastAPI backend. [Download Python](https://www.python.org/downloads/)
- **Node.js 18+ and npm**: Required for the Next.js frontend. [Download Node.js](https://nodejs.org/)
- **Git**: For cloning the repository. [Download Git](https://git-scm.com/downloads)

### Required Python Packages

```
fastapi==0.104.1
uvicorn==0.23.2
pydantic>=2.0.0,<3.0.0
python-multipart==0.0.6
python-dotenv==1.0.0
httpx==0.25.0
jinja2==3.1.2
google-generativeai==0.3.1
reportlab==4.0.4
weasyprint==60.1
xhtml2pdf==0.2.11
PyPDF2==3.0.1
pdfplumber==0.9.0
python-docx==0.8.11
```

### Required Node.js Packages

Key frontend dependencies:
- Next.js 15.3.3
- React 18.3.1
- TailwindCSS
- Radix UI components
- Framer Motion
- Zod for validation

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
class Particle {
  x: number;
  y: number;
  z: number;
  origX: number;
  origY: number;
  origZ: number;
  color: string;
  size: number;
  vz: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.z = Math.random() * 1000;
    this.origX = x;
    this.origY = y;
    this.origZ = this.z;
    this.color = `hsla(${220 + Math.random() * 40}, 80%, 60%, 0.8)`;
    this.size = 2;
    this.vz = Math.random() * 0.5;
  }

  update() {
    // Movement and animation logic
    this.z -= this.vz;
    if (this.z <= 0) {
      this.z = 1000;
    }
  }

  draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // Drawing logic with glow effects
  }
}
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
  ```tsx
  export function ModernSpinner({ size = "medium", className, ...props }: ModernSpinnerProps) {
    const sizeClasses = {
      small: "h-4 w-4",
      medium: "h-8 w-8", 
      large: "h-12 w-12"
    };
    
    return (
      <div 
        className={cn(
          "relative animate-spin text-primary",
          sizeClasses[size],
          className
        )} 
        {...props}
      >
        {/* Spinner implementation with gradient and glow effects */}
      </div>
    );
  }
  ```

- **ModernProgress**: Stylized progress bar with animation
  ```tsx
  export function ModernProgress({ value, max = 100, className, ...props }: ModernProgressProps) {
    const percent = value != null ? Math.min(Math.max(value, 0), max) / max : 0;
    
    return (
      <div className={cn("relative h-2 w-full overflow-hidden rounded-full bg-background/50 backdrop-blur", className)}>
        <div
          className="h-full w-full flex-1 bg-gradient-to-r from-primary/80 to-primary transition-all duration-300"
          style={{ transform: `translateX(-${100 - percent * 100}%)` }}
          {...props}
        />
      </div>
    );
  }
  ```

- **FloatingActionButton**: Accessible floating action buttons
- **ModernFileUpload**: Enhanced file upload interface with drag-and-drop with improved accessibility

### Responsive Design

The UI adapts seamlessly to different screen sizes:
- Fluid layouts using Flexbox and Grid
- Mobile-first approach with responsive breakpoints
- Touch-friendly interaction for mobile devices
- Dynamic content adjustments for different viewports

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

.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  --card: 0 0% 6%;
  --card-foreground: 0 0% 98%;
  --popover: 0 0% 6%;
  --popover-foreground: 0 0% 98%;
  --primary: 252 100% 67%;
  --primary-foreground: 0 0% 98%;
  --secondary: 240 5% 14.9%;
  --secondary-foreground: 0 0% 98%;
  --accent: 191 91% 58%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --muted: 240 5% 14.9%;
  --muted-foreground: 0 0% 63.9%;
  --border: 240 5% 14.9%;
}
```

### Motion and Animation

Subtle animations enhance the user experience:
- Loading state animations with pulsating effects
- Transition effects between states using framer-motion
- Micro-interactions for better feedback
- Custom utility classes:

```css
/* Animation utilities from globals.css */
.animate-glow {
  animation: glow 2s ease-in-out infinite alternate;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-in forwards;
}

.animate-pulse-slow {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes glow {
  from { box-shadow: 0 0 10px -5px rgba(var(--primary), 0.3); }
  to { box-shadow: 0 0 20px 5px rgba(var(--primary), 0.5); }
}
```

## Advanced Features

### PDF Generation

The API provides two endpoints for generating professionally formatted PDF resumes:

- **POST /api/generate-pdf** - Generates a PDF from a JSON resume
- **GET /api/resume/{resume_id}/pdf** - Gets a saved resume as a PDF

The PDF generation service uses ReportLab and WeasyPrint to create professional-looking documents:

```python
class PdfGenerationService:
    """
    Service for generating PDF resumes from resume data.
    Uses ReportLab or WeasyPrint depending on availability.
    """
    
    def __init__(self):
        """Initialize the PDF generation service."""
        # Check for PDF libraries
        self.reportlab_available = PDF_GENERATION_AVAILABLE
        
        if not self.reportlab_available:
            logger.warning("PDF generation libraries not available")
            
    def generate_pdf(self, resume_data: Dict[str, Any], template: str = "modern") -> BinaryIO:
        """
        Generate a PDF from resume data.
        
        Args:
            resume_data: Resume data to convert to PDF
            template: Template style to use
            
        Returns:
            PDF file as a binary stream
        """
        # Implementation with multiple template styles
```

### AI Enhancement with Gemini

The application integrates with Google's Gemini AI:

1. Obtain a Gemini API key from https://aistudio.google.com/
2. Add your API key to the `.env` file:
   ```
   GEMINI_API_KEY=AIzaSyDVJ-hfTgEsIPdKGknlKEjBCi_GqkqpPoE
   ```
3. Restart the server

The enhanced error handling in the AI service ensures graceful fallbacks if the API key is invalid or the Gemini service is unavailable:

```python
try:
    # Configure the Gemini API
    genai.configure(api_key=self.api_key)
    self.model = genai.GenerativeModel('gemini-1.5-pro')
    self.is_available = True
except Exception as e:
    logger.error(f"Failed to initialize AI service: {str(e)}")
    self.is_available = False
```

## Project Structure

```
resumeforge/
│
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── main.py          # FastAPI application entry point
│   │   ├── models/          # Pydantic data models
│   │   ├── routers/         # API endpoints
│   │   ├── services/        # Business logic
│   │   │   ├── ai_service.py        # AI enhancement with Gemini
│   │   │   ├── pdf_service.py       # PDF generation
│   │   │   ├── resume_parser_service.py  # Resume parsing
│   │   │   └── storage_service.py   # JSON storage
│   │   ├── templates/       # HTML templates for rendering
│   │   └── utils/           # Utility functions
│   │       └── env_loader.py  # Environment variable loading
│   ├── server.py            # Server entry point
│   └── data/                # Resume data storage
│
├── frontend/                # Next.js frontend
│   ├── app/
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Landing page
│   ├── components/
│   │   ├── ui/              # UI components
│   │   │   ├── animated-background.tsx
│   │   │   ├── glass-card.tsx
│   │   │   ├── modern-progress.tsx
│   │   │   ├── modern-spinner.tsx
│   │   │   ├── modern-file-upload.tsx
│   │   │   └── floating-action-button.tsx
│   │   ├── header.tsx       # Site header
│   │   └── resume-enhancer.tsx  # Resume upload & enhancement
│   └── src/
│       ├── ai/             # AI integration
│       └── lib/            # Utilities & API client
│
├── .env                     # Environment variables
├── requirements.txt         # Python dependencies
├── start_all.ps1            # Windows launcher script
└── README.md                # Project documentation
```

## Future Enhancements

1. ✅ Integration with Google Gemini AI for real AI-powered enhancements
2. ✅ PDF export functionality
3. ✅ Document parsing for PDF and DOCX files
4. ✅ Modern UI with vibrant animations and glassmorphism
5. Add authentication and user accounts
6. Support for multiple resume templates
7. AI-powered interview preparation suggestions
8. Resume analytics and improvement tracking

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

4. **500 Server Errors**
   - Check if the `.env` file exists in the project root with a valid `GEMINI_API_KEY`
   - Verify that all required Python packages are installed correctly
   - Check the server logs for detailed error messages
   - Ensure the `data` directory exists in the `backend` folder and has write permissions

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

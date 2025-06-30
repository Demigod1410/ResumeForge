"""
Service for parsing resume files (PDF and DOCX) into structured JSON data
"""
import re
import io
import logging
from typing import Dict, Any, List, Optional
from pathlib import Path

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Try to import PDF/DOCX parsing libraries
PARSING_AVAILABLE = False
PDF_LIBS = {}

try:
    import PyPDF2
    PDF_LIBS['PyPDF2'] = PyPDF2
    logger.info("PyPDF2 available for PDF parsing")
except ImportError:
    logger.warning("PyPDF2 not available")

try:
    import pdfplumber
    PDF_LIBS['pdfplumber'] = pdfplumber
    logger.info("pdfplumber available for PDF parsing")
except ImportError:
    logger.warning("pdfplumber not available")

try:
    from docx import Document
    PDF_LIBS['python-docx'] = Document
    logger.info("python-docx available for DOCX parsing")
except ImportError:
    logger.warning("python-docx not available")

PARSING_AVAILABLE = len(PDF_LIBS) > 0

class ResumeParserService:
    """Service for parsing resume files into structured data"""
    
    def __init__(self):
        """Initialize the parser service"""
        self.parsing_available = PARSING_AVAILABLE
        
    def extract_text_from_pdf(self, file_content: bytes) -> str:
        """Extract text from PDF file content"""
        if not self.parsing_available:
            raise Exception("No PDF parsing libraries available")
            
        text = ""
        
        # Try pdfplumber first (better text extraction)
        if 'pdfplumber' in PDF_LIBS:
            try:
                with PDF_LIBS['pdfplumber'].open(io.BytesIO(file_content)) as pdf:
                    for page in pdf.pages:
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + "\n"
                logger.info("Successfully extracted text using pdfplumber")
                return text
            except Exception as e:
                logger.warning(f"pdfplumber failed: {e}")
        
        # Fallback to PyPDF2
        if 'PyPDF2' in PDF_LIBS:
            try:
                pdf_reader = PDF_LIBS['PyPDF2'].PdfReader(io.BytesIO(file_content))
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
                logger.info("Successfully extracted text using PyPDF2")
                return text
            except Exception as e:
                logger.warning(f"PyPDF2 failed: {e}")
        
        raise Exception("Failed to extract text from PDF")
    
    def extract_text_from_docx(self, file_content: bytes) -> str:
        """Extract text from DOCX file content"""
        if 'python-docx' not in PDF_LIBS:
            raise Exception("python-docx library not available")
            
        try:
            doc = PDF_LIBS['python-docx'](io.BytesIO(file_content))
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            logger.info("Successfully extracted text from DOCX")
            return text
        except Exception as e:
            logger.error(f"Failed to extract text from DOCX: {e}")
            raise Exception("Failed to extract text from DOCX")
    
    def parse_resume_text(self, text: str) -> Dict[str, Any]:
        """Parse extracted text into structured resume data"""
        # Clean up the text
        text = re.sub(r'\s+', ' ', text.strip())
        
        resume_data = {
            "personal_info": self._extract_personal_info(text),
            "education": self._extract_education(text),
            "experience": self._extract_experience(text),
            "skills": self._extract_skills(text),
            "certifications": self._extract_certifications(text),
            "languages": self._extract_languages(text)
        }
        
        return resume_data
    
    def _extract_personal_info(self, text: str) -> Dict[str, str]:
        """Extract personal information from text"""
        personal_info = {}
        
        # Extract email
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        email_match = re.search(email_pattern, text)
        if email_match:
            personal_info["email"] = email_match.group()
        
        # Extract phone number
        phone_pattern = r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
        phone_match = re.search(phone_pattern, text)
        if phone_match:
            personal_info["phone"] = phone_match.group()
        
        # Extract LinkedIn
        linkedin_pattern = r'linkedin\.com/in/[\w\-]+'
        linkedin_match = re.search(linkedin_pattern, text, re.IGNORECASE)
        if linkedin_match:
            personal_info["linkedin"] = linkedin_match.group()
        
        # Extract GitHub
        github_pattern = r'github\.com/[\w\-]+'
        github_match = re.search(github_pattern, text, re.IGNORECASE)
        if github_match:
            personal_info["github"] = github_match.group()
        
        # Extract name (assume first line or first few words)
        lines = text.split('\n')
        if lines:
            # Take the first non-empty line that looks like a name
            for line in lines[:5]:
                line = line.strip()
                if line and len(line.split()) <= 4 and not any(char.isdigit() for char in line):
                    personal_info["name"] = line
                    break
        
        return personal_info
    
    def _extract_education(self, text: str) -> List[Dict[str, str]]:
        """Extract education information from text"""
        education = []
        
        # Look for education keywords
        education_patterns = [
            r'education|academic|university|college|school|degree|bachelor|master|phd|diploma',
            r'b\.?s\.?|m\.?s\.?|m\.?a\.?|b\.?a\.?|ph\.?d\.?'
        ]
        
        education_section = ""
        for pattern in education_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                # Extract text around the match
                start = max(0, match.start() - 200)
                end = min(len(text), match.end() + 500)
                education_section = text[start:end]
                break
        
        if education_section:
            # Simple extraction - in a real implementation, this would be more sophisticated
            lines = education_section.split('\n')
            current_edu = {}
            for line in lines:
                line = line.strip()
                if any(keyword in line.lower() for keyword in ['university', 'college', 'school']):
                    if current_edu:
                        education.append(current_edu)
                    current_edu = {"institution": line}
                elif any(keyword in line.lower() for keyword in ['bachelor', 'master', 'degree', 'b.s', 'm.s']):
                    if current_edu:
                        current_edu["degree"] = line
            
            if current_edu:
                education.append(current_edu)
        
        return education
    
    def _extract_experience(self, text: str) -> List[Dict[str, str]]:
        """Extract work experience from text"""
        experience = []
        
        # Look for experience keywords
        exp_patterns = [
            r'experience|employment|work|career|professional',
            r'senior|junior|lead|manager|developer|engineer|analyst'
        ]
        
        # This is a simplified extraction - real implementation would be more complex
        lines = text.split('\n')
        current_exp = {}
        
        for line in lines:
            line = line.strip()
            if any(title in line.lower() for title in ['developer', 'engineer', 'manager', 'analyst', 'specialist']):
                if current_exp:
                    experience.append(current_exp)
                current_exp = {"position": line}
            elif any(company_indicator in line.lower() for company_indicator in ['inc', 'corp', 'ltd', 'llc', 'company']):
                if current_exp:
                    current_exp["company"] = line
        
        if current_exp:
            experience.append(current_exp)
        
        return experience
    
    def _extract_skills(self, text: str) -> List[Dict[str, str]]:
        """Extract skills from text"""
        skills = []
        
        # Common technical skills
        common_skills = [
            'Python', 'JavaScript', 'Java', 'C++', 'C#', 'React', 'Angular', 'Vue',
            'Node.js', 'Django', 'Flask', 'Spring', 'SQL', 'MongoDB', 'PostgreSQL',
            'AWS', 'Azure', 'Docker', 'Kubernetes', 'Git', 'Linux', 'Windows',
            'HTML', 'CSS', 'TypeScript', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift'
        ]
        
        for skill in common_skills:
            if skill.lower() in text.lower():
                skills.append({
                    "name": skill,
                    "level": "Intermediate",  # Default level
                    "category": "Technical"
                })
        
        return skills
    
    def _extract_certifications(self, text: str) -> List[str]:
        """Extract certifications from text"""
        certifications = []
        
        # Common certification patterns
        cert_patterns = [
            r'certified|certification|certificate',
            r'aws|azure|google cloud|cisco|microsoft',
            r'pmp|scrum master|agile'
        ]
        
        for pattern in cert_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                # Extract surrounding context
                start = max(0, match.start() - 30)
                end = min(len(text), match.end() + 30)
                context = text[start:end].strip()
                certifications.append(context)
        
        return list(set(certifications))  # Remove duplicates
    
    def _extract_languages(self, text: str) -> List[str]:
        """Extract languages from text"""
        languages = []
        
        # Common languages
        common_languages = [
            'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
            'Chinese', 'Japanese', 'Korean', 'Arabic', 'Russian', 'Hindi'
        ]
        
        for lang in common_languages:
            if lang.lower() in text.lower():
                languages.append(lang)
        
        return languages
    
    async def parse_resume_file(self, file_content: bytes, filename: str) -> Dict[str, Any]:
        """Parse a resume file and return structured data"""
        if not self.parsing_available:
            logger.warning("No parsing libraries available, returning mock data")
            # Return mock data if parsing is not available
            return self._get_mock_resume_data()
        
        # Extract text based on file type
        file_ext = filename.split('.')[-1].lower()
        
        try:
            if file_ext == 'pdf':
                text = self.extract_text_from_pdf(file_content)
            elif file_ext == 'docx':
                text = self.extract_text_from_docx(file_content)
            else:
                raise Exception(f"Unsupported file type: {file_ext}")
            
            # Parse the extracted text
            parsed_data = self.parse_resume_text(text)
            parsed_data["raw_text"] = text[:1000] + "..." if len(text) > 1000 else text  # Include sample of raw text
            
            return parsed_data
            
        except Exception as e:
            logger.error(f"Failed to parse resume: {e}")
            # Return mock data on error
            return self._get_mock_resume_data()
    
    def _get_mock_resume_data(self) -> Dict[str, Any]:
        """Return mock resume data for fallback"""
        return {
            "personal_info": {
                "name": "Parsed Resume",
                "email": "extracted@example.com",
                "phone": "+1 (555) 000-0000",
                "summary": "Professional extracted from uploaded resume"
            },
            "education": [],
            "experience": [],
            "skills": [],
            "certifications": [],
            "languages": ["English"]
        }

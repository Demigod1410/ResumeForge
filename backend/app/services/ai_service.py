"""
Service for enhancing resume content using AI (Gemini AI or mocked responses)
"""
from typing import Dict, Any, Optional
from datetime import datetime
import os
import json
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Try to import the Google Generative AI library
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
    logger.info("Google Generative AI (Gemini) module loaded successfully")
except ImportError:
    GEMINI_AVAILABLE = False
    logger.warning("Google Generative AI (Gemini) module not available. Using mock responses.")

class AiEnhancementService:
    """
    Service class to handle AI-based content enhancement for resumes.
    Uses Google's Gemini AI if available, otherwise falls back to mocked responses.
    """
    
    def __init__(self):
        """Initialize the service and configure Gemini if available"""
        self.gemini_configured = False
        
        # Try to load API key from environment variables
        api_key = os.getenv("GEMINI_API_KEY")
        
        if GEMINI_AVAILABLE and api_key and api_key != "your_api_key_here":
            try:
                # Configure the Generative AI library with the API key
                genai.configure(api_key=api_key)
                self.gemini_configured = True
                logger.info("Gemini AI configured successfully")
            except Exception as e:
                logger.error(f"Failed to configure Gemini AI: {e}")
                self.gemini_configured = False
        elif not api_key or api_key == "your_api_key_here":
            logger.warning("No valid Gemini API key found in environment variables")
        
    def enhance_content(self, section: str, content: str) -> str:
        """
        Enhance the given content based on the section type.
        Uses Gemini AI if available, otherwise falls back to mocked responses.
        
        Args:
            section (str): The section of the resume (e.g., 'summary', 'experience', 'education')
            content (str): The original content to enhance
            
        Returns:
            str: The enhanced content
        """
        # Try to use Gemini AI first if configured
        if self.gemini_configured:
            try:
                return self.integrate_gemini_ai(section, content)
            except Exception as e:
                logger.error(f"Error using Gemini AI: {e}")
                logger.info("Falling back to mock responses")
        
        # Fall back to mock responses
        return self._get_mock_enhancement(section, content)
    
    def _get_mock_enhancement(self, section: str, content: str) -> str:
        """
        Generate mock enhancements based on the section type.
        
        Args:
            section (str): The section type
            content (str): The original content
            
        Returns:
            str: The enhanced content (mocked)
        """
        # Mock enhancements based on the section type
        if section.lower() == "summary":
            return f"{content} Demonstrated expertise in leading cross-functional teams and delivering high-impact solutions that drive business growth and operational efficiency."
        
        elif section.lower() == "experience":
            return f"{content} Leveraged data-driven approaches to optimize processes resulting in 25% increase in efficiency and substantial cost reduction."
        
        elif section.lower() == "education":
            return f"{content} Graduated with honors. Participated in relevant research projects and extracurricular activities."
        
        elif section.lower() == "skills":
            return f"{content} with proven application in enterprise-level projects and agile development environments."
        
        else:
            # For unrecognized sections, return slightly enhanced content
            return f"{content} (Enhanced with professional terminology and concrete achievements)"

    def integrate_gemini_ai(self, section: str, content: str, api_key: Optional[str] = None) -> str:
        """
        Integrate with Google's Gemini AI to enhance resume content.
        
        Args:
            section (str): The section of the resume to enhance
            content (str): The original content to enhance
            api_key (Optional[str]): API key for Gemini (overrides env variable if provided)
            
        Returns:
            str: The enhanced content
        """
        if not GEMINI_AVAILABLE:
            raise ImportError("Google Generative AI module not available")
        
        # Use provided API key if given, otherwise use the one from initialization
        if api_key:
            genai.configure(api_key=api_key)
        
        # Select the appropriate model (Gemini Pro is good for text generation)
        model = genai.GenerativeModel('gemini-1.5-pro')
        
        # Create section-specific prompts for better results
        prompts = {
            "summary": f"""
                You are a professional resume writer. Enhance the following professional summary to be more 
                impactful and showcase achievements and skills effectively. Use concrete metrics where possible.
                Keep the enhanced version professional and concise. Don't add fictional details.
                
                Original summary: "{content}"
                
                Enhanced summary:
            """,
            "experience": f"""
                You are a professional resume writer. Enhance the following work experience description to focus 
                on achievements and impact using strong action verbs and quantifiable results. Make it more concise 
                and professional. Don't add fictional details.
                
                Original description: "{content}"
                
                Enhanced description:
            """,
            "education": f"""
                You are a professional resume writer. Enhance the following education description to highlight 
                academic achievements, relevant coursework, or projects that demonstrate skills. Don't add fictional details.
                
                Original description: "{content}"
                
                Enhanced description:
            """,
            "skills": f"""
                You are a professional resume writer. Enhance the following skills list to be more specific 
                about proficiency levels and application contexts. Don't add fictional details.
                
                Original skills: "{content}"
                
                Enhanced skills:
            """,
            "default": f"""
                You are a professional resume writer. Enhance the following resume content to be more impactful, 
                professional, and achievement-oriented. Use industry-standard terminology. Don't add fictional details.
                
                Original content: "{content}"
                
                Enhanced content:
            """
        }
        
        # Use section-specific prompt or default if not found
        prompt = prompts.get(section.lower(), prompts["default"])
        
        # Generate the enhanced content
        response = model.generate_content(prompt)
        
        # Extract and return the enhanced text
        enhanced_text = response.text.strip()
        
        # Clean up any markdown or formatting that might be in the response
        enhanced_text = enhanced_text.replace('```', '').replace('Enhanced description:', '').replace('Enhanced summary:', '').replace('Enhanced skills:', '').replace('Enhanced content:', '').strip()
        
        return enhanced_text

    def enhance_entire_resume(self, resume_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Enhance an entire resume using Gemini AI
        
        Args:
            resume_data (Dict[str, Any]): The parsed resume data
            
        Returns:
            Dict[str, Any]: The enhanced resume data
        """
        enhanced_resume = resume_data.copy()
        
        try:
            # Enhance personal info summary if available
            if "personal_info" in enhanced_resume and "summary" in enhanced_resume["personal_info"]:
                if enhanced_resume["personal_info"]["summary"]:
                    enhanced_resume["personal_info"]["summary"] = self.enhance_content(
                        "summary", enhanced_resume["personal_info"]["summary"]
                    )
            
            # Enhance experience descriptions
            if "experience" in enhanced_resume:
                for i, exp in enumerate(enhanced_resume["experience"]):
                    if "description" in exp and exp["description"]:
                        enhanced_resume["experience"][i]["description"] = self.enhance_content(
                            "experience", exp["description"]
                        )
                    
                    # Enhance achievements if present
                    if "achievements" in exp and isinstance(exp["achievements"], list):
                        enhanced_achievements = []
                        for achievement in exp["achievements"]:
                            enhanced_achievement = self.enhance_content("experience", achievement)
                            enhanced_achievements.append(enhanced_achievement)
                        enhanced_resume["experience"][i]["achievements"] = enhanced_achievements
            
            # Enhance education descriptions
            if "education" in enhanced_resume:
                for i, edu in enumerate(enhanced_resume["education"]):
                    if "description" in edu and edu["description"]:
                        enhanced_resume["education"][i]["description"] = self.enhance_content(
                            "education", edu["description"]
                        )
            
            # Add AI enhancement metadata
            enhanced_resume["ai_enhanced"] = True
            enhanced_resume["enhancement_timestamp"] = str(datetime.now())
            
            logger.info("Successfully enhanced entire resume with AI")
            return enhanced_resume
            
        except Exception as e:
            logger.error(f"Error enhancing resume: {e}")
            # Return original resume if enhancement fails
            enhanced_resume["ai_enhanced"] = False
            enhanced_resume["enhancement_error"] = str(e)
            return enhanced_resume
    
    def generate_improved_summary(self, resume_data: Dict[str, Any]) -> str:
        """
        Generate an improved professional summary based on the entire resume
        
        Args:
            resume_data (Dict[str, Any]): The complete resume data
            
        Returns:
            str: An improved professional summary
        """
        if not self.gemini_configured:
            return self._generate_mock_summary(resume_data)
        
        try:
            # Extract key information from resume
            name = resume_data.get("personal_info", {}).get("name", "Professional")
            experience = resume_data.get("experience", [])
            education = resume_data.get("education", [])
            skills = resume_data.get("skills", [])
            
            # Build context for AI
            context = f"Resume for {name}.\n"
            
            if experience:
                context += "Experience:\n"
                for exp in experience[:3]:  # Top 3 experiences
                    context += f"- {exp.get('position', '')} at {exp.get('company', '')}\n"
            
            if education:
                context += "Education:\n"
                for edu in education[:2]:  # Top 2 education entries
                    context += f"- {edu.get('degree', '')} from {edu.get('institution', '')}\n"
            
            if skills:
                skill_names = [skill.get("name", "") for skill in skills[:10]]  # Top 10 skills
                context += f"Key skills: {', '.join(skill_names)}\n"
            
            prompt = f"""
                You are a professional resume writer. Based on the following resume information, 
                create a compelling professional summary that highlights key achievements, skills, and career progression.
                The summary should be 3-4 sentences long, use strong action words, and focus on value proposition.
                
                {context}
                
                Professional Summary:
            """
            
            model = genai.GenerativeModel('gemini-1.5-pro')
            response = model.generate_content(prompt)
            
            summary = response.text.strip()
            summary = summary.replace('Professional Summary:', '').strip()
            
            return summary
            
        except Exception as e:
            logger.error(f"Error generating improved summary: {e}")
            return self._generate_mock_summary(resume_data)
    
    def _generate_mock_summary(self, resume_data: Dict[str, Any]) -> str:
        """Generate a mock improved summary when AI is not available"""
        name = resume_data.get("personal_info", {}).get("name", "Professional")
        return f"Experienced professional with demonstrated expertise in technology and leadership. Proven track record of delivering high-impact solutions and driving business growth through innovative approaches and cross-functional collaboration."

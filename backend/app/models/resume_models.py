from typing import List, Optional
from pydantic import BaseModel

class Education(BaseModel):
    """Education entry model for resume."""
    institution: str
    degree: str
    field_of_study: str
    start_date: str
    end_date: Optional[str] = None
    description: Optional[str] = None

class Experience(BaseModel):
    """Work experience entry model for resume."""
    company: str
    position: str
    start_date: str
    end_date: Optional[str] = None
    description: Optional[str] = None
    achievements: Optional[List[str]] = None

class Skill(BaseModel):
    """Skill entry model for resume."""
    name: str
    level: Optional[str] = None
    category: Optional[str] = None

class PersonalInfo(BaseModel):
    """Personal information model for resume."""
    name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    website: Optional[str] = None
    summary: Optional[str] = None

class Resume(BaseModel):
    """Complete resume model."""
    personal_info: PersonalInfo
    education: List[Education]
    experience: List[Experience]
    skills: List[Skill]
    certifications: Optional[List[str]] = None
    languages: Optional[List[str]] = None
    projects: Optional[List[dict]] = None
    publications: Optional[List[dict]] = None
    references: Optional[List[dict]] = None

class AiEnhanceRequest(BaseModel):
    """Request model for AI enhancement."""
    section: str
    content: str

class AiEnhanceResponse(BaseModel):
    """Response model for AI enhancement."""
    enhanced_content: str

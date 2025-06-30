"""
Router for AI-enhancement related endpoints
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any
import os
from ..models.resume_models import AiEnhanceRequest, AiEnhanceResponse
from ..services.ai_service import AiEnhancementService


# Create router for AI enhancement endpoints
router = APIRouter(tags=["AI Enhancement"])

# Create instance of AI enhancement service
ai_service = AiEnhancementService()

# Define model for AI status response
class AiStatusResponse(BaseModel):
    """Response model for AI status."""
    gemini_available: bool
    gemini_configured: bool
    using_mock: bool


@router.post("/ai-enhance", response_model=AiEnhanceResponse)
async def enhance_content(request: AiEnhanceRequest) -> AiEnhanceResponse:
    """
    Enhance resume content using AI.
    
    Args:
        request (AiEnhanceRequest): The request containing section and content to enhance
        
    Returns:
        AiEnhanceResponse: The enhanced content
        
    Raises:
        HTTPException: If the section is invalid or content is empty
    """
    # Validate input
    if not request.section or not request.content:
        raise HTTPException(
            status_code=400,
            detail="Both 'section' and 'content' fields are required and must not be empty"
        )
    
    # Valid sections (can be extended as needed)
    valid_sections = ["summary", "experience", "education", "skills", "projects", "certifications"]
    
    if request.section.lower() not in [s.lower() for s in valid_sections]:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid section. Must be one of: {', '.join(valid_sections)}"
        )
    
    # Get enhanced content from AI service
    enhanced_content = ai_service.enhance_content(request.section, request.content)
    
    # Return response
    return AiEnhanceResponse(enhanced_content=enhanced_content)


@router.get("/ai-status", response_model=AiStatusResponse)
async def get_ai_status() -> AiStatusResponse:
    """
    Get the current status of AI enhancement capabilities.
    
    Returns:
        AiStatusResponse: The current AI status
    """
    try:
        import google.generativeai as genai
        gemini_available = True
    except ImportError:
        gemini_available = False
    
    return AiStatusResponse(
        gemini_available=gemini_available,
        gemini_configured=ai_service.gemini_configured,
        using_mock=not ai_service.gemini_configured
    )


@router.get("/ai-sections")
async def get_ai_sections() -> Dict[str, Any]:
    """
    Get the list of resume sections that can be enhanced with AI.
    
    Returns:
        Dict[str, Any]: List of valid sections and their descriptions
    """
    return {
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

"""
Router for resume storage operations
"""
from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException
from ..models.resume_models import Resume
from ..services.storage_service import ResumeStorageService

# Create router for resume storage endpoints
router = APIRouter(tags=["Resume Storage"])

# Create instance of resume storage service
storage_service = ResumeStorageService()


@router.post("/save-resume", response_model=Dict[str, Any])
async def save_resume(resume: Resume) -> Dict[str, Any]:
    """
    Save a complete resume.
    
    Args:
        resume (Resume): The complete resume data
        
    Returns:
        Dict[str, Any]: The saved resume with metadata (id, timestamp)
    """
    # Convert Pydantic model to dict
    resume_dict = resume.model_dump()
    
    # Save resume using storage service
    saved_resume = storage_service.save_resume(resume_dict)
    
    return saved_resume


@router.get("/resume/{resume_id}", response_model=Dict[str, Any])
async def get_resume(resume_id: str) -> Dict[str, Any]:
    """
    Retrieve a resume by ID.
    
    Args:
        resume_id (str): ID of the resume to retrieve
        
    Returns:
        Dict[str, Any]: The resume data
        
    Raises:
        HTTPException: If resume is not found
    """
    resume = storage_service.get_resume(resume_id)
    
    if resume is None:
        raise HTTPException(
            status_code=404,
            detail=f"Resume with ID {resume_id} not found"
        )
    
    return resume


@router.get("/resumes", response_model=List[Dict[str, Any]])
async def list_resumes() -> List[Dict[str, Any]]:
    """
    List all saved resumes with basic metadata.
    
    Returns:
        List[Dict[str, Any]]: List of resume metadata objects
    """
    return storage_service.list_resumes()

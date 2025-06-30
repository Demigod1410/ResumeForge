"""
Router for file upload operations
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Dict, Any
from fastapi.responses import JSONResponse
from ..services.resume_parser_service import ResumeParserService
from ..services.ai_service import AiEnhancementService
from ..services.storage_service import ResumeStorageService
import logging
import os
import os

# Setup logging
logger = logging.getLogger(__name__)

# Create router for file upload endpoints
router = APIRouter(tags=["File Upload"])


@router.post("/upload-resume", response_model=Dict[str, Any])
async def upload_resume(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Upload a resume file (.pdf or .docx), parse it, and enhance it with AI.
    
    This endpoint:
    1. Validates the file format
    2. Extracts text from PDF/DOCX
    3. Parses the text into structured JSON
    4. Uses Gemini AI to enhance the resume content
    5. Returns the enhanced resume data
    
    Args:
        file (UploadFile): The uploaded resume file
        
    Returns:
        Dict[str, Any]: Enhanced resume data in JSON format
        
    Raises:
        HTTPException: If file format is not supported or processing fails
    """
    # Check file extension (only allow PDF and DOCX)
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No filename provided"
        )
    
    file_ext = file.filename.split('.')[-1].lower()
    if file_ext not in ["pdf", "docx"]:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are supported"
        )
    
    try:
        # Read file content
        file_content = await file.read()
        logger.info(f"Processing uploaded file: {file.filename} ({len(file_content)} bytes)")
        
        # Initialize services
        parser_service = ResumeParserService()
        ai_service = AiEnhancementService()
        storage_service = ResumeStorageService()
        
        # Parse the resume file
        logger.info("Parsing resume content...")
        parsed_resume = await parser_service.parse_resume_file(file_content, file.filename)
        
        # Enhance the resume with AI
        logger.info("Enhancing resume with AI...")
        enhanced_resume = ai_service.enhance_entire_resume(parsed_resume)
        
        # Generate an improved summary
        logger.info("Generating improved summary...")
        improved_summary = ai_service.generate_improved_summary(enhanced_resume)
        if improved_summary:
            enhanced_resume["personal_info"]["summary"] = improved_summary
        
        # Add metadata about the original file
        enhanced_resume["original_filename"] = file.filename
        enhanced_resume["file_size"] = len(file_content)
        enhanced_resume["file_type"] = file_ext
        
        # Save the enhanced resume to storage
        logger.info("Saving enhanced resume to storage...")
        saved_resume = storage_service.save_resume(enhanced_resume)
        
        logger.info(f"Successfully processed and saved resume: {file.filename} with ID: {saved_resume['id']}")
        
        return JSONResponse(
            content={
                "message": f"Resume {file.filename} uploaded, enhanced, and saved successfully",
                "resume_id": saved_resume["id"],
                "original_filename": file.filename,
                "file_size": len(file_content),
                "ai_enhanced": enhanced_resume.get("ai_enhanced", False),
                "saved_location": f"data/resume_{saved_resume['id']}.json",
                "parsed_resume": enhanced_resume,
                "processing_info": {
                    "parser_available": parser_service.parsing_available,
                    "ai_configured": ai_service.gemini_configured,
                    "enhancement_timestamp": enhanced_resume.get("enhancement_timestamp"),
                    "storage_timestamp": saved_resume.get("last_updated")
                }
            }
        )
        
    except Exception as e:
        logger.error(f"Error processing resume {file.filename}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process resume: {str(e)}"
        )


@router.get("/resumes", response_model=Dict[str, Any])
async def list_saved_resumes() -> Dict[str, Any]:
    """
    List all saved resumes with basic metadata.
    
    Returns:
        Dict[str, Any]: List of saved resumes and storage information
    """
    try:
        storage_service = ResumeStorageService()
        resumes = storage_service.list_resumes()
        
        # Get the actual storage path
        from ..services.storage_service import DATA_DIR
        
        return JSONResponse(
            content={
                "message": f"Found {len(resumes)} saved resumes",
                "storage_location": DATA_DIR,
                "resumes": resumes
            }
        )
        
    except Exception as e:
        logger.error(f"Error listing resumes: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to list resumes: {str(e)}"
        )


@router.get("/resumes/{resume_id}", response_model=Dict[str, Any])
async def get_saved_resume(resume_id: str) -> Dict[str, Any]:
    """
    Retrieve a specific saved resume by ID.
    
    Args:
        resume_id (str): The ID of the resume to retrieve
        
    Returns:
        Dict[str, Any]: The complete resume data
    """
    try:
        storage_service = ResumeStorageService()
        resume = storage_service.get_resume(resume_id)
        
        if not resume:
            raise HTTPException(
                status_code=404,
                detail=f"Resume with ID {resume_id} not found"
            )
        
        from ..services.storage_service import DATA_DIR
        file_path = os.path.join(DATA_DIR, f"resume_{resume_id}.json")
        
        return JSONResponse(
            content={
                "message": "Resume retrieved successfully",
                "resume_id": resume_id,
                "file_location": file_path,
                "resume_data": resume
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving resume {resume_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve resume: {str(e)}"
        )

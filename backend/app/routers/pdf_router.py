"""
Router for PDF generation endpoints
"""
from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import StreamingResponse
from typing import Dict, Any
import io
import os
from ..models.resume_models import Resume
from ..services.pdf_service import PdfGenerationService
from ..services.storage_service import ResumeStorageService

# Create router for PDF generation endpoints
router = APIRouter(tags=["PDF Generation"])

# Create instances of services
pdf_service = PdfGenerationService()
storage_service = ResumeStorageService()


@router.post("/generate-pdf", response_class=StreamingResponse)
async def generate_pdf_from_json(resume: Resume) -> StreamingResponse:
    """
    Generate a PDF from the provided resume data.
    
    Args:
        resume (Resume): The resume data to convert to PDF
        
    Returns:
        StreamingResponse: The generated PDF file
        
    Raises:
        HTTPException: If PDF generation fails
    """
    # Check if PDF generation is available
    if not pdf_service.pdf_available:
        raise HTTPException(
            status_code=501,
            detail="PDF generation is not available. Required libraries are not installed."
        )
    
    # Convert Pydantic model to dict
    resume_dict = resume.model_dump()
    
    # Generate PDF
    pdf_data = pdf_service.generate_resume_pdf(resume_dict)
    
    if not pdf_data:
        raise HTTPException(
            status_code=500,
            detail="Failed to generate PDF"
        )
    
    # Return PDF as StreamingResponse
    return StreamingResponse(
        io.BytesIO(pdf_data),
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=resume.pdf"}
    )


@router.get("/resume/{resume_id}/pdf", response_class=StreamingResponse)
async def get_resume_as_pdf(resume_id: str) -> StreamingResponse:
    """
    Get a saved resume as a PDF.
    
    Args:
        resume_id (str): ID of the resume to convert to PDF
        
    Returns:
        StreamingResponse: The generated PDF file
        
    Raises:
        HTTPException: If resume is not found or PDF generation fails
    """
    # Check if PDF generation is available
    if not pdf_service.pdf_available:
        raise HTTPException(
            status_code=501,
            detail="PDF generation is not available. Required libraries are not installed."
        )
    
    # Get resume data
    resume_data = storage_service.get_resume(resume_id)
    
    if resume_data is None:
        raise HTTPException(
            status_code=404,
            detail=f"Resume with ID {resume_id} not found"
        )
    
    # Generate PDF
    pdf_data = pdf_service.generate_resume_pdf(resume_data)
    
    if not pdf_data:
        raise HTTPException(
            status_code=500,
            detail="Failed to generate PDF"
        )
    
    # Get name for filename (or use ID if name not available)
    name = resume_data.get("personal_info", {}).get("name", "resume")
    filename = f"{name.replace(' ', '_').lower()}_{resume_id}.pdf"
    
    # Return PDF as StreamingResponse
    return StreamingResponse(
        io.BytesIO(pdf_data),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

"""
Service for PDF generation from resume data
"""
import os
import io
import logging
from datetime import datetime
from typing import Dict, Any, Optional, Union, BinaryIO
from pathlib import Path

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Try to import PDF libraries
PDF_GENERATION_AVAILABLE = False
PDF_LIBRARY = None

try:
    from reportlab.lib.pagesizes import letter
    from reportlab.lib import colors
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    
    PDF_GENERATION_AVAILABLE = True
    PDF_LIBRARY = "reportlab"
    logger.info("Using ReportLab for PDF generation")
except ImportError:
    logger.warning("ReportLab not available")
    try:
        from xhtml2pdf import pisa
        
        PDF_GENERATION_AVAILABLE = True
        PDF_LIBRARY = "xhtml2pdf"
        logger.info("Using xhtml2pdf for PDF generation")
    except ImportError:
        logger.warning("xhtml2pdf not available")
        try:
            from weasyprint import HTML
            
            PDF_GENERATION_AVAILABLE = True
            PDF_LIBRARY = "weasyprint"
            logger.info("Using WeasyPrint for PDF generation")
        except ImportError:
            logger.warning("WeasyPrint not available")
            logger.error("No PDF generation libraries available")


class PdfGenerationService:
    """Service for generating PDF files from resume data."""
    
    def __init__(self):
        """Initialize the PDF generation service."""
        self.pdf_available = PDF_GENERATION_AVAILABLE
        self.pdf_library = PDF_LIBRARY
        
        # Create directory for storing PDF templates
        templates_dir = Path(__file__).parent.parent / "templates"
        templates_dir.mkdir(exist_ok=True)
    
    def generate_resume_pdf(self, resume_data: Dict[str, Any]) -> Optional[bytes]:
        """
        Generate a PDF from resume data.
        
        Args:
            resume_data (Dict[str, Any]): The resume data to convert to PDF
            
        Returns:
            Optional[bytes]: The generated PDF as bytes, or None if generation failed
        """
        if not self.pdf_available:
            logger.error("PDF generation is not available")
            return None
        
        # Use the appropriate PDF generation method based on available library
        if self.pdf_library == "reportlab":
            return self._generate_with_reportlab(resume_data)
        elif self.pdf_library == "xhtml2pdf":
            return self._generate_with_xhtml2pdf(resume_data)
        elif self.pdf_library == "weasyprint":
            return self._generate_with_weasyprint(resume_data)
        else:
            logger.error("No PDF generation method available")
            return None
    
    def _generate_with_reportlab(self, resume_data: Dict[str, Any]) -> bytes:
        """
        Generate PDF using ReportLab.
        
        Args:
            resume_data (Dict[str, Any]): Resume data
            
        Returns:
            bytes: PDF content as bytes
        """
        # Create a buffer for the PDF
        buffer = io.BytesIO()
        
        # Get personal info
        personal_info = resume_data.get("personal_info", {})
        name = personal_info.get("name", "")
        email = personal_info.get("email", "")
        phone = personal_info.get("phone", "")
        address = personal_info.get("address", "")
        linkedin = personal_info.get("linkedin", "")
        github = personal_info.get("github", "")
        summary = personal_info.get("summary", "")
        
        # Create the PDF document
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        styles = getSampleStyleSheet()
        
        # Create custom styles
        title_style = ParagraphStyle(
            'Title',
            parent=styles['Heading1'],
            fontSize=18,
            spaceAfter=12
        )
        
        heading_style = ParagraphStyle(
            'Heading',
            parent=styles['Heading2'],
            fontSize=14,
            spaceAfter=6,
            spaceBefore=12
        )
        
        normal_style = styles['Normal']
        
        # Create content elements
        content = []
        
        # Add name as title
        content.append(Paragraph(name, title_style))
        
        # Add contact info
        contact_info = []
        if email:
            contact_info.append(f"Email: {email}")
        if phone:
            contact_info.append(f"Phone: {phone}")
        if address:
            contact_info.append(f"Address: {address}")
        if linkedin:
            contact_info.append(f"LinkedIn: {linkedin}")
        if github:
            contact_info.append(f"GitHub: {github}")
        
        contact_text = " | ".join(contact_info)
        content.append(Paragraph(contact_text, normal_style))
        content.append(Spacer(1, 12))
        
        # Add summary
        if summary:
            content.append(Paragraph("Professional Summary", heading_style))
            content.append(Paragraph(summary, normal_style))
            content.append(Spacer(1, 12))
        
        # Add experience
        experience = resume_data.get("experience", [])
        if experience:
            content.append(Paragraph("Professional Experience", heading_style))
            
            for exp in experience:
                company = exp.get("company", "")
                position = exp.get("position", "")
                start_date = exp.get("start_date", "")
                end_date = exp.get("end_date", "Present")
                description = exp.get("description", "")
                achievements = exp.get("achievements", [])
                
                exp_title = f"<b>{position}</b> at <b>{company}</b>"
                content.append(Paragraph(exp_title, styles['Heading3']))
                
                date_range = f"{start_date} - {end_date}"
                content.append(Paragraph(date_range, normal_style))
                content.append(Paragraph(description, normal_style))
                
                if achievements:
                    content.append(Paragraph("<b>Achievements:</b>", normal_style))
                    for achievement in achievements:
                        content.append(Paragraph(f"• {achievement}", normal_style))
                
                content.append(Spacer(1, 6))
        
        # Add education
        education = resume_data.get("education", [])
        if education:
            content.append(Paragraph("Education", heading_style))
            
            for edu in education:
                institution = edu.get("institution", "")
                degree = edu.get("degree", "")
                field = edu.get("field_of_study", "")
                start_date = edu.get("start_date", "")
                end_date = edu.get("end_date", "Present")
                description = edu.get("description", "")
                
                edu_title = f"<b>{degree}</b> in <b>{field}</b>"
                content.append(Paragraph(edu_title, styles['Heading3']))
                
                content.append(Paragraph(institution, normal_style))
                date_range = f"{start_date} - {end_date}"
                content.append(Paragraph(date_range, normal_style))
                
                if description:
                    content.append(Paragraph(description, normal_style))
                
                content.append(Spacer(1, 6))
        
        # Add skills
        skills = resume_data.get("skills", [])
        if skills:
            content.append(Paragraph("Skills", heading_style))
            
            skill_categories = {}
            for skill in skills:
                category = skill.get("category", "Other")
                name = skill.get("name", "")
                level = skill.get("level", "")
                
                if category not in skill_categories:
                    skill_categories[category] = []
                
                if level:
                    skill_categories[category].append(f"{name} ({level})")
                else:
                    skill_categories[category].append(name)
            
            for category, skill_list in skill_categories.items():
                content.append(Paragraph(f"<b>{category}</b>", normal_style))
                content.append(Paragraph(", ".join(skill_list), normal_style))
                content.append(Spacer(1, 6))
        
        # Add certifications
        certifications = resume_data.get("certifications", [])
        if certifications:
            content.append(Paragraph("Certifications", heading_style))
            
            for cert in certifications:
                content.append(Paragraph(f"• {cert}", normal_style))
            
            content.append(Spacer(1, 6))
        
        # Add languages
        languages = resume_data.get("languages", [])
        if languages:
            content.append(Paragraph("Languages", heading_style))
            
            content.append(Paragraph(", ".join(languages), normal_style))
        
        # Build the PDF
        doc.build(content)
        
        # Get the PDF data
        pdf_data = buffer.getvalue()
        buffer.close()
        
        return pdf_data
    
    def _generate_with_xhtml2pdf(self, resume_data: Dict[str, Any]) -> bytes:
        """
        Generate PDF using xhtml2pdf.
        
        Args:
            resume_data (Dict[str, Any]): Resume data
            
        Returns:
            bytes: PDF content as bytes
        """
        # Create HTML template for the resume
        html = self._generate_resume_html(resume_data)
        
        # Create a buffer for the PDF
        result = io.BytesIO()
        
        # Convert HTML to PDF
        pisa.CreatePDF(io.StringIO(html), result)
        
        # Get the PDF data
        pdf_data = result.getvalue()
        result.close()
        
        return pdf_data
    
    def _generate_with_weasyprint(self, resume_data: Dict[str, Any]) -> bytes:
        """
        Generate PDF using WeasyPrint.
        
        Args:
            resume_data (Dict[str, Any]): Resume data
            
        Returns:
            bytes: PDF content as bytes
        """
        # Create HTML template for the resume
        html_content = self._generate_resume_html(resume_data)
        
        # Generate PDF using WeasyPrint
        pdf = HTML(string=html_content).write_pdf()
        
        return pdf
    
    def _generate_resume_html(self, resume_data: Dict[str, Any]) -> str:
        """
        Generate HTML representation of the resume.
        
        Args:
            resume_data (Dict[str, Any]): Resume data
            
        Returns:
            str: HTML content
        """
        # Get personal info
        personal_info = resume_data.get("personal_info", {})
        name = personal_info.get("name", "")
        email = personal_info.get("email", "")
        phone = personal_info.get("phone", "")
        address = personal_info.get("address", "")
        linkedin = personal_info.get("linkedin", "")
        github = personal_info.get("github", "")
        website = personal_info.get("website", "")
        summary = personal_info.get("summary", "")
        
        # Create HTML header with CSS styles
        html = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Resume</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    color: #333;
                    line-height: 1.5;
                }
                h1 {
                    color: #2c3e50;
                    margin-bottom: 5px;
                }
                h2 {
                    color: #2c3e50;
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 5px;
                    margin-top: 20px;
                }
                h3 {
                    margin-bottom: 5px;
                }
                .contact-info {
                    margin-bottom: 20px;
                }
                .contact-item {
                    margin-right: 15px;
                    display: inline-block;
                }
                .date-range {
                    color: #777;
                    font-style: italic;
                    margin-bottom: 5px;
                }
                .job-title, .education-degree {
                    font-weight: bold;
                }
                .company, .institution {
                    font-weight: bold;
                }
                .skills-category {
                    font-weight: bold;
                    margin-top: 10px;
                }
                ul {
                    margin-top: 5px;
                }
                .achievement {
                    margin-bottom: 3px;
                }
            </style>
        </head>
        <body>
        """
        
        # Add name and contact info
        html += f"<h1>{name}</h1>"
        html += "<div class='contact-info'>"
        if email:
            html += f"<div class='contact-item'>Email: {email}</div>"
        if phone:
            html += f"<div class='contact-item'>Phone: {phone}</div>"
        if address:
            html += f"<div class='contact-item'>Address: {address}</div>"
        if linkedin:
            html += f"<div class='contact-item'>LinkedIn: {linkedin}</div>"
        if github:
            html += f"<div class='contact-item'>GitHub: {github}</div>"
        if website:
            html += f"<div class='contact-item'>Website: {website}</div>"
        html += "</div>"
        
        # Add summary
        if summary:
            html += "<h2>Professional Summary</h2>"
            html += f"<p>{summary}</p>"
        
        # Add experience
        experience = resume_data.get("experience", [])
        if experience:
            html += "<h2>Professional Experience</h2>"
            
            for exp in experience:
                company = exp.get("company", "")
                position = exp.get("position", "")
                start_date = exp.get("start_date", "")
                end_date = exp.get("end_date", "Present")
                description = exp.get("description", "")
                achievements = exp.get("achievements", [])
                
                html += f"<h3><span class='job-title'>{position}</span> at <span class='company'>{company}</span></h3>"
                html += f"<div class='date-range'>{start_date} - {end_date}</div>"
                html += f"<p>{description}</p>"
                
                if achievements:
                    html += "<p><strong>Key Achievements:</strong></p>"
                    html += "<ul>"
                    for achievement in achievements:
                        html += f"<li class='achievement'>{achievement}</li>"
                    html += "</ul>"
        
        # Add education
        education = resume_data.get("education", [])
        if education:
            html += "<h2>Education</h2>"
            
            for edu in education:
                institution = edu.get("institution", "")
                degree = edu.get("degree", "")
                field = edu.get("field_of_study", "")
                start_date = edu.get("start_date", "")
                end_date = edu.get("end_date", "Present")
                description = edu.get("description", "")
                
                html += f"<h3><span class='education-degree'>{degree}</span> in {field}</h3>"
                html += f"<div class='institution'>{institution}</div>"
                html += f"<div class='date-range'>{start_date} - {end_date}</div>"
                
                if description:
                    html += f"<p>{description}</p>"
        
        # Add skills
        skills = resume_data.get("skills", [])
        if skills:
            html += "<h2>Skills</h2>"
            
            skill_categories = {}
            for skill in skills:
                category = skill.get("category", "Other")
                name = skill.get("name", "")
                level = skill.get("level", "")
                
                if category not in skill_categories:
                    skill_categories[category] = []
                
                if level:
                    skill_categories[category].append(f"{name} ({level})")
                else:
                    skill_categories[category].append(name)
            
            for category, skill_list in skill_categories.items():
                html += f"<div class='skills-category'>{category}:</div>"
                html += f"<p>{', '.join(skill_list)}</p>"
        
        # Add certifications
        certifications = resume_data.get("certifications", [])
        if certifications:
            html += "<h2>Certifications</h2>"
            html += "<ul>"
            for cert in certifications:
                html += f"<li>{cert}</li>"
            html += "</ul>"
        
        # Add languages
        languages = resume_data.get("languages", [])
        if languages:
            html += "<h2>Languages</h2>"
            html += f"<p>{', '.join(languages)}</p>"
        
        # Close HTML document
        html += """
        </body>
        </html>
        """
        
        return html

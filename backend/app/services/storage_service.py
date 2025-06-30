"""
Service for storing and retrieving resume data
"""
import os
import json
import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional

# Path to store resume data
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")

class ResumeStorageService:
    """
    Service class to handle resume storage operations.
    Stores resumes in JSON files in the data directory.
    """
    
    @staticmethod
    def save_resume(resume_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Save a resume to storage.
        
        Args:
            resume_data (Dict[str, Any]): Resume data in dictionary format
            
        Returns:
            Dict[str, Any]: Resume data with added metadata (id, timestamp)
        """
        # Ensure data directory exists
        os.makedirs(DATA_DIR, exist_ok=True)
        
        # Generate a unique ID for the resume if not provided
        if "id" not in resume_data:
            resume_data["id"] = str(uuid.uuid4())
        
        # Add timestamp
        resume_data["last_updated"] = datetime.now().isoformat()
        
        # Save the resume data to a JSON file
        filename = f"resume_{resume_data['id']}.json"
        filepath = os.path.join(DATA_DIR, filename)
        
        with open(filepath, "w") as f:
            json.dump(resume_data, f, indent=2)
        
        return resume_data
    
    @staticmethod
    def get_resume(resume_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve a resume by ID.
        
        Args:
            resume_id (str): ID of the resume to retrieve
            
        Returns:
            Optional[Dict[str, Any]]: The resume data or None if not found
        """
        filepath = os.path.join(DATA_DIR, f"resume_{resume_id}.json")
        
        if not os.path.exists(filepath):
            return None
        
        with open(filepath, "r") as f:
            return json.load(f)
    
    @staticmethod
    def list_resumes() -> List[Dict[str, Any]]:
        """
        List all saved resumes with basic metadata.
        
        Returns:
            List[Dict[str, Any]]: List of resume metadata objects
        """
        # Ensure data directory exists
        os.makedirs(DATA_DIR, exist_ok=True)
        
        resumes = []
        for filename in os.listdir(DATA_DIR):
            if filename.startswith("resume_") and filename.endswith(".json"):
                filepath = os.path.join(DATA_DIR, filename)
                with open(filepath, "r") as f:
                    resume_data = json.load(f)
                    # Include only basic metadata for the list
                    resumes.append({
                        "id": resume_data.get("id"),
                        "name": resume_data.get("personal_info", {}).get("name", "Unnamed Resume"),
                        "last_updated": resume_data.get("last_updated")
                    })
        
        return resumes

"""
Utility for loading environment variables
"""
import os
from pathlib import Path
from dotenv import load_dotenv
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def load_env_variables():
    """
    Load environment variables from .env file
    """
    # Get the project root directory (2 levels up from this file)
    project_root = Path(__file__).parent.parent.parent.parent
    env_path = project_root / '.env'
    
    # Load environment variables from .env file
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)
        logger.info(f"Loaded environment variables from {env_path}")
    else:
        logger.warning(f"No .env file found at {env_path}")

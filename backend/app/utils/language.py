"""
Language utilities — normalisation + detection helpers
"""
import re
from app.models.classifier import detect_language


def normalise_input(text: str) -> str:
    """Strip extra whitespace; preserve Hindi/Devanagari characters."""
    text = text.strip()
    text = re.sub(r"[ \t]+", " ", text)
    return text


__all__ = ["normalise_input", "detect_language"]

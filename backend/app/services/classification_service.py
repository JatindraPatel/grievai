"""
Classification service — thin wrapper over the keyword classifier
"""
from app.models.classifier import classify, ClassificationResult
from app.utils.language import normalise_input


def classify_complaint(text: str) -> ClassificationResult:
    """
    Public API used by the complaint service.
    Normalises input then runs keyword classification.
    """
    clean = normalise_input(text)
    return classify(clean)

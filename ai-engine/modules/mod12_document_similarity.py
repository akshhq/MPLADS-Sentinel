"""
Module 12: Document Similarity AI
Responsibilities: Detects recycled, reused, or duplicated certificates and invoice layouts.
"""

from typing import List
from models.schemas import CanonicalWorkProfile, AnomalySignal


class DocumentSimilarityAI:
    """Module 12: Identifies cross-project document recycling and layout collisions."""

    @classmethod
    def evaluate_similarity(cls, profile: CanonicalWorkProfile) -> List[AnomalySignal]:
        signals = []
        for doc in profile.evidence_items:
            if doc.type in ["document", "certificate"]:
                comp_id = doc.metadata.get("comparisonEvidenceId")
                sim_pct = float(doc.metadata.get("comparisonSimilarityPercent", 0.0))

                if sim_pct >= 90.0:
                    signals.append(
                        AnomalySignal(
                            signal_id=f"DOC-SIMILARITY-COLLISION-{doc.id}",
                            dimension="document",
                            severity="critical",
                            module_name="Document Similarity AI v1.5",
                            score_contribution=92.0,
                            confidence=round(sim_pct / 100.0, 3),
                            finding=f"High Document Layout / Text Collision ({sim_pct:.1f}% match with {comp_id or 'Archive'})",
                            explanation=f"Uploaded certificate exhibits {sim_pct:.1f}% structural layout and text hash match with previously uploaded document.",
                            citation="Vigilance Manual 2021 §7.3 — Forged / Recycled Utilization Documentation",
                            evidence_ids=[doc.id],
                        )
                    )

        return signals

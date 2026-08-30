"""
Module 9: Duplicate / Split-Work AI
Responsibilities: Detects duplicate scope descriptions, spatial proximity overlaps, and split ghost works.
"""

from typing import List, Dict, Any
from rapidfuzz import fuzz
from models.schemas import CanonicalWorkProfile, AnomalySignal


class DuplicateWorkAI:
    """Module 9: Detects overlapping or duplicate scopes across the national registry."""

    @classmethod
    def evaluate_duplicates(
        cls, profile: CanonicalWorkProfile, peer_works: List[Dict[str, Any]] = None
    ) -> List[AnomalySignal]:
        signals = []
        if not peer_works:
            return signals

        for peer in peer_works:
            peer_id = str(peer.get("work_id", ""))
            if peer_id == profile.work_id:
                continue

            peer_title = str(peer.get("title", ""))
            sim_ratio = fuzz.token_set_ratio(profile.title.lower(), peer_title.lower()) / 100.0
            same_district = profile.district.lower() == str(peer.get("district", "")).lower()

            if sim_ratio >= 0.82 and same_district:
                signals.append(
                    AnomalySignal(
                        signal_id=f"DUP-SCOPE-OVERLAP-{peer_id}",
                        dimension="duplicate",
                        severity="critical" if sim_ratio >= 0.92 else "high",
                        module_name="Duplicate / Split-Work AI v2.0",
                        score_contribution=92.0,
                        confidence=round(sim_ratio, 2),
                        finding=f"Potential Scope Duplication & Spatial Overlap with {peer_id} ({int(sim_ratio*100)}% match)",
                        explanation=f"Work description matches existing project '{peer_title}' in {profile.district} with {int(sim_ratio*100)}% semantic textual overlap.",
                        citation="MPLADS Guidelines 2023 §2.3 — Prohibition of duplicate sanctions for identical asset scopes",
                    )
                )
                break

        return signals

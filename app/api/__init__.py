"""
API module initialization.

Exports all routers for easy importing in main.py
"""

from app.api import health_check, routes, predictions

__all__ = ["health_check", "routes", "predictions"]
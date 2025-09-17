"""
Dynamic Learning Path Suggestion Service API
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from enum import Enum
import json

router = APIRouter(prefix="/learning", tags=["learning-path"])

class SkillLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class LearningGoal(str, Enum):
    CAREER_CHANGE = "career_change"
    SKILL_IMPROVEMENT = "skill_improvement"
    CERTIFICATION = "certification"
    PERSONAL_INTEREST = "personal_interest"
    ACADEMIC = "academic"

class LearningStyle(str, Enum):
    VISUAL = "visual"
    AUDITORY = "auditory"
    KINESTHETIC = "kinesthetic"
    READING = "reading"
    MIXED = "mixed"

class Resource(BaseModel):
    title: str
    type: str  # course, book, video, article, practice, project
    provider: str
    duration: str
    difficulty: SkillLevel
    url: Optional[str] = None
    description: str
    skills_covered: List[str]

class LearningPathRequest(BaseModel):
    subject: str
    current_skill_level: SkillLevel
    target_skill_level: SkillLevel
    learning_goals: List[LearningGoal]
    learning_style: LearningStyle
    time_commitment: str  # e.g., "2 hours/week", "full-time"
    timeline: str  # e.g., "3 months", "1 year"
    preferred_resource_types: List[str]  # courses, books, videos, etc.
    budget: Optional[str] = "free"  # free, low, medium, high
    specific_interests: Optional[List[str]] = []

class LearningPathResponse(BaseModel):
    success: bool
    subject: str
    personalized_path: Dict[str, Any]
    estimated_timeline: str
    total_resources: int
    phases: List[Dict[str, Any]]

# Sample learning resources database
LEARNING_RESOURCES = {
    "python": {
        "beginner": [
            Resource(
                title="Python for Everybody Specialization",
                type="course",
                provider="Coursera",
                duration="8 months",
                difficulty=SkillLevel.BEGINNER,
                url="https://coursera.org/specializations/python",
                description="Complete Python programming specialization covering basics to data structures",
                skills_covered=["Python basics", "Data structures", "Web scraping", "Databases"]
            ),
            Resource(
                title="Automate the Boring Stuff with Python",
                type="book",
                provider="No Starch Press",
                duration="4-6 weeks",
                difficulty=SkillLevel.BEGINNER,
                url="https://automatetheboringstuff.com/",
                description="Practical Python programming book with real-world projects",
                skills_covered=["Python basics", "File handling", "Web scraping", "GUI automation"]
            ),
            Resource(
                title="Python Tutorial for Beginners",
                type="video",
                provider="YouTube - Programming with Mosh",
                duration="6 hours",
                difficulty=SkillLevel.BEGINNER,
                description="Comprehensive Python tutorial covering fundamentals",
                skills_covered=["Python syntax", "Variables", "Functions", "Classes"]
            )
        ],
        "intermediate": [
            Resource(
                title="Python Data Science Handbook",
                type="book",
                provider="O'Reilly",
                duration="8-10 weeks",
                difficulty=SkillLevel.INTERMEDIATE,
                description="Essential tools for working with data in Python",
                skills_covered=["NumPy", "Pandas", "Matplotlib", "Scikit-learn"]
            ),
            Resource(
                title="Real Python Tutorials",
                type="course",
                provider="Real Python",
                duration="Ongoing",
                difficulty=SkillLevel.INTERMEDIATE,
                url="https://realpython.com/",
                description="In-depth Python tutorials and courses",
                skills_covered=["Advanced Python", "Web development", "Testing", "Deployment"]
            )
        ],
        "advanced": [
            Resource(
                title="Effective Python",
                type="book",
                provider="Addison-Wesley",
                duration="6-8 weeks",
                difficulty=SkillLevel.ADVANCED,
                description="90 specific ways to write better Python",
                skills_covered=["Python best practices", "Performance optimization", "Advanced patterns"]
            )
        ]
    },
    "web development": {
        "beginner": [
            Resource(
                title="The Complete Web Developer Course",
                type="course",
                provider="Udemy",
                duration="12 weeks",
                difficulty=SkillLevel.BEGINNER,
                description="Full-stack web development from scratch",
                skills_covered=["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB"]
            ),
            Resource(
                title="MDN Web Docs",
                type="article",
                provider="Mozilla",
                duration="Ongoing",
                difficulty=SkillLevel.BEGINNER,
                url="https://developer.mozilla.org/",
                description="Comprehensive web development documentation",
                skills_covered=["HTML", "CSS", "JavaScript", "Web APIs"]
            )
        ],
        "intermediate": [
            Resource(
                title="React - The Complete Guide",
                type="course",
                provider="Udemy",
                duration="10 weeks",
                difficulty=SkillLevel.INTERMEDIATE,
                description="Master React with hooks, context, and advanced patterns",
                skills_covered=["React", "Redux", "Testing", "Performance optimization"]
            )
        ]
    },
    "machine learning": {
        "beginner": [
            Resource(
                title="Machine Learning Course",
                type="course",
                provider="Coursera - Andrew Ng",
                duration="11 weeks",
                difficulty=SkillLevel.BEGINNER,
                url="https://coursera.org/learn/machine-learning",
                description="Comprehensive introduction to machine learning",
                skills_covered=["Supervised learning", "Unsupervised learning", "Neural networks"]
            ),
            Resource(
                title="Hands-On Machine Learning",
                type="book",
                provider="O'Reilly",
                duration="12-16 weeks",
                difficulty=SkillLevel.BEGINNER,
                description="Practical ML with Scikit-Learn and TensorFlow",
                skills_covered=["ML algorithms", "Deep learning", "Python ML libraries"]
            )
        ],
        "intermediate": [
            Resource(
                title="Deep Learning Specialization",
                type="course",
                provider="Coursera - deeplearning.ai",
                duration="16 weeks",
                difficulty=SkillLevel.INTERMEDIATE,
                description="Deep learning and neural networks specialization",
                skills_covered=["Deep learning", "CNN", "RNN", "TensorFlow"]
            )
        ]
    }
}

def generate_learning_path(request: LearningPathRequest) -> Dict[str, Any]:
    """
    Generate a personalized learning path based on user requirements
    """
    subject_lower = request.subject.lower()
    
    # Find matching subject or closest match
    matching_subject = None
    for subject_key in LEARNING_RESOURCES.keys():
        if subject_lower in subject_key or subject_key in subject_lower:
            matching_subject = subject_key
            break
    
    if not matching_subject:
        # Default to general programming path
        matching_subject = "python"
    
    resources = LEARNING_RESOURCES.get(matching_subject, LEARNING_RESOURCES["python"])
    
    # Create learning phases
    phases = []
    current_phase = 1
    
    # Phase 1: Foundation (if starting from beginner)
    if request.current_skill_level == SkillLevel.BEGINNER:
        foundation_resources = resources.get("beginner", [])
        if foundation_resources:
            phases.append({
                "phase": current_phase,
                "title": "Foundation Phase",
                "description": f"Build strong fundamentals in {matching_subject}",
                "duration": "4-8 weeks",
                "resources": [resource.dict() for resource in foundation_resources[:3]],
                "learning_objectives": [
                    f"Understand basic {matching_subject} concepts",
                    "Complete hands-on exercises",
                    "Build first project"
                ]
            })
            current_phase += 1
    
    # Phase 2: Intermediate skills
    if request.target_skill_level in [SkillLevel.INTERMEDIATE, SkillLevel.ADVANCED]:
        intermediate_resources = resources.get("intermediate", [])
        if intermediate_resources:
            phases.append({
                "phase": current_phase,
                "title": "Skill Development Phase",
                "description": f"Develop intermediate {matching_subject} skills",
                "duration": "6-12 weeks",
                "resources": [resource.dict() for resource in intermediate_resources[:3]],
                "learning_objectives": [
                    f"Master intermediate {matching_subject} concepts",
                    "Work on real-world projects",
                    "Learn best practices"
                ]
            })
            current_phase += 1
    
    # Phase 3: Advanced/Specialization
    if request.target_skill_level == SkillLevel.ADVANCED:
        advanced_resources = resources.get("advanced", [])
        if advanced_resources:
            phases.append({
                "phase": current_phase,
                "title": "Mastery Phase",
                "description": f"Achieve advanced proficiency in {matching_subject}",
                "duration": "8-16 weeks",
                "resources": [resource.dict() for resource in advanced_resources[:2]],
                "learning_objectives": [
                    f"Master advanced {matching_subject} concepts",
                    "Contribute to open source projects",
                    "Mentor others"
                ]
            })
    
    # Calculate total resources
    total_resources = sum(len(phase["resources"]) for phase in phases)
    
    # Generate personalized recommendations
    personalization_notes = []
    
    if request.learning_style == LearningStyle.VISUAL:
        personalization_notes.append("Focus on video tutorials and visual documentation")
    elif request.learning_style == LearningStyle.AUDITORY:
        personalization_notes.append("Include podcasts and audio-based learning materials")
    elif request.learning_style == LearningStyle.KINESTHETIC:
        personalization_notes.append("Emphasize hands-on projects and coding practice")
    
    if LearningGoal.CAREER_CHANGE in request.learning_goals:
        personalization_notes.append("Include portfolio projects and networking opportunities")
    
    if LearningGoal.CERTIFICATION in request.learning_goals:
        personalization_notes.append("Focus on certification-aligned materials and practice exams")
    
    return {
        "subject": matching_subject,
        "skill_progression": f"{request.current_skill_level.value} → {request.target_skill_level.value}",
        "learning_style_accommodations": personalization_notes,
        "phases": phases,
        "study_schedule": {
            "time_commitment": request.time_commitment,
            "timeline": request.timeline,
            "recommended_pace": "3-4 hours per week for steady progress"
        },
        "success_metrics": [
            "Complete all phase objectives",
            "Build portfolio projects",
            "Pass knowledge assessments",
            "Apply skills in real scenarios"
        ]
    }

@router.post("/suggest", response_model=LearningPathResponse)
async def suggest_learning_path(request: LearningPathRequest):
    """
    Generate personalized learning path suggestions
    """
    try:
        personalized_path = generate_learning_path(request)
        phases = personalized_path["phases"]
        
        # Calculate estimated timeline
        total_weeks = sum(
            int(phase["duration"].split("-")[0]) 
            for phase in phases 
            if "-" in phase["duration"]
        )
        estimated_timeline = f"{total_weeks} weeks ({total_weeks // 4} months)"
        
        return LearningPathResponse(
            success=True,
            subject=request.subject,
            personalized_path=personalized_path,
            estimated_timeline=estimated_timeline,
            total_resources=sum(len(phase["resources"]) for phase in phases),
            phases=phases
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate learning path: {str(e)}")

@router.post("/suggest-simple")
async def suggest_simple_path(subject: str, skill_level: str = "beginner"):
    """
    Simple learning path suggestion with minimal input
    """
    try:
        # Create a basic request
        request = LearningPathRequest(
            subject=subject,
            current_skill_level=SkillLevel(skill_level),
            target_skill_level=SkillLevel.INTERMEDIATE,
            learning_goals=[LearningGoal.SKILL_IMPROVEMENT],
            learning_style=LearningStyle.MIXED,
            time_commitment="5 hours/week",
            timeline="3 months",
            preferred_resource_types=["course", "book", "video"]
        )
        
        return await suggest_learning_path(request)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate simple learning path: {str(e)}")

@router.get("/subjects")
async def list_available_subjects():
    """
    List available subjects for learning paths
    """
    return {
        "success": True,
        "subjects": list(LEARNING_RESOURCES.keys()),
        "total_subjects": len(LEARNING_RESOURCES)
    }

@router.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy", "service": "learning-path"}

@router.get("/")
async def service_info():
    """
    Service information
    """
    return {
        "service": "Dynamic Learning Path Suggestion Service",
        "description": "Generate personalized learning paths based on user goals and preferences",
        "available_subjects": list(LEARNING_RESOURCES.keys()),
        "skill_levels": ["beginner", "intermediate", "advanced"],
        "endpoints": [
            "/learning/suggest - Generate detailed learning path",
            "/learning/suggest-simple - Generate simple learning path",
            "/learning/subjects - List available subjects",
            "/learning/health - Health check"
        ]
    }
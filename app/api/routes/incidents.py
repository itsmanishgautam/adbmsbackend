from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app import crud, models, schemas
from app.db.session import get_db
from app.core.dependencies import get_current_active_user, require_role

router = APIRouter()

@router.get("/", response_model=List[schemas.IncidentResponse])
async def read_incidents(
    skip: int = 0, 
    limit: int = 100, 
    db: AsyncSession = Depends(get_db), 
    current_user: models.User = Depends(get_current_active_user)
):
    if current_user.role.value == "patient":
        # A patient can only view incidents they reported or about themselves
        patient = await crud.patient.get_by_field(db, "user_id", current_user.id)
        if patient:
            return await crud.incident.get_multi_by_field(db, "patient_id", patient.patient_id, skip=skip, limit=limit)
        return []
    
    return await crud.incident.get_multi(db, skip=skip, limit=limit)

@router.post("/", response_model=schemas.IncidentResponse)
async def create_incident(
    incident_in: schemas.IncidentCreate, 
    db: AsyncSession = Depends(get_db), 
    current_user: models.User = Depends(get_current_active_user)
):
    # Patient auto-assign patient_id if not setting it to another user
    if current_user.role.value == "patient":
        patient = await crud.patient.get_by_field(db, "user_id", current_user.id)
        if patient and not incident_in.patient_id:
            incident_in.patient_id = patient.patient_id

    # Exclude unset fields using dict processing
    obj_in_data = incident_in.model_dump()
    obj_in_data["reported_by"] = current_user.id
    
    db_obj = models.Incident(**obj_in_data)
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    
    await crud.access_log.log_action(db, current_user.id, "Create Incident", resource="Incidents")
    return db_obj

@router.put("/{id}", response_model=schemas.IncidentResponse)
async def update_incident(
    id: int, 
    incident_in: schemas.IncidentUpdate, 
    db: AsyncSession = Depends(get_db), 
    current_user: models.User = Depends(get_current_active_user)
):
    incident = await crud.incident.get(db, id=id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
        
    # Patients can only update their own reported incidents
    if current_user.role.value == "patient" and incident.reported_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    incident = await crud.incident.update(db, db_obj=incident, obj_in=incident_in)
    await crud.access_log.log_action(db, current_user.id, f"Update Incident {id}", resource="Incidents")
    return incident

@router.patch("/{id}/resolve", response_model=schemas.IncidentResponse)
async def resolve_incident(
    id: int, 
    resolution_notes: str,
    db: AsyncSession = Depends(get_db), 
    current_user: models.User = Depends(require_role("admin"))
):
    incident = await crud.incident.get(db, id=id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
        
    incident = await crud.incident.update(db, db_obj=incident, obj_in={"status": "resolved", "resolution_notes": resolution_notes})
    await crud.access_log.log_action(db, current_user.id, f"Resolve Incident {id}", resource="Incidents")
    return incident

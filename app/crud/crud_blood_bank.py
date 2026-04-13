from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.crud.base import CRUDBase
from app.models.blood_bank import BloodBank
from app.schemas.blood_bank import BloodBankCreate, BloodBankUpdate

class CRUDBloodBank(CRUDBase[BloodBank, BloodBankCreate, BloodBankUpdate]):
    async def get_by_blood_type(self, db: AsyncSession, *, blood_type: str) -> Optional[BloodBank]:
        result = await db.execute(select(BloodBank).filter(BloodBank.blood_type == blood_type))
        return result.scalars().first()

blood_bank = CRUDBloodBank(BloodBank)

from sqlalchemy.ext.asyncio import AsyncSession
from app.models.log import AccessLog

async def create_log(
    db: AsyncSession,
    user_id: int,
    action: str,
    resource: str = None
):
    log = AccessLog(
        user_id=user_id,
        action=action,
        resource=resource
    )
    db.add(log)
    await db.commit()
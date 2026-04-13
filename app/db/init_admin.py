#this location is app/db/init_admin.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app import models
from app.core.security import get_password_hash


async def create_admin_user(db: AsyncSession):
    # Check if admin already exists
    result = await db.execute(
        select(models.User).where(models.User.email == "admin@example.com")
    )
    admin = result.scalars().first()

    if admin:
        print("⚠️ Admin already exists")
        return

    # Create admin
    admin_user = models.User(
        name="Admin",
        email="admin@example.com",
        password_hash=get_password_hash("admin123"),
        role=models.UserRole.admin,
        is_active=True
    )

    db.add(admin_user)
    await db.commit()

    print("✅ Admin user created")
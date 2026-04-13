import asyncio
from app.db.session import AsyncSessionLocal
from app.db.init_admin import create_admin_user 

async def main():
    async with AsyncSessionLocal() as db:
        await create_admin_user(db)

asyncio.run(main())



from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.api.api import api_router
from app.core.config import settings
from app.db.session import AsyncSessionLocal
from app.crud import access_log
from jose import jwt, JWTError

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    user_id = None
    # Basic attempt to extract user ID from token
    if "authorization" in request.headers:
        auth_header = request.headers["authorization"]
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
                user_id = payload.get("sub")
            except Exception:
                pass
    
    # Process request
    response = await call_next(request)
    
    # Log after
    action_info = f"{request.method} {request.url.path}"
    ip_addr = request.client.host if request.client else "unknown"
    
    # We spawn a db session just to log this
    async with AsyncSessionLocal() as db:
        await access_log.log_action(
            db, 
            user_id=user_id if user_id else None, 
            action=action_info, 
            ip_address=ip_addr,
            resource="SYSTEM_API",
            details={
                "method": request.method,
                "path": request.url.path,
                "query_params": str(request.query_params)
            }
        )
    
    return response


app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"message": f"Welcome to {settings.PROJECT_NAME}"}




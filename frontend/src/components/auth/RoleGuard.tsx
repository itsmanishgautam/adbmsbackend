"use client";

import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../context/userStore';
import { Role } from '../../types';
import { useEffect } from 'react';

export default function RoleGuard({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode, 
  allowedRoles: Role[] 
}) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  
  useEffect(() => {
    if (user && !allowedRoles.includes(user.role)) {
      // If patient tries to hit admin, send them to their own dashboard
      router.replace(`/${user.role}`);
    }
  }, [user, allowedRoles, router]);

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}

import React from 'react';
import { AdminPanel } from '@/admin';
import { AuthProvider } from '@/workshop/useAuth';
import { Shield } from 'lucide-react';

export function AdminPage() {
  return (
    <AuthProvider>
      <AdminPanel />
    </AuthProvider>
  );
}

export function AdminLink() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-lg font-medium mb-2">管理后台</h2>
        <p className="text-sm text-muted-foreground">
          管理后台正在加载中...
        </p>
      </div>
    </div>
  );
}

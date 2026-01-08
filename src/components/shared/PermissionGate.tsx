'use client';

/**
 * PermissionGate Component
 *
 * Component Hierarchy:
 * src/components/shared/PermissionGate.tsx (this file)
 *
 * Conditionally renders children based on user permissions.
 * Use this to hide UI elements the user doesn't have access to.
 *
 * Usage:
 * ```tsx
 * <PermissionGate permission="projects.delete">
 *   <DeleteButton />
 * </PermissionGate>
 *
 * <PermissionGate permissions={['admin.access', 'admin.bi']} mode="any">
 *   <AdminMenu />
 * </PermissionGate>
 *
 * <PermissionGate permission="billing.override" fallback={<UpgradePrompt />}>
 *   <OverrideButton />
 * </PermissionGate>
 * ```
 *
 * Security Note: This is for UI visibility only.
 * Server-side RBAC in Convex functions is the actual security layer.
 */

import type { FC, ReactNode } from 'react';
import { usePermission, usePermissions } from '@/lib/usePermission';
import type { Permission } from '@/lib/permissions';

interface SinglePermissionProps {
  permission: Permission;
  permissions?: never;
  mode?: never;
  children: ReactNode;
  fallback?: ReactNode;
}

interface MultiPermissionProps {
  permission?: never;
  permissions: Permission[];
  mode?: 'all' | 'any';
  children: ReactNode;
  fallback?: ReactNode;
}

type Props = SinglePermissionProps | MultiPermissionProps;

// Sub-component for single permission check - hooks called unconditionally
const SinglePermissionGate: FC<{
  permission: Permission;
  children: ReactNode;
  fallback: ReactNode;
}> = ({ permission, children, fallback }) => {
  const hasAccess = usePermission(permission);
  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

// Sub-component for multiple permissions check - hooks called unconditionally
const MultiPermissionGate: FC<{
  permissions: Permission[];
  mode: 'all' | 'any';
  children: ReactNode;
  fallback: ReactNode;
}> = ({ permissions, mode, children, fallback }) => {
  const hasAccess = usePermissions(permissions, mode);
  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export const PermissionGate: FC<Props> = (props) => {
  const { children, fallback = null } = props;

  // Single permission check - delegate to sub-component
  if ('permission' in props && props.permission) {
    return (
      <SinglePermissionGate permission={props.permission} fallback={fallback}>
        {children}
      </SinglePermissionGate>
    );
  }

  // Multiple permissions check - delegate to sub-component
  if ('permissions' in props && props.permissions) {
    return (
      <MultiPermissionGate
        permissions={props.permissions}
        mode={props.mode ?? 'all'}
        fallback={fallback}
      >
        {children}
      </MultiPermissionGate>
    );
  }

  // No permission specified - render children
  return <>{children}</>;
};

export default PermissionGate;

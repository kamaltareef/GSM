import { base44 } from '@/api/base44Client';
import { useCallback } from 'react';
import { useAuth } from '@/lib/AuthContext';

/**
 * Central hook for writing audit log entries.
 * Automatically injects the current user's name as `performed_by`.
 *
 * Usage:
 *   const { log } = useAuditLog();
 *   await log({ action: 'price_update', entity_type: 'FuelTank', entity_id: id,
 *               details: 'Updated price', old_value: '5.00', new_value: '5.20' });
 */
export function useAuditLog() {
  const { user } = useAuth();

  const log = useCallback(async (entry) => {
    const performed_by = user?.full_name || user?.email || 'מערכת';
    await base44.entities.AuditLog.create({ performed_by, ...entry });
  }, [user]);

  return { log };
}
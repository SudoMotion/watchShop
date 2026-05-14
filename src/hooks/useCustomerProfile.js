'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAuthToken } from '@/lib/auth';
import { getCustomerProfile, updateCustomerProfile } from '@/stores/UserAPI';

const AUTH_KEY = 'watchshop_auth';

function readStoredCustomer() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const { customer } = JSON.parse(raw);
    return customer && (customer.id != null || customer.phone) ? customer : null;
  } catch {
    return null;
  }
}

export function persistAuthCustomer(customer) {
  if (typeof window === 'undefined' || !customer) return;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    localStorage.setItem(AUTH_KEY, JSON.stringify({ ...data, customer }));
  } catch {
    /* ignore */
  }
}

/**
 * Loads customer from GET /api/customer/me; seeds from localStorage until loaded.
 */
export function useCustomerProfile() {
  const [customer, setCustomer] = useState(() => readStoredCustomer());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      setError('Not authenticated');
      setCustomer(null);
      return;
    }
    setLoading(true);
    setError(null);
    const res = await getCustomerProfile(token);
    const payload = res?.data ?? {};
    if (res?.status === 200 && payload.success && payload.customer) {
      setCustomer(payload.customer);
      persistAuthCustomer(payload.customer);
    } else {
      const msg =
        payload?.message ||
        (typeof payload === 'string' ? payload : null) ||
        'Could not load profile';
      setError(msg);
      const fallback = readStoredCustomer();
      if (fallback) setCustomer(fallback);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { customer, setCustomer, loading, error, refetch: fetchProfile };
}

/**
 * PATCH /api/customer/profile with Bearer token.
 */
export function useUpdateCustomerProfile() {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const updateProfile = useCallback(async (body) => {
    const token = getAuthToken();
    if (!token) {
      const msg = 'Not authenticated';
      setError(msg);
      return { ok: false, error: msg };
    }
    setUpdating(true);
    setError(null);
    const res = await updateCustomerProfile(token, body);
    const payload = res?.data ?? {};
    setUpdating(false);
    if (res?.status === 200 && payload.success && payload.customer) {
      persistAuthCustomer(payload.customer);
      return { ok: true, customer: payload.customer };
    }
    let msg = payload?.message;
    if (!msg && payload?.errors) {
      msg = Object.values(payload.errors)
        .flat()
        .filter(Boolean)
        .join(' ');
    }
    if (!msg) msg = 'Profile update failed';
    setError(msg);
    return { ok: false, error: msg, payload };
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { updateProfile, updating, error, clearError };
}

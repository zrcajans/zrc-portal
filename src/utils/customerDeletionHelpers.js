import { normalizeCredentialText } from './teamHelpers';

const LEGACY_DEMO_CUSTOMER_NAME_KEYS = new Set(['orneksirket', 'afirmasi', 'bholding']);

const readCustomerStorageValue = (key, fallback = null) => {
  if (typeof window === 'undefined' || !window.localStorage) return fallback;

  try {
    const rawValue = window.localStorage.getItem(key);
    if (!rawValue) return fallback;
    return JSON.parse(rawValue);
  } catch (error) {
    console.warn('[ZRC CustomerDeletion] Local storage okunamadı.', key, error);
    return fallback;
  }
};

const writeCustomerStorageValue = (key, value) => {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('[ZRC CustomerDeletion] Local storage yazılamadı.', key, error);
  }
};

const normalizeCustomerStorageArray = (value, fallback = []) => (Array.isArray(value) ? value : fallback);

export const isLegacyDemoCustomerRecord = (customer = {}) =>
  LEGACY_DEMO_CUSTOMER_NAME_KEYS.has(normalizeCredentialText(customer.name));

export const getDeletedCustomerMarkers = () =>
  normalizeCustomerStorageArray(readCustomerStorageValue('deletedCustomers', []), []);

export const buildDeletedCustomerMarker = (customer = {}) => ({
  id: String(customer.supabaseId || customer.id || ''),
  name: normalizeCredentialText(customer.name),
  email: normalizeCredentialText(customer.email),
  deletedAt: new Date().toISOString()
});

export const isCustomerMarkedDeleted = (customer = {}, markers = getDeletedCustomerMarkers()) => {
  const customerId = String(customer.supabaseId || customer.id || '');
  const customerName = normalizeCredentialText(customer.name);
  const customerEmail = normalizeCredentialText(customer.email);

  return markers.some((marker) => {
    if (marker.id && customerId && marker.id === customerId) return true;
    if (!marker.id && marker.email && customerEmail && marker.email === customerEmail) return true;
    if (!marker.id && !marker.email && marker.name && customerName && marker.name === customerName) return true;
    return false;
  });
};

export const rememberDeletedCustomer = (customer = {}) => {
  const marker = buildDeletedCustomerMarker(customer);

  if (!marker.id && !marker.name && !marker.email) return;

  const previousMarkers = getDeletedCustomerMarkers();
  const alreadyExists = previousMarkers.some((item) =>
    (marker.id && item.id === marker.id) ||
    (!marker.id && marker.email && item.email === marker.email) ||
    (!marker.id && !marker.email && marker.name && item.name === marker.name)
  );

  if (alreadyExists) return;

  writeCustomerStorageValue('deletedCustomers', [marker, ...previousMarkers].slice(0, 250));
};

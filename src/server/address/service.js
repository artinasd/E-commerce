import { createAddress, findAddressForUser, listAddresses } from '../db/repositories/addresses.js';

function text(value, field, max) {
  if (typeof value !== 'string') throw new Error(`${field} is required.`);
  const normalized = value.trim();
  if (!normalized || normalized.length > max) throw new Error(`${field} is invalid.`);
  return normalized;
}

export async function getUserAddresses(userId) {
  return listAddresses(userId);
}

export async function getUserAddress(userId, addressId) {
  const id = Number(addressId);
  if (!Number.isSafeInteger(id) || id < 1) return null;
  return findAddressForUser(userId, id);
}

export async function addUserAddress(userId, payload) {
  return createAddress(userId, {
    recipientName: text(payload.recipientName, 'Recipient name', 200),
    recipientPhone: text(payload.recipientPhone, 'Recipient phone', 32),
    province: text(payload.province, 'Province', 100),
    city: text(payload.city, 'City', 100),
    addressLine: text(payload.addressLine, 'Address', 1000),
    postalCode: text(payload.postalCode, 'Postal code', 20),
    plaque: payload.plaque ? text(payload.plaque, 'Plaque', 50) : null,
    unit: payload.unit ? text(payload.unit, 'Unit', 50) : null,
    isDefault: Boolean(payload.isDefault),
  });
}

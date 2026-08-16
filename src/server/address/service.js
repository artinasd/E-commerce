import { createAddress, findAddressForUser, listAddresses, updateAddress, deleteAddress, setDefaultAddress } from '../db/repositories/addresses.js';

function text(value, field, max) {
  if (typeof value !== 'string') throw new Error(`${field} is required.`);
  const normalized = value.trim();
  if (!normalized || normalized.length > max) throw new Error(`${field} is invalid.`);
  return normalized;
}

function optionalText(value, field, max) {
  if (value == null || value === '') return null;
  return text(value, field, max);
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
    plaque: optionalText(payload.plaque, 'Plaque', 50),
    unit: optionalText(payload.unit, 'Unit', 50),
    isDefault: Boolean(payload.isDefault),
  });
}

export async function updateUserAddress(userId, addressId, payload) {
  const id = Number(addressId);
  if (!Number.isSafeInteger(id) || id < 1) throw new Error('Invalid address id.');
  return updateAddress(userId, id, {
    recipientName: text(payload.recipientName, 'Recipient name', 200),
    recipientPhone: text(payload.recipientPhone, 'Recipient phone', 32),
    province: text(payload.province, 'Province', 100),
    city: text(payload.city, 'City', 100),
    addressLine: text(payload.addressLine, 'Address', 1000),
    postalCode: text(payload.postalCode, 'Postal code', 20),
    plaque: optionalText(payload.plaque, 'Plaque', 50),
    unit: optionalText(payload.unit, 'Unit', 50),
    isDefault: payload.isDefault === undefined ? undefined : Boolean(payload.isDefault),
  });
}

export async function deleteUserAddress(userId, addressId) {
  const id = Number(addressId);
  if (!Number.isSafeInteger(id) || id < 1) throw new Error('Invalid address id.');
  return deleteAddress(userId, id);
}

export async function makeUserAddressDefault(userId, addressId) {
  const id = Number(addressId);
  if (!Number.isSafeInteger(id) || id < 1) throw new Error('Invalid address id.');
  return setDefaultAddress(userId, id);
}

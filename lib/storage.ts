"use client";

import { BirthInput } from "./types";

const API_KEY = "fortune_api_key";
const API_KEY_REMEMBER = "fortune_api_key_remember";
const PROFILE_KEY = "fortune_birth_profile";

export const maskApiKey = (value: string) => {
  if (!value) return "";
  if (value.length <= 8) return "****";
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
};

export const readApiKey = () => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(API_KEY) ?? "";
};

export const saveApiKey = (key: string, remember: boolean) => {
  if (typeof window === "undefined") return;
  if (remember) {
    localStorage.setItem(API_KEY, key);
  } else {
    localStorage.removeItem(API_KEY);
  }
  localStorage.setItem(API_KEY_REMEMBER, remember ? "1" : "0");
};

export const clearApiKey = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(API_KEY);
  localStorage.setItem(API_KEY_REMEMBER, "0");
};

export const shouldRememberApiKey = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(API_KEY_REMEMBER) === "1";
};

export const saveBirthProfile = (data: BirthInput) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
};

export const readBirthProfile = (): BirthInput | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PROFILE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as BirthInput;
  } catch {
    return null;
  }
};

const KEY = "nfc_profile";

export type ProfileMeta = {
  id: string;
  slug: string;
  plan: string;
  actif: boolean;
};

export function getProfileMeta(): ProfileMeta | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}

export function setProfileMeta(p: ProfileMeta) {
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function clearProfileMeta() {
  localStorage.removeItem(KEY);
}

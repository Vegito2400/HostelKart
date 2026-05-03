// localStorage-backed mock data layer for hostelKart (frontend-only).
// Uses "storage" events + light polling for pseudo-real-time chat across tabs.
// Now includes Socket.IO integration for real chat functionality.

import { io } from "socket.io-client";

const KEYS = {
  users: "hk_users",
  listings: "hk_listings",
  messages: "hk_messages",
  reports: "hk_reports",
  session: "hk_session",
  token: "hk_token",
  seeded: "hk_seeded_v1",
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Socket.IO client instance
let socket = null;

// Initialize socket connection
const initSocket = () => {
  if (!socket) {
    socket = io(API_BASE.replace('/api', ''), {
      auth: {
        token: localStorage.getItem(KEYS.token)
      }
    });

    socket.on('receive_message', (message) => {
      // Add received message to local cache
      const messages = getMessages();
      const normalizedMessage = normalizeMessage(message);
      if (!messages.find(m => m.id === normalizedMessage.id)) {
        messages.push(normalizedMessage);
        write(KEYS.messages, messages);
        // Trigger UI update
        window.dispatchEvent(new CustomEvent("hk_store_change", { detail: { key: KEYS.messages } }));
      }
    });
  }
  return socket;
};

// Get socket instance
const getSocket = () => {
  return socket || initSocket();
};

const uid = (p = "id") =>
  `${p}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const read = (k, fallback) => {
  try {
    const raw = localStorage.getItem(k);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (k, v) => {
  localStorage.setItem(k, JSON.stringify(v));
  // Dispatch a same-tab event so subscribers react immediately.
  window.dispatchEvent(new CustomEvent("hk_store_change", { detail: { key: k } }));
};

const getToken = () => localStorage.getItem(KEYS.token);

const request = async (path, options = {}) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || data?.error || "Request failed");
  return data;
};

const normalizeUser = (user) => {
  if (!user) return null;
  return {
    ...user,
    id: user.id || user._id,
    hostel: user.hostel || "",
  };
};

const normalizeMessage = (message) => {
  if (!message) return null;
  return {
    ...message,
    id: message.id || message._id,
    createdAt: message.createdAt ? new Date(message.createdAt).getTime() : Date.now(),
  };
};

const rememberUser = (user) => {
  const normalized = normalizeUser(user);
  if (!normalized?.id) return normalized;
  const users = getUsers().filter((u) => u.id !== normalized.id);
  write(KEYS.users, [...users, normalized]);
  return normalized;
};

const normalizeListing = (listing) => {
  if (!listing) return null;
  const seller = typeof listing.sellerId === "object" ? rememberUser(listing.sellerId) : null;
  return {
    ...listing,
    id: listing.id || listing._id,
    sellerId: seller?.id || listing.sellerId,
    condition: listing.condition || "Good",
    createdAt: listing.createdAt ? new Date(listing.createdAt).getTime() : Date.now(),
    updatedAt: listing.updatedAt ? new Date(listing.updatedAt).getTime() : undefined,
  };
};

const cacheListings = (listings) => {
  const normalized = listings.map(normalizeListing).filter(Boolean);
  write(KEYS.listings, normalized);
  return normalized;
};

// -------------------- Seeding --------------------
export const seedIfNeeded = () => {
  if (localStorage.getItem(KEYS.seeded) === "1") return;

  const adminId = uid("u");
  const demoId = uid("u");
  const users = [
    {
      id: adminId,
      name: "Admin",
      email: "admin@hostelkart.com",
      password: "admin123",
      role: "admin",
      hostel: "Admin Office",
      createdAt: Date.now(),
    },
    {
      id: demoId,
      name: "Riya Sharma",
      email: "riya@campus.edu",
      password: "demo123",
      role: "user",
      hostel: "Hostel 7",
      createdAt: Date.now(),
    },
  ];

  const now = Date.now();
  const listings = [
    {
      id: uid("l"),
      title: "Data Structures & Algorithms (Cormen, 3rd Ed)",
      description:
        "Barely used copy, no highlighting. Perfect for the upcoming semester. Pick up from Hostel 7.",
      price: 450,
      category: "Books",
      condition: "Like New",
      images: [
        "https://images.unsplash.com/photo-1598306927075-aea230464a2d?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
      ],
      sellerId: demoId,
      status: "active",
      createdAt: now - 1000 * 60 * 60 * 3,
    },
    {
      id: uid("l"),
      title: "Study Table with Drawer",
      description:
        "Sturdy wooden study table. Moving out, need to sell before the 20th. Minor scratches on top.",
      price: 1200,
      category: "Furniture",
      condition: "Good",
      images: [
        "https://images.unsplash.com/photo-1595428774223-ef52624120d2?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
      ],
      sellerId: demoId,
      status: "active",
      createdAt: now - 1000 * 60 * 60 * 24,
    },
    {
      id: uid("l"),
      title: "Hero Sprint Cycle — 21 Gear",
      description:
        "Great condition, tuned up last month. Includes lock and helmet. Hostel 3 pickup.",
      price: 3500,
      category: "Cycles",
      condition: "Good",
      images: [
        "https://images.unsplash.com/photo-1485965120184-e220f721d03e?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
      ],
      sellerId: adminId,
      status: "active",
      createdAt: now - 1000 * 60 * 60 * 48,
    },
    {
      id: uid("l"),
      title: "Mi Table Lamp — USB Rechargeable",
      description: "Works perfectly. Selling because I got a new one as a gift.",
      price: 300,
      category: "Electronics",
      condition: "Like New",
      images: [
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
      ],
      sellerId: adminId,
      status: "active",
      createdAt: now - 1000 * 60 * 30,
    },
  ];

  localStorage.setItem(KEYS.users, JSON.stringify(users));
  localStorage.setItem(KEYS.listings, JSON.stringify(listings));
  localStorage.setItem(KEYS.messages, JSON.stringify([]));
  localStorage.setItem(KEYS.reports, JSON.stringify([]));
  localStorage.setItem(KEYS.seeded, "1");
};

// -------------------- Users / Auth --------------------
export const getUsers = () => read(KEYS.users, []);
export const getUserById = (id) => getUsers().find((u) => u.id === id);

export const signup = async ({ name, email, password }) => {
  const data = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  localStorage.setItem(KEYS.token, data.token);
  const user = rememberUser(data.user);
  setSession(user.id);
  return user;
};

export const login = async ({ email, password }) => {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem(KEYS.token, data.token);
  const user = rememberUser(data.user);
  setSession(user.id);
  return user;
};

export const logout = () => {
  localStorage.removeItem(KEYS.session);
  localStorage.removeItem(KEYS.token);
};
export const setSession = (userId) => localStorage.setItem(KEYS.session, userId);
export const getSessionUser = () => {
  const id = localStorage.getItem(KEYS.session);
  return id ? getUserById(id) : null;
};

// Promote/demote — used for future admin flows.
export const setUserRole = (userId, role) => {
  const users = getUsers().map((u) => (u.id === userId ? { ...u, role } : u));
  write(KEYS.users, users);
};

// -------------------- Listings --------------------
export const getListings = () => read(KEYS.listings, []);
export const getListingById = (id) => getListings().find((l) => l.id === id);
export const getListingsBySeller = (sellerId) =>
  getListings().filter((l) => l.sellerId === sellerId);

export const fetchListings = async (query = {}) => {
  const qs = new URLSearchParams(query).toString();
  return cacheListings(await request(`/listing${qs ? `?${qs}` : ""}`));
};

export const fetchListingById = async (id) => {
  const listing = normalizeListing(await request(`/listing/${id}`));
  const listings = getListings().filter((l) => l.id !== listing.id);
  write(KEYS.listings, [listing, ...listings]);
  return listing;
};

export const createListing = async (data) => {
  const listing = normalizeListing(await request("/listing", {
    method: "POST",
    body: JSON.stringify(data),
  }));
  write(KEYS.listings, [listing, ...getListings()]);
  return listing;
};

export const updateListing = async (id, patch) => {
  const updated = normalizeListing(await request(`/listing/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  }));
  const listings = getListings().map((l) => (l.id === id ? updated : l));
  write(KEYS.listings, listings);
  return updated;
};

export const deleteListing = async (id) => {
  await request(`/listing/${id}`, { method: "DELETE" });
  write(KEYS.listings, getListings().filter((l) => l.id !== id));
  // Also drop related reports and messages.
  write(KEYS.reports, getReports().filter((r) => r.listingId !== id));
  write(KEYS.messages, getMessages().filter((m) => m.listingId !== id));
};

// -------------------- Messages --------------------
// A conversation is keyed by (listingId, buyerId, sellerId).
export const getMessages = () => read(KEYS.messages, []);

export const conversationKey = (listingId, buyerId, sellerId) =>
  `${listingId}::${buyerId}::${sellerId}`;

export const getConversationsForUser = (userId) => {
  const msgs = getMessages();
  const map = new Map();
  for (const m of msgs) {
    if (m.buyerId !== userId && m.sellerId !== userId) continue;
    const key = conversationKey(m.listingId, m.buyerId, m.sellerId);
    const prev = map.get(key);
    if (!prev || m.createdAt > prev.lastAt) {
      map.set(key, {
        key,
        listingId: m.listingId,
        buyerId: m.buyerId,
        sellerId: m.sellerId,
        lastMessage: m.text,
        lastAt: m.createdAt,
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.lastAt - a.lastAt);
};

export const getThread = async (listingId, buyerId, sellerId) => {
  try {
    // First, get or create the chat
    const chat = await request("/chat", {
      method: "POST",
      body: JSON.stringify({ listingId, otherUserId: buyerId === getSessionUser()?.id ? sellerId : buyerId }),
    });

    // Then get messages for this chat
    const messages = await request(`/chat/${chat._id}/messages`);
    const normalizedMessages = messages.map(normalizeMessage);

    // Cache messages locally for UI
    const existingMessages = getMessages().filter(m =>
      !(m.listingId === listingId && m.buyerId === buyerId && m.sellerId === sellerId)
    );
    write(KEYS.messages, [...existingMessages, ...normalizedMessages]);

    // Join the chat room for real-time updates
    getSocket().emit('join_chat', { chatId: chat._id });

    return normalizedMessages.sort((a, b) => a.createdAt - b.createdAt);
  } catch (error) {
    console.error('Failed to get chat thread:', error);
    // Fallback to local messages
    return getMessages()
      .filter(
        (m) =>
          m.listingId === listingId &&
          m.buyerId === buyerId &&
          m.sellerId === sellerId,
      )
      .sort((a, b) => a.createdAt - b.createdAt);
  }
};

export const sendMessage = async ({ listingId, buyerId, sellerId, senderId, text }) => {
  try {
    // Get or create chat first
    const chat = await request("/chat", {
      method: "POST",
      body: JSON.stringify({ listingId, otherUserId: buyerId === senderId ? sellerId : buyerId }),
    });

    // Send message via Socket.IO
    getSocket().emit('send_message', {
      chatId: chat._id,
      senderId,
      text
    });

    // For immediate UI feedback, create a temporary local message
    const tempMessage = {
      id: uid("temp"),
      listingId,
      buyerId,
      sellerId,
      senderId,
      text,
      createdAt: Date.now(),
      _temp: true, // Mark as temporary
    };

    const messages = getMessages();
    messages.push(tempMessage);
    write(KEYS.messages, messages);

    return tempMessage;
  } catch (error) {
    console.error('Failed to send message:', error);
    // Fallback to local storage
    const msg = {
      id: uid("m"),
      listingId,
      buyerId,
      sellerId,
      senderId,
      text,
      createdAt: Date.now(),
    };
    const msgs = getMessages();
    msgs.push(msg);
    write(KEYS.messages, msgs);
    return msg;
  }
};

// -------------------- Reports --------------------
export const getReports = () => read(KEYS.reports, []);

export const createReport = ({ listingId, reporterId, reason, details }) => {
  const report = {
    id: uid("r"),
    listingId,
    reporterId,
    reason,
    details: details || "",
    status: "open",
    createdAt: Date.now(),
  };
  const reports = getReports();
  reports.unshift(report);
  write(KEYS.reports, reports);
  return report;
};

export const dismissReport = (id) => {
  const reports = getReports().map((r) =>
    r.id === id ? { ...r, status: "dismissed" } : r,
  );
  write(KEYS.reports, reports);
};

// -------------------- Subscribe helper --------------------
// Fires on same-tab writes and on cross-tab "storage" events.
export const subscribe = (callback) => {
  const onCustom = () => callback();
  const onStorage = (e) => {
    if (!e.key || Object.values(KEYS).includes(e.key)) callback();
  };
  window.addEventListener("hk_store_change", onCustom);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener("hk_store_change", onCustom);
    window.removeEventListener("storage", onStorage);
  };
};

export const CATEGORIES = ["Books", "Electronics", "Furniture", "Cycles", "Clothing", "Other"];
export const CONDITIONS = ["New", "Like New", "Good", "Fair"];


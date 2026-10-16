import { Platform } from 'react-native';

// localhost works on iOS sim; Android emulator needs 10.0.2.2.
// On a physical device, replace with your PC's LAN IP (e.g. 192.168.0.42).
const BASE_URL = 'http://localhost:3000';

export async function fetchCatalogue() {
  const res = await fetch(`${BASE_URL}/api/jogos`);
  if (!res.ok) throw new Error('Failed to load catalogue');
  return res.json();
}

export async function fetchGame(id) {
  const res = await fetch(`${BASE_URL}/api/jogos/${id}`);
  if (!res.ok) throw new Error('Failed to load game');
  return res.json();
}

export async function createGame(game) {
  const res = await fetch(`${BASE_URL}/api/jogos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(game),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create game');
  }
  return res.json();
}

export async function editGame(game) {
  const res = await fetch(`${BASE_URL}/api/jogos`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(game),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to edit game');
  }
  return res.json();
}

export async function deleteGame(id) {
  const res = await fetch(`${BASE_URL}/api/jogos/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to delete game');
  }
  return res.json();
}
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { app } from "./firebase";
import type { NewShow, Show } from "./types";

export type { NewShow, Show };

const db = getFirestore(app);
const showsCollection = collection(db, "shows");

export function subscribeToShows(onChange: (shows: Show[]) => void) {
  const q = query(showsCollection, orderBy("date", "asc"));
  return onSnapshot(q, (snapshot) => {
    onChange(
      snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as NewShow),
      })),
    );
  });
}

/**
 * Dispara un rebuild en Netlify para que el HTML prerenderizado
 * (shows/videos embebidos para SEO) se actualice tras un cambio.
 * Sin esta variable configurada, no hace nada.
 */
function triggerRebuild() {
  const hookUrl = import.meta.env.VITE_NETLIFY_BUILD_HOOK_URL;
  if (!hookUrl) return;
  fetch(hookUrl, { method: "POST" }).catch(() => {});
}

export async function addShow(show: NewShow) {
  const result = await addDoc(showsCollection, show);
  triggerRebuild();
  return result;
}

export async function updateShow(id: string, show: NewShow) {
  const result = await updateDoc(doc(db, "shows", id), show);
  triggerRebuild();
  return result;
}

export async function deleteShow(id: string) {
  const result = await deleteDoc(doc(db, "shows", id));
  triggerRebuild();
  return result;
}

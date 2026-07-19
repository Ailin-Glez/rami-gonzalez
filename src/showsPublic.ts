import { collection, getDocs, getFirestore, orderBy, query } from "firebase/firestore/lite";
import { app } from "./firebase";
import type { NewShow, Show } from "./types";

const db = getFirestore(app);

export async function fetchShows(): Promise<Show[]> {
  const snapshot = await getDocs(query(collection(db, "shows"), orderBy("date", "asc")));
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as NewShow),
  }));
}

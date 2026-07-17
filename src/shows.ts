import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Show {
  id: string;
  name: string;
  /** ISO date string, e.g. "2026-08-12" */
  date: string;
  ticketUrl: string;
}

export type NewShow = Omit<Show, "id">;

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

export function addShow(show: NewShow) {
  return addDoc(showsCollection, show);
}

export function updateShow(id: string, show: NewShow) {
  return updateDoc(doc(db, "shows", id), show);
}

export function deleteShow(id: string) {
  return deleteDoc(doc(db, "shows", id));
}

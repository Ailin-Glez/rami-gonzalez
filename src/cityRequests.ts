import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface NewCityRequest {
  nombre: string;
  email: string;
  ciudad: string;
  mensaje: string;
}

const cityRequestsCollection = collection(db, "cityRequests");

export function addCityRequest(request: NewCityRequest) {
  return addDoc(cityRequestsCollection, {
    ...request,
    createdAt: serverTimestamp(),
  });
}

import {
  collection,
  addDoc,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firestore, storage } from "./firebase";
import type {
  AppUser,
  Product,
  Conversation,
  ChatMessage,
  SiteSettings,
} from "./types";

/* ---------------- Users ---------------- */

export async function getUser(uid: string): Promise<AppUser | null> {
  const snap = await getDoc(doc(firestore, "users", uid));
  if (!snap.exists()) return null;
  return { uid: snap.id, ...snap.data() } as AppUser;
}

export async function setUserProfile(
  uid: string,
  data: Partial<AppUser>
): Promise<void> {
  await setDoc(doc(firestore, "users", uid), data, { merge: true });
}

export function subscribeUsers(cb: (users: AppUser[]) => void): () => void {
  const q = query(collection(firestore, "users"));
  return onSnapshot(
    q,
    (snap) => {
      cb(
        snap.docs.map((d) => ({ uid: d.id, ...d.data() } as AppUser))
      );
    },
    () => {
      cb([]);
    }
  );
}

/* ---------------- Products ---------------- */

export async function uploadImage(file: File): Promise<string> {
  const name = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
  const fileRef = ref(storage, `products/${name}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}

export async function createProduct(
  data: Omit<Product, "id" | "createdAt" | "status" | "sellerBanned">
): Promise<string> {
  const ref = await addDoc(collection(firestore, "products"), {
    ...data,
    status: "active",
    sellerBanned: false,
    createdAt: Date.now(),
  });
  return ref.id;
}

export function subscribeProducts(cb: (products: Product[]) => void): () => void {
  const q = query(collection(firestore, "products"));
  return onSnapshot(
    q,
    (snap) => {
      cb(
        snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product))
      );
    },
    () => {
      cb([]);
    }
  );
}

export async function updateProduct(
  id: string,
  patch: Partial<Product>
): Promise<void> {
  await updateDoc(doc(firestore, "products", id), patch);
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(firestore, "products", id));
}

export async function setProductStatus(
  id: string,
  status: Product["status"]
): Promise<void> {
  await updateProduct(id, { status });
}

export async function hideProductsBySeller(sellerId: string): Promise<void> {
  const snap = await getDocs(
    query(
      collection(firestore, "products"),
      where("sellerId", "==", sellerId)
    )
  );
  await Promise.all(
    snap.docs.map((d) =>
      updateDoc(d.ref, { status: "hidden", sellerBanned: true })
    )
  );
}

export async function restoreProductsBySeller(sellerId: string): Promise<void> {
  const snap = await getDocs(
    query(
      collection(firestore, "products"),
      where("sellerId", "==", sellerId)
    )
  );
  await Promise.all(
    snap.docs.map((d) =>
      updateDoc(d.ref, { status: "active", sellerBanned: false })
    )
  );
}

/* ---------------- Conversations & Messages ---------------- */

export async function getOrCreateConversation(
  me: AppUser,
  other: AppUser,
  product?: Product
): Promise<string> {
  const key =
    [me.uid, other.uid].sort().join("_") + (product ? `_${product.id}` : "");
  const snap = await getDocs(
    query(collection(firestore, "conversations"), where("key", "==", key))
  );
  if (!snap.empty) return snap.docs[0].id;

  const ref = await addDoc(collection(firestore, "conversations"), {
    key,
    participants: [me.uid, other.uid],
    names: { [me.uid]: me.nickname, [other.uid]: other.nickname },
    productId: product?.id ?? null,
    productTitle: product?.title ?? null,
    lastMessage: "",
    lastFrom: "",
    lastTime: Date.now(),
  });
  return ref.id;
}

export function subscribeConversations(
  uid: string,
  cb: (conversations: Conversation[]) => void
): () => void {
  const q = query(
    collection(firestore, "conversations"),
    where("participants", "array-contains", uid)
  );
  return onSnapshot(
    q,
    (snap) => {
      const convs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Conversation));
      convs.sort((a, b) => b.lastTime - a.lastTime);
      cb(convs);
    },
    () => cb([])
  );
}

export async function getConversation(
  id: string
): Promise<Conversation | null> {
  const snap = await getDoc(doc(firestore, "conversations", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Conversation;
}

export function subscribeMessages(
  convId: string,
  cb: (messages: ChatMessage[]) => void
): () => void {
  const q = query(
    collection(firestore, "conversations", convId, "chat"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(
    q,
    (snap) => {
      cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ChatMessage)));
    },
    () => cb([])
  );
}

export async function sendMessage(
  convId: string,
  from: string,
  text: string
): Promise<void> {
  const convRef = doc(firestore, "conversations", convId);
  await addDoc(collection(firestore, "conversations", convId, "chat"), {
    from,
    text,
    createdAt: Date.now(),
  });
  await updateDoc(convRef, {
    lastMessage: text,
    lastFrom: from,
    lastTime: Date.now(),
  });
}

/* ---------------- Settings ---------------- */

const SETTINGS_REF = doc(firestore, "settings", "public");

export function subscribeSettings(cb: (s: SiteSettings | null) => void): () => void {
  return onSnapshot(
    SETTINGS_REF,
    (snap) => {
      cb(snap.exists() ? (snap.data() as SiteSettings) : null);
    },
    () => cb(null)
  );
}

export async function saveSettings(
  patch: Partial<SiteSettings>
): Promise<void> {
  await setDoc(SETTINGS_REF, patch, { merge: true });
}

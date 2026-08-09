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
import { CURRENCIES, exchangeRates, totalUsd } from "./currency";
import type { FilterField } from "./filterCatalog";
import type {
  AppUser,
  Product,
  Conversation,
  ChatMessage,
  SiteSettings,
  Currency,
} from "./types";

function withTimeout<T>(
  promise: Promise<T>,
  message: string,
  timeoutMs = 15000
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(message)), timeoutMs)
    ),
  ]);
}

function fileToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("image-read-failed"));
    reader.readAsDataURL(blob);
  });
}

function compressImage(file: File, maxDim = 800): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("not-an-image"));
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("canvas-unavailable"));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(objectUrl);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("encode-failed"))),
        "image/webp",
        0.85
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("image-decode-failed"));
    };
    img.src = objectUrl;
  });
}

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

export async function adjustWallet(
  uid: string,
  currency: Currency,
  amount: number
): Promise<void> {
  const profile = await getUser(uid);
  const current = profile?.wallet?.[currency] ?? 0;
  const next = Math.round((current + amount) * 100) / 100;
  if (next < 0) throw new Error("wallet-insufficient-funds");
  await setUserProfile(uid, {
    wallet: { ...(profile?.wallet ?? {}), [currency]: next },
    walletCurrency: currency,
  });
}

export async function debitSellerActivation(uid: string): Promise<void> {
  const profile = await getUser(uid);
  const wallet = { ...(profile?.wallet ?? {}) } as Partial<Record<Currency, number>>;

  if (totalUsd(wallet) + 1e-9 < 1) throw new Error("wallet-insufficient-funds");

  // Deduct $1 worth, starting from the user's preferred currency,
  // then spreading across whichever currencies hold a balance.
  const preferred = profile?.walletCurrency ?? "USD";
  const order = [...CURRENCIES].sort((a, b) => {
    if (a === preferred) return -1;
    if (b === preferred) return 1;
    return (
      (wallet[b] ?? 0) / exchangeRates[b] -
      (wallet[a] ?? 0) / exchangeRates[a]
    );
  });

  let remainingUsd = 1;
  const next: Partial<Record<Currency, number>> = { ...wallet };
  for (const c of order) {
    if (remainingUsd <= 1e-9) break;
    const bal = next[c] ?? 0;
    if (bal <= 0) continue;
    const balUsd = bal / exchangeRates[c];
    const takeUsd = Math.min(remainingUsd, balUsd);
    const takeLocal = Math.round(takeUsd * exchangeRates[c] * 100) / 100;
    next[c] = Math.round((bal - takeLocal) * 100) / 100;
    remainingUsd -= takeUsd;
  }

  await setUserProfile(uid, {
    isSeller: true,
    sellerPaymentStatus: "paid",
    wallet: next,
    walletCurrency: preferred,
  });
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

export async function uploadImage(file: File, maxDim = 800): Promise<string> {
  const compressed = await compressImage(file, maxDim);
  const name = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}.webp`;
  const fileRef = ref(storage, `products/${name}`);
  try {
    await withTimeout(uploadBytes(fileRef, compressed), "storage-timeout", 60000);
    return withTimeout(getDownloadURL(fileRef), "storage-url-timeout", 15000);
  } catch {
    return fileToDataUrl(compressed);
  }
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

export async function deleteAllProducts(): Promise<void> {
  const snap = await getDocs(collection(firestore, "products"));
  await Promise.all(snap.docs.map((product) => deleteDoc(product.ref)));
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

export async function deleteUserPermanently(
  uid: string,
  byUid: string
): Promise<void> {
  const profile = await getUser(uid);

  const products = await getDocs(
    query(collection(firestore, "products"), where("sellerId", "==", uid))
  );
  await Promise.all(products.docs.map((d) => deleteDoc(d.ref)));

  const convs = await getDocs(
    query(
      collection(firestore, "conversations"),
      where("participants", "array-contains", uid)
    )
  );
  await Promise.all(convs.docs.map((d) => deleteDoc(d.ref)));

  await setDoc(doc(firestore, "deletedUsers", uid), {
    email: profile?.email ?? "",
    nickname: profile?.nickname ?? "",
    deletedAt: Date.now(),
    deletedBy: byUid,
  });

  await deleteDoc(doc(firestore, "users", uid));
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

/* ---------------- Support (client ↔ admin) ---------------- */

export async function getAdmins(): Promise<AppUser[]> {
  const snap = await getDocs(
    query(collection(firestore, "users"), where("role", "==", "admin"))
  );
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() } as AppUser));
}

export async function getOrCreateSupportConversation(
  me: AppUser
): Promise<string> {
  const admins = await getAdmins();
  if (admins.length === 0) throw new Error("no-admin-available");
  return getOrCreateConversation(me, admins[0]);
}

export function subscribeAllConversations(
  cb: (conversations: Conversation[]) => void
): () => void {
  return onSnapshot(
    collection(firestore, "conversations"),
    (snap) => {
      const convs = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() } as Conversation)
      );
      convs.sort((a, b) => b.lastTime - a.lastTime);
      cb(convs);
    },
    () => cb([])
  );
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
  await withTimeout(
    setDoc(SETTINGS_REF, patch, { merge: true }),
    "settings-timeout"
  );
}

export async function saveGameLogos(
  gameLogos: Record<string, string>
): Promise<void> {
  await saveSettings({ gameLogos });
}

/* ---------------- Filter Catalogs ---------------- */

export function subscribeCatalog(
  cb: (catalog: Record<string, FilterField[]>) => void
): () => void {
  return onSnapshot(
    collection(firestore, "catalog"),
    (snap) => {
      const map: Record<string, FilterField[]> = {};
      snap.docs.forEach((d) => {
        const data = d.data() as { fields?: FilterField[] };
        if (Array.isArray(data.fields)) map[d.id] = data.fields;
      });
      cb(map);
    },
    () => cb({})
  );
}

export async function saveCatalog(
  gameId: string,
  fields: FilterField[]
): Promise<void> {
  await setDoc(doc(firestore, "catalog", gameId), { fields });
}

export async function deleteCatalog(gameId: string): Promise<void> {
  await deleteDoc(doc(firestore, "catalog", gameId));
}

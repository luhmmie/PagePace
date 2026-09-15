import { openDB } from 'idb';

const DB_NAME = 'PagePaceDB';
const STORE_NAME = 'courses';

export async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
}

export async function deleteCourse(id) {
  const db = await getDB();
  return db.delete(STORE_NAME, id);
}



export async function addCourse(course) {
  const db = await getDB();
  return db.add(STORE_NAME, course);
}

export async function updateCourse(course) {
  const db = await getDB();
  return db.put(STORE_NAME, course);
}

export async function getCourse(id) {
  const db = await getDB();
  return db.get(STORE_NAME, id);
}
export async function deleteAllCourses() {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.clear();
  await tx.done;
}
export async function getAllCourses(userId) {
  const db = await getDB();
  const all = await db.getAll(STORE_NAME);
  return all.filter((c) => c.userId === userId);
}

export async function deleteUserCourses(userId) {
  const db = await getDB();
  const all = await db.getAll(STORE_NAME);
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await Promise.all(
    all.filter((c) => c.userId === userId).map((c) => tx.store.delete(c.id))
  );
  await tx.done;
}
import { initializeApp, deleteApp } from 'firebase/app'
import {
  getFirestore,
  connectFirestoreEmulator,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'fake-api-key',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'localhost',
  projectId: process.env.FIREBASE_PROJECT_ID || 'demo-test',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.FIREBASE_APP_ID || 'demo-test',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

if (process.env.FIRESTORE_EMULATOR_HOST) {
  const [host, port] = process.env.FIRESTORE_EMULATOR_HOST.split(':')
  connectFirestoreEmulator(db, host, Number(port))
}

const citiesRef = collection(db, 'cities')

// Add documents
const sf = await addDoc(citiesRef, { name: 'San Francisco', population: 874_961 })
const nyc = await addDoc(citiesRef, { name: 'New York City', population: 8_336_817 })

console.log('Added documents:', sf.id, nyc.id)

// Read documents
const snapshot = await getDocs(citiesRef)
snapshot.forEach((doc) => {
  console.log(doc.id, doc.data())
})

// Delete documents
await deleteDoc(sf)
await deleteDoc(nyc)

console.log('Deleted documents:', sf.id, nyc.id)
 
await deleteApp(app)
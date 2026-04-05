import { initializeApp, deleteApp } from 'firebase/app'
import {
  getFirestore,
  connectFirestoreEmulator,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
} from 'firebase/firestore'

import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions'
import { getAuth, connectAuthEmulator, signOut, signInWithCustomToken } from 'firebase/auth'

const isBun = typeof Bun !== 'undefined'
if (isBun) {
  console.log('Running in Bun environment')
} else {
  console.log('Running in Node.js environment')
}

const runtime = isBun ? 'Bun' : 'Node.js'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'fake-api-key',
  projectId: process.env.FIREBASE_PROJECT_ID || 'demo-test',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const functions = getFunctions(app)

console.log('Initialized Firestore project:', firebaseConfig.projectId)

if (process.env.FIRESTORE_EMULATOR_HOST) {
  console.log('Connecting to Firestore emulator at', process.env.FIRESTORE_EMULATOR_HOST)
  const [host, port] = process.env.FIRESTORE_EMULATOR_HOST.split(':')
  connectFirestoreEmulator(db, host, Number(port))
  connectFunctionsEmulator(functions, '127.0.0.1', 5001)
  connectAuthEmulator(getAuth(), 'http://localhost:9099', { disableWarnings: true })
}

const getAuthToken = httpsCallable(functions, 'getAuthToken')
try {
  const result = await getAuthToken()
  const token = result.data
  console.log('Auth token from Cloud Function:', token)
  await signInWithCustomToken(getAuth(), token)
} catch (error) {
  console.error('Error calling Cloud Function:', error)
}

const executionsRef = collection(db, 'executions')
await addDoc(executionsRef, { date: new Date(), runtime })

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

await signOut(getAuth())
await deleteApp(app)

import { initializeApp, deleteApp } from 'firebase/app'
import {
  getFirestore,
  connectFirestoreEmulator,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from 'firebase/firestore'

const EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080'

const firebaseConfig = {
  apiKey: 'fake-api-key',
  projectId: 'demo-test',
  appId: 'demo-test-app-id',
}

let passed = 0
let failed = 0

function assert(condition, message) {
  if (!condition) {
    console.error('FAIL:', message)
    failed++
  } else {
    console.log('PASS:', message)
    passed++
  }
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const [host, port] = EMULATOR_HOST.split(':')
connectFirestoreEmulator(db, host, Number(port))

try {
  const citiesRef = collection(db, `test-cities-${Date.now()}`)

  // Test: addDoc
  const sf = await addDoc(citiesRef, {
    name: 'San Francisco',
    population: 874961,
  })
  assert(typeof sf.id === 'string' && sf.id.length > 0, 'addDoc returns a document reference with an id')

  const nyc = await addDoc(citiesRef, {
    name: 'New York City',
    population: 8336817,
  })
  assert(typeof nyc.id === 'string' && nyc.id.length > 0, 'addDoc returns a second document reference')

  // Test: getDocs
  const snapshot = await getDocs(citiesRef)
  assert(snapshot.size === 2, `getDocs returns 2 documents (got ${snapshot.size})`)

  const names = []
  snapshot.forEach((d) => names.push(d.data().name))
  assert(names.includes('San Francisco'), 'getDocs includes San Francisco')
  assert(names.includes('New York City'), 'getDocs includes New York City')

  // Test: getDoc (single document)
  const sfSnap = await getDoc(doc(db, citiesRef.path, sf.id))
  assert(sfSnap.exists(), 'getDoc returns existing document')
  assert(sfSnap.data().name === 'San Francisco', 'getDoc data matches')

  // Test: deleteDoc
  await deleteDoc(sf)
  await deleteDoc(nyc)

  const afterDelete = await getDocs(citiesRef)
  assert(afterDelete.size === 0, `deleteDoc removes documents (got ${afterDelete.size})`)
} finally {
  await deleteApp(app)
}

console.log(`\nResults: ${passed} passed, ${failed} failed`)

if (failed > 0) {
  process.exit(1)
}

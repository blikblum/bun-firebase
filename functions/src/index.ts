/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from "firebase-functions"
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { HttpsError, onCall } from "firebase-functions/v2/https"
import { getAuth } from "firebase-admin/auth"
import { initializeApp } from "firebase-admin/app"

setGlobalOptions({ maxInstances: 1 })

initializeApp()

const cliUid = "cli-user"

export const getAuthToken = onCall<{ accessKey: string }, Promise<string | undefined>>(async () => {
  try {
    const auth = getAuth()
    // todo check if accessKey is valid i.e exists in accessKeys/{accessKey} and is active
    // if not, add a notification ("Chave de acesso inválida") to the user
    const token = await auth.createCustomToken(cliUid, { cli: true })
    return token
  } catch (error) {
    const { message } = error instanceof Error ? error : { message: "Unknown error" }
    throw new HttpsError("internal", "Falha ao criar token de autenticação", { message })
  }
})

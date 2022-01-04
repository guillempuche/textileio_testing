// Docs on https://github.com/textileio/community/blob/master/docs/docs/tutorials

import { Buckets, Client, Identity, KeyInfo, PrivateKey, ThreadID, UserAuth } from '@textile/hub'
import { threadId } from 'worker_threads'

export { setup, getIdentity, getOrCreateThreadId, getOrCreateBucket, keyInfo }

const setup = async (key: KeyInfo, identity: Identity) => {
  // Use the insecure key to set up the buckets client
  const buckets = await Buckets.withKeyInfo(key)
  // Authorize the user and your insecure keys with getToken
  await buckets.getToken(identity)

  const result = await buckets.open('io.textile.dropzone')
  if (!result.root) {
    throw new Error('Failed to open bucket')
  }
  return {
    buckets: buckets,
    bucketKey: result.root.key,
  }
}

/**
 * Get a basic identity for the user from the cache, if not,
 * we create a new identiy.
 * 
 * Internally we use the `PrivateKey` from Textile.
 *
 * @returns PrivateKey
 */
const getIdentity = (): PrivateKey => {
  /** Restore any cached user identity first */
  const cached = localStorage.getItem("user-private-identity")

  if (cached !== null) {
    // Convert the cached identity string to a PrivateKey and return
    return PrivateKey.fromString(cached)
  }

  // No cached identity existed, so create a new one
  const identity = PrivateKey.fromRandom()

  // Add the string copy to the cache
  localStorage.setItem("user-private-identity", identity.toString())

  return identity
}

/**
 * Get Textile database linked to the user
 * @param auth 
 * @param identity 
 * @returns {Promise<ThreadID>}
 */
const getOrCreateThreadId = async (auth: UserAuth, identity: Identity, threadId?: ThreadID): Promise<ThreadID> => {
  // Initialize the client
  const client = Client.withUserAuth(auth)

  // Connect the user to your API
  const userToken = await client.getToken(identity)

  // Create a new database
  if (threadId == undefined) {
    threadId = await client.newDB(undefined, 'sample_app')
  }

  return threadId
}

const saveData = async (data: Object, threadId: ThreadID, collection: String, auth: UserAuth) => {
  // Initialize the client
  const client = Client.withUserAuth(auth)


}

/**
 * Get a bucket or create if it doesn't exist.
 * 
 * Copied from https://textileio.github.io/js-textile/docs/hub.buckets#example-1
 * 
 * @param auth 
 * @param bucketName 
 */
const getOrCreateBucket = async (auth: UserAuth, bucketName: string) => {
  const buckets = Buckets.withUserAuth(auth);

  // Automatically scopes future calls on `buckets` to the Thread containing the bucket
  const { root, threadID } = await buckets.getOrCreate(bucketName)

  if (!root) throw Error('bucket not created')

  const bucketKey = root.key;
  return { buckets, bucketKey }
}

// // Signing transactions
// async function sign(identity: PrivateKey) {
//   const challenge = Buffer.from('Sign this string');

//   const credentials = identity.sign(challenge);

//   return credentials
// }
// // https://github.com/textileio/community/blob/master/docs/docs/hub/accounts.md
// async function authorize(key: KeyInfo, identity: Identity) {
//   const client = await Client.withKeyInfo(key)
//   await client.getToken(identity)
//   return client
// }

// Textile's keys from admins/developers
const keyInfo: KeyInfo = {
  key: process.env.REACT_APP_TEXTILE_KEY ?? '',
  secret: process.env.REACT_APP_TEXTILE_KEY_SECRET ?? '',
}
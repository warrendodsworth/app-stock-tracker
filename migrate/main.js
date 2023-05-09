/**
 * https://firebase.google.com/docs/admin/setup#linux-or-macos
 * useEmulators
 * - https://firebase.google.com/docs/emulator-suite/connect_auth#node.js-admin-sdk
 *
 * update doesn't accept firestore.Timestamp
 * - https://firebase.google.com/docs/firestore/manage-data/add-data#update-data
 */

// const staging = { projectId: 'linkmatestaging', databaseURL: 'https://linkmatestaging.firebaseio.com' };
// const stagingApp = admin.initializeApp({ credential: admin.credential.cert('../service-key-staging.json'), ...staging });

// Use to point to emulator: https://github.com/firebase/firebase-admin-node/issues/575

const admin = require('firebase-admin');
const path = require('path');

// process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
// process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';

const linkmate = { projectId: 'linkmateapp', databaseURL: 'https://linkmateapp-default-rtdb.asia-southeast1.firebasedatabase.app' };
const linkmateApp = admin.initializeApp({ credential: admin.credential.cert(path.join(__dirname, '../service-key.json')), ...linkmate });

const db = linkmateApp.firestore();
const auth = linkmateApp.auth();
const messaging = linkmateApp.messaging();

module.exports = {
  app: linkmateApp,
  db,
  auth,
  messaging,
};

module.exports.adminsProd = {
  davidUid: 'WRStGFNA4pPI9uNR06OClLSpQS92',
  warrenUid: 'pciP9RZiVOZut0nhJeVFgoF50vn2',
};

module.exports.printUser = function (user, data) {
  if (user?.uid == undefined) {
    console.log(`User undefined: `, user);
  } else {
    console.log(`User: `, user.uid, ' ', user.displayName, data);
  }
};

module.exports.processTokens = tokens => {
  if (typeof tokens == 'string') return [tokens];

  const tokens1 = Array.isArray(tokens) ? tokens || [] : Object.keys(tokens || {});
  return tokens1.filter(t => t !== null && t !== '');
};

module.exports.UserService = {
  ref: uid => db.doc(`users/${uid}`),
  snap: uid => db.doc(`users/${uid}`).get(),
  get: async uid => {
    const snap = await db.doc(`users/${uid}`).get();
    return snap.exists ? { id: snap.id, ...snap.data() } : {};
  },

  metaRef: uid => db.doc(`user_meta/${uid}`),
  meta: async uid => {
    const snap = await db.doc(`user_meta/${uid}`).get();
    return snap.exists ? { id: snap.id, ...snap.data() } : {};
  },
};

const  firebaseAdmin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.GOOGLE_CREDS ?? null);

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
});

const firebaseAuthMiddleware = async (req, res, next) => {
  const authHeader = req.get('authorization');

  if (!authHeader) {
    return res.status(401).send();
  }

  try {
    // Here we authenticate users be verifying the ID token that was sent
    const token = await firebaseAdmin.auth().verifyIdToken(authHeader);
  
    // if (token.email && /@vonage.com$/.test(token.email) || req.body.user_identity === process.env.REACT_APP_EC_NAME) {
    if (token.email || req.body.user_identity === process.env.REACT_APP_EC_NAME) {
      next();
    } else {
      res.status(401).send();
    }
  } catch {
    res.status(401).send();
  }
};

module.exports = firebaseAuthMiddleware;

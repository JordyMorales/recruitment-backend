import admin, { ServiceAccount } from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.RECRUITMENT_FIREBASE_TYPE,
    project_id: process.env.RECRUITMENT_FIREBASE_PROJECT_ID,
    private_key_id: process.env.RECRUITMENT_FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.RECRUITMENT_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.RECRUITMENT_FIREBASE_CLIENT_EMAIL,
    client_id: process.env.RECRUITMENT_FIREBASE_CLIENT_ID,
    auth_uri: process.env.RECRUITMENT_FIREBASE_AUTH_URI,
    token_uri: process.env.RECRUITMENT_FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.RECRUITMENT_FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.RECRUITMENT_FIREBASE_CLIENT_X509_CERT_URL,
  } as ServiceAccount),
  databaseURL: process.env.RECRUITMENT_FIREBASE_DATABASE_URL,
});

export default admin;

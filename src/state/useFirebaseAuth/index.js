import { useCallback, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signInAnonymously } from 'firebase/auth';
import Credential from '../../entities/Credential'

const apiUrl = process.env.REACT_APP_BACKEND_URL || ''

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

export default function useFirebaseAuth() {
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const searchParams = new URLSearchParams(document.location.search);
  const [isFetching, setIsFetching] = useState(false);
  const [muxInit, setMuxInit] = useState(null)
  const [voangeArchive, setVonageArchive] = useState(null)

  const role = searchParams.get('role');

  const initialize = useCallback(
    async (user_identity, roomName) => {
      setIsFetching(true)

      const headers = new window.Headers();

      const idToken = await user.getIdToken();
      headers.set('Authorization', idToken);
      headers.set('content-type', 'application/json');

      const endpoint = `${apiUrl}initialize`;

      return fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          user_identity,
          roomName
        }),
      }).then(async(response) => {
        if(response.ok){
          const jsonResponse = await response.json();
          const credential = new Credential(
            jsonResponse.name, 
            jsonResponse.spaceId, 
            jsonResponse.spaceToken, 
            jsonResponse.broadcastId, 
            jsonResponse.vonageApikey,
            jsonResponse.vonageSessionId,
            jsonResponse.vonageToken );
          setMuxInit(credential)
          return credential;  
        }else throw new Error(response.statusText);
      }).catch((err) => {
        console.err(err)
      }).finally(()=> {
        setIsFetching(false)
      })
    },
    [user]
  );

  const startRecording = useCallback(
    async () => {
      setIsFetching(true)

      const headers = new window.Headers();

      const idToken = await user.getIdToken();
      headers.set('Authorization', idToken);
      headers.set('content-type', 'application/json');

      const endpoint = `${apiUrl}startRecording`;

      return fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ broadcastId: muxInit.broadcastId, spaceId: muxInit.spaceId })
      }).then(response => {
        if(response.ok){
          return;  
        }else throw new Error(response.statusText);
      }).catch((err) => {
        console.err(err)
      }).finally(()=> {
        setIsFetching(false)
      })
    },
    [user, muxInit]
  );

  const stopRecording = useCallback(
    async () => {
      setIsFetching(true)

      const headers = new window.Headers();

      const idToken = await user.getIdToken();
      headers.set('Authorization', idToken);
      headers.set('content-type', 'application/json');

      const endpoint = `${apiUrl}stopRecording`;

      return fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ broadcastId: muxInit.broadcastId, spaceId: muxInit.spaceId })
      }).then(response => {
        if(response.ok){
          return;  
        }else throw new Error(response.statusText);
      }).catch((err) => {
        console.err(err)
      }).finally(()=> {
        setIsFetching(false)
      })
    },
    [user, muxInit]
  );


  const startEcRecording = useCallback(
    async () => {
      if (!muxInit) {
        alert('missing vonage session information')
        return;
      }
      setIsFetching(true)
      const headers = new window.Headers();

      const idToken = await user.getIdToken();
      headers.set('Authorization', idToken);
      headers.set('content-type', 'application/json');

      const endpoint = `${apiUrl}ecStartRecording`;

      return fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ sessionId: muxInit.vonageSessionId, url: window.location.href }),
      }).then(async res => {
        const jsonResponse = await res.json();

        if (!res.ok) {
          const recordingError = new Error(
            jsonResponse.error?.message || 'There was an error starting EC recording rules'
          );
          recordingError.code = jsonResponse.error?.code;
          return Promise.reject(recordingError);
        }

        setVonageArchive(jsonResponse)
        return jsonResponse;
      }).catch((err) => {
        console.err(err)
      }).finally(()=> {
        setIsFetching(false)
      })
    },
    [user, muxInit]
  );

  const stopEcRecording = useCallback(
    async () => {
      if (!voangeArchive) {
        alert('missing vonage archive information')
        return;
      }
      setIsFetching(true)
      const headers = new window.Headers();

      const idToken = await user.getIdToken();
      headers.set('Authorization', idToken);
      headers.set('content-type', 'application/json');

      const endpoint = `${apiUrl}ecStopRecording`;

      return fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ecId: voangeArchive.ecId, archiveId: voangeArchive.archiveId }),
      }).then(async res => {
        const jsonResponse = await res.json();

        if (!res.ok) {
          const recordingError = new Error(
            jsonResponse.error?.message || 'There was an error stopping EC recording'
          );
          recordingError.code = jsonResponse.error?.code;
          return Promise.reject(recordingError);
        }

        return jsonResponse;
      }).catch((err) => {
        console.err(err)
      }).finally(()=> {
        setIsFetching(false)
      })
    },
    [user, voangeArchive]
  );

  const getVonageRecord = useCallback(
    async (archiveId) => {
      setIsFetching(true)
      const headers = new window.Headers();

      const idToken = await user.getIdToken();
      headers.set('Authorization', idToken);
      headers.set('content-type', 'application/json');

      const endpoint = (process.env.REACT_APP_VONAGE_RECORD_ENDPOINT || '/getVonageRecord') + '/' + archiveId;

      return fetch(endpoint, {
        method: 'GET',
        headers
      }).then(async res => {
          const jsonResponse = await res.json()
          return jsonResponse.url
      }).catch((err) => {
        console.err(err)
      }).finally(()=> {
        setIsFetching(false)
      })
    },
    [user]
  );

  useEffect(() => {
    initializeApp(firebaseConfig);
    getAuth().onAuthStateChanged(newUser => {
      setUser(newUser);
      setIsAuthReady(true);
    });
  }, []);

  const signIn = useCallback(() => {
    if (role === process.env.REACT_APP_EC_NAME) {
      return signInAnonymously(getAuth())
        .then((newUser) => {
          setUser(newUser.user);
        }).catch((e) => console.log("error! ", e))
    }
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/plus.login');

    return signInWithPopup(getAuth(), provider).then(newUser => {
      setUser(newUser.user);
    }).catch((e) => console.log("error! ", e))
    ;
  }, [role]);

  const signOut = useCallback(() => {
    return getAuth()
      .signOut()
      .then(() => {
        setUser(null);
      });
  }, []);

  return { user, signIn, signOut, isAuthReady, isFetching, initialize, startRecording, stopRecording, startEcRecording, stopEcRecording, getVonageRecord };
}

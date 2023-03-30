# Mux Multi-party Video React App + Vonage Experience Composer Archiving

## What is it

This application demonstrates integration of Vonage Experience Composer Archiving into Mux multi-party video application.

Mux application is created based on:
1. Backend: [Mux Video API](https://docs.mux.com/guides/video/build-real-time-video-experiences)
2. Frontend [Mux Spaces SDK](https://spaces-js-docs.mux.dev/)

## Features

The Video app has the following features:
- [x] Video conferencing with real-time video and audio
- [x] Enable/disable camera
- [x] Mute/unmute mic
- [x] Start and stop Recording with the [Mux Broadcast](https://docs.mux.com/guides/video/broadcast-real-time-video-to-a-live-stream)
- [x] Start and stop Vonage Experience Composer Archiving with the [Vonage Experience Composer](https://tokbox.com/developer/guides/experience-composer/) and [Vonage Archiving](https://tokbox.com/developer/guides/archiving/)
- [x] Download recorded videos
- [x] Download Vonage archive video

## Notes
1. Mux doesn't provide Recording API, but their Broadcast API will broadcast the conference with a fix layout (default: landscape gallery) and record the broadcast stream automatically
For more info: visit [Mux Broadcast](https://docs.mux.com/guides/video/broadcast-real-time-video-to-a-live-stream)

## Running locally

1. Clone the repo
2. Run `npm install` or `yarn install` install the dependencies in the root directory and /server directory
3. Copy .env.example to .env and fill in the variables.
4. Run `npm run build`
5. Run `npm run server`
6. Open browser `localhost:3002`

Mux variables: [Mux Dashboard](https://dashboard.mux.com/)
- Mux token id and secret: Settings -> Access Tokens -> Generate new token (Mux Video enable)
- Mux signing key and private key: Settings -> Signing Keys -> Generate new key
- Mux Webhook secret: Settings -> Webhooks -> create new webhook -> add your target webhook with endpoint /muxEvent -> Show Signing Secret 

    ```
    MUX_TOKEN_ID = 
    MUX_TOKEN_SECRET = 
    MUX_SIGNING_KEY = 
    MUX_PRIVATE_KEY = 
    MUX_WEBHOOK_SECRET =
    ```

Vonage variables: [Vonage Account](https://tokbox.com/account/#/)
- Vonage API Key/Secret: Projects -> create new project -> get the values from the project you have created

    ```
    VONAGE_API_KEY =
    VONAGE_API_SECRET =
    ```

Firebase Auth variables:
- Follow the instructions in [Firebase Auth](https://firebase.google.com/docs/auth) 

    ```
    REACT_APP_FIREBASE_API_KEY = 
    REACT_APP_FIREBASE_AUTH_DOMAIN = 
    REACT_APP_FIREBASE_DATABASE_URL = 
    REACT_APP_FIREBASE_STORAGE_BUCKET = 
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID = 
    REACT_APP_FIREBASE_APP_ID =  
    REACT_APP_FIREBASE_MEASUREMENT_ID = 
    GOOGLE_CREDS =
    ```
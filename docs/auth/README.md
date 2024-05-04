# Auth API Group

## Auth Flow
Since the system is planned to rely on Google SSO for identity verification of the user, the authentication flow will be formed accordingly as below:
1. Mobile app shows (single) option to sign in with user's Google Account
2. User carries out Google Sign In procedure pre-defined by Google Auth Provider (third-party).
3. Mobile app receives the result of Google Authentication and checks the success condition
   - If authentication is not succesful, mobile app displays message to user about failed procedure and asks to try again and goes back to *step 1*
   - If authentication is successful, mobile app sends received authentication details (including user email, id token) to the server and continues with *step 4*
4. Server verifies received google id token and user email via Google Authentication Provider and checks the success condition
   - If id token is not verified, server returns response to mobile app with pre-defined error code and mobile app displays message to the user according to the user code and goes back to *step 1*.
   - If id token is verified, it continutes with *step 5*
5. Server checks if the received email exists in database
   - If it exists, server proceeds to *step 9*
   - If it does not exist, server continues with *step 6* for onboarding.
6. Server creates new record in database with received user email and generates and sends temporary user id to be used in onboarding process to mobile app
7. Mobile app asks onboarding user details (nickname, preferred genres, avatar picture) and sends it to the server with the temporary user id it received for onboarding process.
8. The server receives onboarding details and creates file record in database for the avatar picture and updates existing user record with received details
9. The server generates JWT token and sends it to mobile app to be used for further authenticated requests

## Routes
- [/auth/login](login.md)
- [/auth/board](board.md)
- [/auth/modify](modify.md)
- [/auth/me](me.md)
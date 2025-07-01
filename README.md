- Data being fetched in the api folder. No registering required or any secrete data. 
- Hooks and Slices are all in there respectable folders. 

- Login form is only for the pre filled users in fake api store. 
- Registering form is there for future projects so that a user may be able to create an account and be logged in automatically afterwards. 
- Fake store api does no allow for such function. 
- if you would like a list of users to test the login function. Please use postman or anything is similar.
   - request the url https://fakestoreapi.com/users and pick whichever user you please. 
- checkout is working but without any error handling at the moment seeing that fake store api does persist the information provided. 
- the only thing that does persist is the cart using the authentication token that is created once you have logged in with the aliases provided by fake store api. 
- Further more advanced functionality and better error handling will be created once a backend that will take the information and persist that information with having to rely on local storage or fake store api. 

- download the folder form github and extract the folder to your desired folder. npm install and then npm run dev and enjoy! 

*** UPDATE *** 

- Using firebase, so an account must be created at firebase.com and your own personal information will have to be saved in a .env file as such

   - VITE_FIREBASE_API_KEY=[YOUR API KEY]
   - VITE_FIREBASE_AUTH_DOMAIN=[YOUR DOMAIN]
   - VITE_FIREBASE_PROJECT_ID=[YOUR PROJECT ID]
   - VITE_FIREBASE_STORAGE_BUCKET=[YOUR STORAGE BUCKET]
   - VITE_FIREBASE_MESSAGING_SENDER_ID=[YOUR SENDER ID]
   - VITE_FIREBASE_APP_ID=[YOUR APP ID]
   - VITE_FIREBASE_MEASUREMENT_ID=[YOUR MEASUREMENT ID]  

- Everything is set up once you have created a .env file in your root folder and added your information. 

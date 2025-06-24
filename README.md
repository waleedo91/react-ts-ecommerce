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
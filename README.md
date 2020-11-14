# BookEat - Frontend

BookEat is an efficient, easy to use and awesome reservation system which is based on a web application. The purpose of this web application is to make communication between customers and restaurantseasier. With BookEat people canmake a reservation in their favorite restaurant within 1 minute. Also,restaurant owners can easily manage those reservationsin one single page. This is the repository for frontend side of BookEat.

## How to Set up
1. Copy and paste the link into a terminal or visual studio code with the following command: git clone https://github.com/hyunjiLeeTech/BookEat.git
2. Firstly, setup the backend. Move your location to your backend directory. (e.i., `cd /BookEat/backend`)
3. install all the dependencies using the npm command: npm i
4. To connect to the database, create an .env file and put your MongoDB database connection string with the variable name. 
- The syntax of the string is the following: `ATLAS_URI=<mongobd connection string>`
- The string for test is the following: `ATLAS_URI=mongodb+srv://bookeat:Password123!@bookeat.rf4uz.mongodb.net/BookEat?retryWrites=true&w=majorityATLAS_URI=mongodb+srv://BookEat:zCFux4oJW3LbSCz4@bookeat.9xjtn.mongodb.net/BookEat?retryWrites=true&w=majority`
5. Check the localhost number on the files in the backend folder named customer.js, server.js, and restaurant.js follow your frontend link (ex localhost:3000)
6. Run the backend using `nodemon server`
7. Secondly, setup the frontend. Use the cd command to make sure you are in the folder named 'frontend'.
8. Install all the dependencies using the npm command: npm i
9. Check the ServerUrl.js has the backend localhost number (ex localhost: 5000)
10. After you install all the dependencies and made the necessary changes, run the application by using 'npm start'
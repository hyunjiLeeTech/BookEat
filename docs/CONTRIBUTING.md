# BookEat

## How to Set up

1. Copy and paste the link into a terminal or visual studio code with the following command: git clone https://github.com/hyunjiLeeTech/BookEat.git
2. Firstly, setup the backend. Move your location to your backend directory. (e.i., `cd /BookEat/backend`)
3. install all the dependencies using the npm command: npm i
4. To connect to the database and to use email confirmation, create an .env file with some variable names. Check our [.env guide](./env.md) for more details.

- The syntax of the string is the following: `ATLAS_URI=<mongobd connection string>`
- The string for test is the following: `ATLAS_URI=mongodb+srv://bookeat:Password123!@bookeat.rf4uz.mongodb.net/BookEat?retryWrites=true&w=majorityATLAS_URI=mongodb+srv://BookEat:zCFux4oJW3LbSCz4@bookeat.9xjtn.mongodb.net/BookEat?retryWrites=true&w=majority`

5. Check the localhost number on the files in the backend folder named customer.js, server.js, and restaurant.js follow your frontend link (ex localhost:3000)
6. Run the backend using `nodemon server`
7. Secondly, setup the frontend. Use the cd command to make sure you are in the folder named 'frontend'.
8. Install all the dependencies using the npm command: npm i
9. Check the ServerUrl.js has the backend localhost number (ex localhost: 5000)
10. After you install all the dependencies and made the necessary changes, run the application by using 'npm start'

## Formatting - How to Run Prettier Formatter

This command-line tool use 'Prettier' formatter for formatting. The detailed document about the prettier is the following: [prettier](https://prettier.io/)

1. Open the terminal
2. Enter `npm run prettier`

- If you want to ignore certain file, add the file on the '.prettierignore' file.
- If you want to check whether the fiels are formatted or not, run `npm run prettier-check`

## IDE Integration

When you try to contribute to this project, please check whether the formatter (Prettier) is automatically working when you save the file. If it does not work, please install 'Prettier' extension.

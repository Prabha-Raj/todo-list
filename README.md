# React + Vite

# to start this app 
<!-- start backend server  -->
# go to in backend folder  run the command 
1===> npm i
2==> set your .env variable
    JWT_SECRET= your_secret key
    MONGO_URI= your mongodb url
    NODE_ENV=development || production
    PORT=5000 
    CORS_ORIGIN=http://localhost:5173/ <!-- your frontend origin -->

3===> npm start  || node server.js


<!-- start frontend -->
# go to root directory where src folder is visible and run the command
1===> npm i
2==> set your .env variable
    VITE_BASE_URL=http://localhost:5000/api <!-- your backend server url /api -->

3===> npm run dev

# api details 
<!-- user auth -->
# post http://localhost:5000/api/auth/register
req body
{
    "name":"Prabhakar Rajput",
    "email":"prabha@gmail.com",
    "password":"123"
}

# post http://localhost:5000/api/auth/login
req body
{
    "email":"prabha@gmail.com",
    "password":"123"
}

# post http://localhost:5000/api/auth/logout

<!-- tasks -->
# post http://localhost:5000/api/tasks/
req body
{
    "title":"Second task",
    "description":"this is my second task"
}

# get http://localhost:5000/api/tasks/
# put http://localhost:5000/api/tasks/${taskId}/update
req body
{
    "title":"first task",
    "description":"this is my second task"
}
# delete http://localhost:5000/api/tasks/${taskId}/delete

<!-- for toggle statas like mark as completed or uncompleted -->
# patch http://localhost:5000/api/tasks/${taskId}/toggle

<!-- get stats for a user  -->
# get http://localhost:5000/api/tasks/stats

<!-- example -->

<!-- in apis send token also using bearer or cookies
  return API.post(
    "/logout",
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}; -->


# technologies i have used MERN stack

# -- in frontend you can see dependencies 
 "dependencies": {
    "@tailwindcss/vite": "^4.1.11",
    "axios": "^1.10.0",
    "chart.js": "^4.5.0",
    "react": "^19.1.0",
    "react-chartjs-2": "^5.3.0",
    "react-dom": "^19.1.0",
    "react-icons": "^5.5.0",
    "react-loading-skeleton": "^3.5.0",
    "react-router-dom": "^7.6.3",
    "tailwindcss": "^4.1.11"
  },

# -- in backend you can see dependencies 
"dependencies": {
    "bcryptjs": "^3.0.2",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^17.1.0",
    "express": "^5.1.0",
    "express-rate-limit": "^7.5.1",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.16.2",
    "nodemon": "^3.1.10"
  }


# deployement 

Source Code on GitHub
	https://github.com/Prabha-Raj/todo-list

Backend on render
	https://todo-list-mcju.onrender.com/

Frontend on netlify 
	https://todoappbyprabha.netlify.app/













This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

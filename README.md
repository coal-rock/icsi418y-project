# Project Manager

## How to run

1. Clone the repo:
```bash
git clone https://github.com/coal-rock/icsi418y-project
cd icsi418y-project
```

2. Create the .env file for the backend in `server/.env`:
```bash
MONGODB_URI=<mongo uri here>
DB_TITLE=<database title here>
PORT=9000
CLIENT=http://localhost:5173
```

3. Install frontend dependencies
```bash
cd client 
npm install
cd ..
```

4. Install backend dependencies
```bash
cd server
npm install
cd ..
```

5. In a separate terminal, start the frontend:
```bash
cd client
npm run dev
```

6. In a separate terminal, start the backend:
```bash
cd server 
npm run dev
```

You should be able to see the frontend running at [http://localhost:5173](http://localhost:5173)

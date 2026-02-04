backend run command

# On Linux / macOS
python3 -m venv venv
source venv/bin/activate
uvicorn main:app --reload

# On Windows (PowerShell)
python -m venv venv
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload

frontend run command

npm install
npm run dev
# project



if on vscode:
```
py -m venv .venv
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
.venv\scripts\activate
```

else ignore second line

pip install -r requirements.txt

python:
```
    from app import app, db  
    with app.app_context():  
        db.create_all()
```
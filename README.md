# project

pip install -r requirements.txt

python:
`from app import app, db
with app.app_context():
    db.create_all()`

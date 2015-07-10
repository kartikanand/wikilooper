from app import app
from flask import render_template, request
from .looper import getNextLink

@app.route('/')
def index_page():
    return render_template('index.html')

@app.route('/loop')
def loop_request():
    link = request.args.get('link', '', type=str)
    return getNextLink(link.strip())

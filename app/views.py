from app import app
from flask import render_template, request
from .looper import getNextLink

@app.route('/')
def index_page():
    return render_template('index.html')

@app.route('/loop')
def loop_request():
    if "unicode" in __builtins__:
        str_type = unicode
    else:
        str_type = str
    link = request.args.get('link', '', type=str_type)
    return getNextLink(link.strip())

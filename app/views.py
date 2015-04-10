from app import app
from flask import render_template, request
from looper import getNextLink

link_list = None

@app.route('/')
def index_page():
    return render_template('index.html')

@app.route('/loop')
def loop_request():
    global link_list
    link = request.args.get('link', '', type=str)
    first = request.args.get('first', 0, type=int)

    if first == 0:
        return ""
    elif first == 1:
        link_list = []

    next_link = getNextLink(link.strip())
    
    if link_list and next_link in link_list:
        return ""
    else:
        link_list.append(next_link)
        return next_link

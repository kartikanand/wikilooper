# wikilooper
Wikilooper web version

### View Demo at
[Wikilooper](http://wikilooper.herokuapp.com/)

### Description
Clicking on the first link in the main text of a Wikipedia article, and then repeating the process for subsequent articles, one would  eventually get to the Philosophy article. 
Unless there is an article with no wikilinks or with links to pages that do not exist, or gets stuck in a loop. By entering the first article, wikilooper will take you through the links one would encounter until it reaches Philosophy or gets stuck in a loop.

### Requirements
- beautifulsoup4==4.3.2
- Flask==0.10.1
- gunicorn==19.3.0
- itsdangerous==0.24
- Jinja2==2.7.3
- MarkupSafe==0.23
- requests==2.6.0
- Werkzeug==0.10.4

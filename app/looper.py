from __future__ import print_function
import requests
try:
    import urllib.parse as urllib
except ImportError:
    import urllib
from bs4 import BeautifulSoup
from .utils import lru_cache

def getLinkInPara(para_list):
    for para in para_list:
        bracket = 0
        for tag in para.children:
            if tag.name is None and tag.string is not None:
                if '(' in tag.string.strip():
                    bracket += 1
                if ')' in tag.string.strip():
                    bracket -= 1

            if tag.name == 'a' and bracket == 0:
                next_link = tag['href']
                if '#' in next_link:
                    continue
                return next_link
    return None

@lru_cache(maxsize=65536)
def getNextLink(link):
    wiki_url = "http://en.wikipedia.org/wiki/"

    r = requests.get(wiki_url + link)
    if r.status_code != 200:
        print(link + "Not a valid wiki link")
        return "--ERROR1--"

    data = r.text
    soup = BeautifulSoup(data)
    div = soup.find_all(id="mw-content-text")[0]

    para_list = [child for child in div.children if child.name == 'p']

    next_link = getLinkInPara(para_list)

    if next_link is None:
        for child in div.children:
            if child.name == 'ul':
                ul = child
                break
        else:
            return "--ERROR2--"

        try:
            next_link = ul.li.a['href']
            if next_link is None:  # this should never happen
                return "--ERROR3--"
        except:
            return "--ERROR2--"

    args = next_link.split("/")[-1]
    args = urllib.unquote(str(args))
    try:
        print(args)
    except UnicodeEncodeError:
        print("unprintable Unicode args")
    return args

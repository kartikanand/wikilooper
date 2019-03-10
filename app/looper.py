from __future__ import print_function
import requests
import re

try:
    import urllib.parse as urllib
except ImportError:
    import urllib

from bs4 import BeautifulSoup
from .utils import lru_cache

def getLinkInPara(para_list, skips):
    count = 0
    for para in para_list:
        bracket = 0
        for tag in para.children:
            if tag.name is None and tag.string is not None:
                if '(' in tag.string.strip():
                    bracket += 1
                if ')' in tag.string.strip():
                    bracket -= 1

            if tag.name == 'a' and bracket == 0:
                # if we've already found a skips
                # get the next link instead
                if skips:
                    skips -= 1
                    continue

                next_link = tag['href']
                next_link = re.sub(r"#.*", "", next_link)

                return next_link

    return None

@lru_cache(maxsize=65536)
def getNextLink(link, skips):
    wiki_url = "http://en.wikipedia.org/wiki/"

    r = requests.get(wiki_url + link)
    if r.status_code != 200:
        print(link + "Not a valid wiki link")
        return "--INVALID--"

    data = r.text
    soup = BeautifulSoup(data)
    div = soup.find_all(id="mw-content-text")[0]
    para_list = [child for child in div.children if child.name == 'p']

    if len(para_list) == 0:
        div = div.find_all('div', class_="mw-parser-output")[0]
        para_list = [child for child in div.children if child.name == 'p']

    next_link = getLinkInPara(para_list, skips)

    if next_link is None:
        for child in div.children:
            if child.name == 'ul':
                ul = child
                break
        else:
            return "--ERROR--"

        try:
            next_link = ul.li.a['href']
            if next_link is None:  # this should never happen
                return "--ERROR--"
        except:
            return "--ERROR--"

    args = next_link.split("/")[-1]
    args = urllib.unquote(str(args))
    try:
        print(args)
    except UnicodeEncodeError:
        print("unprintable Unicode args")
    return args

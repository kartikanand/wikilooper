import requests
from bs4 import BeautifulSoup

def getLinkInPara(para_list):
    for para in para_list:
        bracket = 0
        for tag in para.children:
            if tag.name is None and tag.string is not None:
                if '(' in tag.string.strip():
                    bracket = bracket + 1
                if ')' in tag.string.strip():
                    bracket = bracket - 1

            if tag.name == 'a' and bracket == 0:
                next_link = tag['href']
                return next_link
    return None

def getNextLink(link):
    wiki_url = "http://en.wikipedia.org/wiki/"

    r = requests.get(wiki_url+link)
    if r.status_code != 200:
        print(link + "Not a valid wiki link")
        return "--ERROR1--"

    data = r.text
    soup = BeautifulSoup(data)
    div = soup.find_all(id="mw-content-text")[0]

    para_list = []
    for child in div.children:
        if child.name == 'p':
            para_list.append(child)

    next_link = None
    if para_list is not None:
        next_link = getLinkInPara(para_list)

    if next_link is None:
        ul = None
        for child in div.children:
            if child.name == 'ul':
                ul = child
                break

        if ul is None:
            return "--ERROR2--"

        try:
            next_link = ul.li.a['href']
        except:
            return "--ERROR2--"
            
    if next_link is not None:
        args = next_link.split("/")[-1]
        print args
        return args
    else:
        return "--ERROR3--"

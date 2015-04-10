
function removeElementsfromList() {
    var list = document.getElementById('wiki-loop-list'),
        items = Array.prototype.slice.call(list.childNodes),
        item;
    
    while (item = items.pop()) {
            list.removeChild(item);
    }
}

function wikiLoop(link, first)
{
    var xmlHttp = null;
    link = link || document.getElementById("search-box").value;
    
    // For first time pass value of first as 1, so that server is able to reset link-list
    first = first || 1;

    if(first == 1)
    {
        removeElementsfromList();
    }
    
    xmlHttp = new XMLHttpRequest();  
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200) {
                addToList(xmlHttp.responseText);
            }
        }
    }
        
    xmlHttp.open("GET", "/loop?first="+first+"&link="+link, true);
    xmlHttp.send(null);
}

function addToList(nextLink) {
    if (nextLink != "") {
        var list = document.getElementById("wiki-loop-list");
        var entry = document.createElement("li");
        entry.appendChild(document.createTextNode(nextLink));
        list.appendChild(entry);
        
        wikiLoop(nextLink, 2);
    }
}
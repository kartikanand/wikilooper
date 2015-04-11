function removeElementsfromList() {
    var list = document.getElementById('wiki-loop-list'),
        items = Array.prototype.slice.call(list.childNodes),
        item;
    
    while ((item = items.pop())) {
        list.removeChild(item);
    }
}

function wikiLoop(link, first) {
    var xmlHttp = null;
    link = link || document.getElementById("wiki-form-search-box").value;
    
    // For first time pass value of first as 1, so that server is able to reset link-list
    first = first || 1;

    if (first === 1) {
        removeElementsfromList();
        addToList(link);
    }
    else {
        addToList(link);
    }
    
    xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200) {
                var nextLink = xmlHttp.responseText;
                if (nextLink !== "--STOP--" && nextLink !== "--Loop Found--" && nextLink !== "--Error Try Again--") {
                    wikiLoop(nextLink, 2);
                }
                else {
                    addToList(nextLink);
                }
            }
        }
    };
        
    xmlHttp.open("GET", "/loop?first=" + first + "&link=" + link, true);
    xmlHttp.send(null);
}

function removeClassActive(list) {
    var items = Array.prototype.slice.call(list.childNodes);

    if (items.length > 0) {
        var tail = items[items.length - 1];
        tail.className = tail.className.replace('active', '');
    }
}

function addToList(nextLink) {
    if (nextLink) {
        var list = document.getElementById("wiki-loop-list"),
            entry = document.createElement("li");
        
        removeClassActive(list);
        
        entry.appendChild(document.createTextNode(nextLink));
        entry.className = "wiki-loop-list-item active";
        list.appendChild(entry);
    }
}
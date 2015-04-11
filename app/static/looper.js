var list = null;

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
    
    // Check for first-time to create new list
    first = first || 1;

    if (first === 1) {
        removeElementsfromList();
        addToList(link);
        list = [link];
    } else {
        if (link == "Philosophy") {
            addToList("Philosophy");
            addToList("STOP");
            return;
        }
        
        if (list.indexOf(link) > -1) {
            addToList("Loop Found");
            return;
        }
        
        addToList(link);
        list[list.length] = link;
    }
    
    xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200) {
                wikiLoop(xmlHttp.responseText, 2);
            }
        }
    };
        
    xmlHttp.open("GET", "/loop?link=" + link, true);
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
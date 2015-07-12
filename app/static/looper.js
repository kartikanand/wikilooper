var list = null;
var running = false;

function removeElementsfromList() {
    var list = document.getElementById('wiki-loop-list'),
        items = Array.prototype.slice.call(list.childNodes),
        item;
    
    while ((item = items.pop())) {
        list.removeChild(item);
    }
}

function wikiLoop(first, link) {
    if (first === 1) {
        
        if (running === true) {
            return;
        }

        link = link || document.getElementById("wiki-form-search-box").value;
        if (link == "") {
            removeElementsfromList();
            addToList("Enter Something!");
            
            return;
        }
        
        running = true;

        hideAbout();
        removeElementsfromList();
        addToList(link);
        list = [link];
    } else {
        if (link == "--ERROR1--") {
            addToList("Not a valid Wiki Link");
            
            running = false;
            return;
        }
        
        if (link == "--ERROR2--") {
            addToList("Error 2");
            
            running = false;
            return;
        }
        
        if (link == "--ERROR3--") {
            addToList("Error 3");
            
            running = false;
            return;
        }
        
        if (link == "Philosophy") {
            addToList("Philosophy");
            addToList("STOP");
            
            running = false;
            return;
        }
        
        if (list.indexOf(link) > -1) {
            addToList("Loop Found");
            addToList("Between " + list[list.length - 1] + " and " + link);
            
            running = false;
            return;
        }
        
        addToList(link);
        list[list.length] = link;
    }
    
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200) {
                wikiLoop(2, xmlHttp.responseText);
            }
        }
    };
        
    xmlHttp.open("GET", "/loop?link=" + link, true);
    xmlHttp.send(null);
}

function toggleAbout() {
    var about = document.getElementById("wiki-loop-about");
    var disp = about.style.display;
    if (disp == "") {
        about.style.display = "block";
    }
    else {
        about.style.display = "";
    }
}

function showAbout() {
    var about = document.getElementById("wiki-loop-about");
    about.style.display = "block";
}

function hideAbout() {
    var about = document.getElementById("wiki-loop-about");
    about.style.display = "none";
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
            entry = document.createElement("li"),
            anchor = document.createElement("a");
        
        removeClassActive(list);
        
        anchor.appendChild(document.createTextNode(nextLink));
        anchor.setAttribute('href', 'http://en.wikipedia.org/wiki/' + nextLink);
        entry.className = "wiki-loop-list-item big-font active";
        entry.appendChild(anchor);
        list.appendChild(entry);
    }
}

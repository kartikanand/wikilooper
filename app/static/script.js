let list = null;
let running = false;


window.onload = function() {
    const btn = document.querySelector('#js-start');
    btn.addEventListener('click', (ev) => {
        // prevent any default triggers
        ev.preventDefault();

        const currentLink = document.getElementById("wiki-form-search-box").value;
        if (currentLink == '') {
            removeElementsfromList();
            addToList("Enter Something!");

            return;
        }

        // reset everything
        hideAbout();
        removeElementsfromList();
        list = [];

        wikiLoop(currentLink);
    })
};


function wikiLoop(link) {
    if (link != 'Philosophy') {
        if (link == '--INVALID--') {
            addToList('Not a valid Wiki Link');
            return;
        } else if (link == '--ERROR--') {
            addToList('Something went wrong');
            return;
        } else if (link == '--LOOP--') {
            addToList('Too many loops');
            return;
        }

        addToList(link);
        list.push(link);

        link = getNextLink(link, 0);
    } else {
        addToList('Philosophy');
        addToList('STOP');
    }
}


function getNextLink(link, skips) {
    // don't handle too many loops
    if (skips == 5) {
        wikiLoop('--LOOP--');

        return;
    }

    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200) {
                nextLink = xmlHttp.responseText;
                // check if next link already exists in the list
                if (nextLink == '' || list.indexOf(nextLink) > -1) {
                    getNextLink(link, skips + 1);
                } else {
                    wikiLoop(nextLink);
                }
            }
        }
    };

    xmlHttp.open("GET", "/loop?link=" + link + "&skips=" + skips, true);
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


function removeElementsfromList() {
    var list = document.getElementById('wiki-loop-list'),
        items = Array.prototype.slice.call(list.childNodes),
        item;

    while ((item = items.pop())) {
        list.removeChild(item);
    }
}


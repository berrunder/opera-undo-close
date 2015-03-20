(function() {
    var container = document.getElementById('container'),
        filter = document.getElementById('filter-input'),
        closedTabs;

    function getList(tabs) {
        return tabs.map(function (session) {
            var faviconUrl = session.tab.favIconUrl,
                matches;
            if (!faviconUrl) {
                matches = /^http(?:s)?:\/\/[^\/]+/.exec(session.tab.url);
                faviconUrl = matches && matches.length ? matches[0] + '/favicon.ico' : 'media/icon_16.png';
            }
            return '<a class="li" data-id="' + session.tab.sessionId + '" title="' + session.tab.url +
                '"><div class="item"><img src="' + faviconUrl +
                '"/><span>' + session.tab.title + '</span></div></a>';
        }).join('');
    }

    function render(tabs) {
        if (tabs.length) {
            container.innerHTML = getList(tabs);
            bindClicks();
        } else {
            container.innerHTML = '<div class="li"><span>Nothing found</span></div>'
        }
    }

    chrome.runtime.getBackgroundPage(function(bg) {
        bg.getClosedTabs(function (tabs) {
            closedTabs = tabs;
            render(tabs);
        });
    });

    function restoreTab(id) {
        chrome.runtime.getBackgroundPage(function(bg) {
            bg.restoreTab(id);
        });
    }

    function bindClicks() {
        Array.prototype.forEach.call(document.querySelectorAll('.li'), function (el) {
            el.addEventListener('click', function (e) {
                e.preventDefault();
                restoreTab(this.getAttribute('data-id'));
            }, false);
        });
    }

    function filterTabs(term) {
        if (term.length === 0) {
            render(closedTabs);
            return;
        }

        term = term.toLowerCase();
        var filtered = closedTabs.filter(function (session) {
                return session.tab.title.toLowerCase().indexOf(term) !== -1 || session.tab.url.toLowerCase().indexOf(term) !== -1;
            });
        render(filtered);
    }

    function moveSelection(delta) {
        var tab = document.querySelector('.highlighted'),
            index, newIndex,
            len = container.childNodes.length;

        if (tab) {
            tab.classList.remove('highlighted');
            index = Array.prototype.indexOf.call(container.childNodes, tab);
        } else {
            index = -1;
        }
        newIndex = index + delta;
        if (newIndex < 0 && delta < 0) {
            newIndex = len + delta - index;
        } else if (newIndex >= len) {
            newIndex = index - len + delta;
        }
        container.childNodes[newIndex].classList.add('highlighted');

        if (newIndex === 0) {
            window.scrollTo(0, 0);
        } else if (newIndex === len - 1) {
            window.scrollTo(0, document.body.scrollHeight);
        }
    }

    filter.addEventListener('keydown', function (event) {
        var tab;
        switch (event.keyCode) {
            //up
            case 38:
                moveSelection(-1);
                break;
            //down
            case 40:
                moveSelection(1);
                break;
            case 13:
                tab = document.querySelector('.highlighted');
                if (tab) {
                    restoreTab(tab.getAttribute('data-id'));
                }
                break;
            default:
                filterTabs(this.value.trim());
                break;
        }
    })
})();
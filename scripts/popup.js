var container = document.getElementById('container');

function renderList(tabs) {
    return tabs.map(function(session) {
        return '<div class="li" data-id="' + session.tab.sessionId + '" title="' + session.tab.url + '"><img src="'
            + (session.tab.favIconUrl || 'media/icon_16.png') +
            '"/><span>' + session.tab.title + '</span></div>';
    }).join('');
}

chrome.extension.getBackgroundPage().getClosedTabs(function(tabs) {
    console.log(tabs);
    container.innerHTML = renderList(tabs);
    bindEvents();
});


function bindEvents() {
    Array.prototype.forEach.call(document.querySelectorAll('.li'), function (el) {
        el.addEventListener('click', function () {
            console.log('clicked tab sessionId: ' + el.getAttribute('data-id'));
            chrome.extension.getBackgroundPage().restoreTab(el.getAttribute('data-id'));
        }, false);
    });
}
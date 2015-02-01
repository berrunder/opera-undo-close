chrome.browserAction.onClicked.addListener(function(){
    console.log('Extension button was clicked!');
});

window.getClosedTabs = function(callback) {
    chrome.sessions.getRecentlyClosed(undefined, function(sessions) {
        var closedTabs = sessions.filter(function(item) {
            return !!item.tab;
        });

        callback(closedTabs);
    })
};

window.restoreTab = function(sessionId) {
    chrome.sessions.restore(sessionId, function(session) {
        chrome.tabs.update(session.tab.id, { active: true });
    });
};

//chrome.browserAction.onClicked.addListener(function() {
//});

//function getPopup() {
//    return chrome.extension.getViews({type:'popup'})[0];
//}


window.clientEvent = {
    eventType: {
        openUI: "openUI",
        closeUI: "closeUI",
        gameStart: "gameStart",
        gameOver: "gameOver"
    },
    eventListener: null
}

clientEvent.init = function() {
    clientEvent.eventListener = eventListener.create();
};

clientEvent.on = function(eventName, handler, target) {
    if (typeof eventName !== "string") {
        return;
    }
    clientEvent.eventListener.on(eventName, handler, target);
};

clientEvent.off = function(eventName, handler, target) {
    if (typeof eventName !== "string") {
        return;
    }
    clientEvent.eventListener.off(eventName, handler, target);
};

clientEvent.clear = function(target) {
    clientEvent.eventListener.clear(target);
};

clientEvent.dispatch = function(eventName, data) {
    if (typeof eventName !== "string") {
        return;
    }
    clientEvent.eventListener.dispatch(eventName, data);
};
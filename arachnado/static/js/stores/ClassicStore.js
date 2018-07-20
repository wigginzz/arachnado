require("babel-core/polyfill");
var Reflux = require("reflux");
var debounce = require("debounce");
var { FancyWebSocket } = require("../utils/FancyWebSocket");
var Rpc = require("../utils/Rpc")

export var Actions = Reflux.createActions([
	"setAll",
    "update",
]);


export var store = Reflux.createStore({
    init: function () {
        this.items = [];
        this.listenToMany(Actions);
    },

    getInitialState: function () {
        return this.items;
    },

	onSetAll: function (items) {
		if (typeof items == 'object' && items.constructor == Array)
		{
			this.items = items;
			this.trigger(this.items);
		}
    },
	
    onUpdate: function (item) {
		console.log(typeof(item));
		console.log(typeof(this.items));
		this.items = this.items.concat(item);

		this.trigger(this.items);

    }
});

Rpc.socket.on("open", () => {
    Rpc.call("pages.list").then(function(items){
        Actions.setAll(items);
    });
});

var socket = FancyWebSocket.instance(window.WS_SERVER_ADDRESS);
socket.on("classic:pic", (item) => {
    Actions.update(item);
});


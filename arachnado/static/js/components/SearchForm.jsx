/* A form for starting the crawl */

var React = require("react");
var { Panel, Glyphicon } = require("react-bootstrap");

var JobStore = require("../stores/JobStore");


// it must be rendered inside a small bootstrap Panel
var noPadding = {
    paddingLeft: 0, paddingRight: 0, marginLeft: 0, marginRight: 0
};

var tinyPadding = {
    paddingLeft: 0, paddingRight: 1, marginLeft: 0, marginRight: 0
};

export var SearchForm = React.createClass({
    getInitialState: function () {
        return {value: "", isOptionsVisible: false, settings: [], args: []};
    },

    render: function () {
        var toggleOptionsClass = 'form-control btn btn-info' + (this.state.isOptionsVisible ? ' active' : '');
        return (
            <div>
                <form method="post" className="container-fluid" style={noPadding}
                      action={this.props.action} onSubmit={this.onSubmit}>
                    <div className="form-group row" style={noPadding}>
                        <div className="col-xs-9" style={tinyPadding}>
                            <input type="text" className="form-control" name="domain"
                                   ref="domainInput" value={this.state.value}
                                   onChange={this.onChange}
                                   placeholder="搜索关键字"/>
                        </div>
						<div className="col-xs-2"  style={noPadding}>
                            <button type="submit" className="btn btn-success" style={{width:"100%"}}>Search</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    },

    onChange: function (ev) {
        this.setState({value: this.refs.domainInput.value});
    },

    onSubmit: function (ev) {
        ev.preventDefault();
		var options = {
            settings: null,
            args: {"keywords":this.state.value},
        };
        if (this.state.value != "") {
            JobStore.Actions.startCrawl("spider://ClassicMomentSpider", options);
            this.setState({value: ""});
        }
        this.setState({isOptionsVisible: false})
    },

    onSettingsChange: function(settings) {
        this.setState({settings: settings});
    },

    onArgsChange: function(args) {
        this.setState({args: args});
    },

    toggleOptions: function(e) {
        e.preventDefault();
        this.setState({isOptionsVisible: !this.state.isOptionsVisible});
    },

});


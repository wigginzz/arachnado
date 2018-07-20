var React = require("react");
var Reflux = require("reflux");
var moment = require('moment');
var debounce = require("debounce");
var { Table, Button, ButtonGroup, Glyphicon, Modal, FormControl, Well } = require("react-bootstrap");
var { KeyValueList } = require("../components/KeyValueList");
var { keyValueListToDict } = require('../utils/SitesAPI');
var JobStore = require("../stores/JobStore");
var SitesStore = require("../stores/SitesStore");
var ClassicStore = require("../stores/ClassicStore");
var { SearchForm } = require("../components/SearchForm");
//var { ImageLayout } = require('../utils/ImageLayout');
import ImageLayout from '../utils/ImageLayout';
/*
var ItemRow = React.createClass({
    render: function () {
        var item = this.props.item;
		var info = {
			url:item.url,
			imgUrl:item.imgUrl,
			title:item.title
		};
		var columns = [
			 <div>
			 	<a href={info.url}>
			 		<img  src={info.imgUrl} data-original={info.imgUrl} style='display: block;height: 250px; width: 300px;'/>
			 	</a>
			 	<span style='color:red ; font-size:15px'>{info.title}</span>
			 </div>
        ];
        return <tr>{columns}</tr>;
    },
});

export var PicListWidget = React.createClass({
    render: function () {
        var rows = this.props.items.map(item => {
            return <ItemRow item={item} />;
        });
        return <Table>
            <tbody>{rows}</tbody>
        </Table>;
    }
});
*/

export var ClassicPage = React.createClass({
    mixins: [
        Reflux.connect(ClassicStore.store, "items"),
    ],
    render: function() {	
		
		var items = this.state.items;
		console.log(items);
		if (!items.length) {
			   return (
			   		<div>
						<SearchForm action={window.START_CRAWL_URL} />
					</div>
			   );
		}
		else
		{
			return(
					<div>
						<SearchForm action={window.START_CRAWL_URL} />  
						<ImageLayout items={items} columnWidth={200} columns={5} gutter={8}/>						
					</div>
			);
		}
    }
});

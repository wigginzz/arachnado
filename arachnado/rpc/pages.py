from arachnado.storages.mongotail import MongoTailStorage
from tornado import gen 


class Pages(object):
    """ Pages (scraped items) object exposed via JSON RPC """
    handler_id = None
    callback = None

    def __init__(self, handler, item_storage, **kwargs):
        self.handler = handler
        self.storage = MongoTailStorage(item_storage.mongo_uri,
                                        item_storage.cache_flag)
    @gen.coroutine
    def list(self):
        items_ds = yield self.storage.fetch()
        items = []
        for item in items_ds:
            items.extend(item['items'])
        print(items)
        return items
        

    def subscribe(self, last_id=0, query=None, fields=None, fetch_delay=None):
        if fetch_delay:
            self.storage.fetch_delay = fetch_delay
        self.storage.subscribe('tailed', self._publish, last_id=last_id,
                               query=query, fields=fields)

    def _on_close(self):
        self.storage.unsubscribe('tailed')

    def unsubscribe(self):
        self.storage.unsubscribe('tailed')

    def _publish(self, data):
        if self.callback:
            _callback = self.callback
        else:
            _callback = self.handler.write_event
        if self.storage.tailing:
            _callback(data)

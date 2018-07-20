# -*- coding: utf-8 -*-
from __future__ import absolute_import
import contextlib
import logging
import re

import scrapy
from scrapy.linkextractors import LinkExtractor
from scrapy.http.response.html import HtmlResponse
from autologin_middleware import link_looks_like_logout

from arachnado.utils.misc import add_scheme_if_missing, get_netloc

from arachnado.spider import ArachnadoSpider
class ClassicMomentSpider(ArachnadoSpider):
    """
    A spider which crawls all the website.
    To run it, set its ``crawl_id`` and ``domain`` arguments.
    """

    name = "ClassicMomentSpider"
    start_urls = ['http://www.gov.cn/premier/index.htm']
    

    def __init__(self, *args, **kwargs):
        super(ClassicMomentSpider, self).__init__(*args, **kwargs)
        self.start_url = add_scheme_if_missing(self.domain)
        self.__keywords = kwargs['keywords'].split()

    @property
    def link_extractor(self):
        return LinkExtractor(
            allow_domains=['gov.cn'],
            canonicalize=False,
        )

    @property
    def get_links(self):
        return self.link_extractor.extract_links

    def parse(self, response):
        if not isinstance(response, HtmlResponse):
            self.logger.info("non-HTML response is skipped: %s" % response.url)
            return
            
        content = response.xpath('//div[@class="article oneColumn pub_border"]')                
        keywords = self.__keywords; 
        pattern =  keywords[0]
        for key in range(1,len(keywords),1):
            pattern = pattern + '|' + keywords[key]
        news_conntent = content.xpath('div[@class="pages_content"]/p/text()').extract()
        match = re.findall(pattern,''.join(news_conntent))    
        if len(match):
            imgUrls = content.xpath('div[@class="pages_content"]/p/img/@src').extract()
            for imgurl in imgUrls:
                item = {
                    'url':response.url,
                    'title':content.xpath('h1/text()').extract_first(),
                    'imgurl':re.sub(r'[^\/]+$','',response.url) + imgurl,
                }
                yield item;
        
        if self.settings.getbool('PREFER_PAGINATION'):
            # Follow pagination links; pagination is not a subject of
            # a max depth limit. This also prioritizes pagination links because
            # depth is not increased for them.
            with _dont_increase_depth(response):
                for url in self._pagination_urls(response):
                    yield scrapy.Request(url, meta={'is_page': True})

        for link in self.get_links(response):
            if link_looks_like_logout(link):
                continue
            yield scrapy.Request(link.url, self.parse)

    def _pagination_urls(self, response):
        import autopager
        return [url for url in autopager.urls(response)
                if self.link_extractor.matches(url)]

    def should_drop_request(self, request):
        if 'allow_domain' not in self.state:  # first request
            return
        if not self.link_extractor.matches(request.url):
            return True



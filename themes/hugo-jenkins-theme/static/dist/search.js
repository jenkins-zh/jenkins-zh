function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }
  
  // Initialize lunrjs using our generated index file
  function initLunr() {
    if (!endsWith(baseurl,"/")){
        baseurl = baseurl+'/'
    };
  
    var lunrIndex, pagesIndex;
  
    // lunr.trimmer = function (token) {
    //     //check token is chinese then not replace 
    //     if(!isChineseChar(token.str)){
    //         token.str = token.str
    //             .replace(/^\W+/, '')
    //             .replace(/\W+$/, '');
    //     }
        
    //     return token;
    // }
    lunr.zh = function() {
      this.pipeline.reset();
      this.pipeline.add(lunr.zh.trimmer, lunr.stopWordFilter, lunr.stemmer);
    };
  
    var isChineseChar = (function (){     
       var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;  
       return function(str) {
            return reg.test(str);  
       }
    })();
  
    lunr.zh.trimmer = function(token) {
      return token.update(str => {
        if (isChineseChar(str)) return str;
        return str.replace(/^\W+/, "").replace(/\W+$/, "");
      });
    };
  
    lunr.Pipeline.registerFunction(lunr.zh.trimmer, "trimmer-zh");
  
    // First retrieve the index file
    $.getJSON(baseurl +"index.json")
        .done(function(index) {
            pagesIndex =   index;
            // Set up lunrjs by declaring the fields we use
            // Also provide their boost level for the ranking
            lunrIndex = lunr(function () {
                this.use(lunr.zh);
  
                this.ref("uri");
                this.field('title', {
                    boost: 15
                });
                this.field('tags', {
                    boost: 10
                });
                this.field("content", {
                    boost: 5
                });
  
              pagesIndex.forEach(function (doc) {
                this.add(doc)
              }, this)
            })
        
            /**
             * Trigger a search in lunr and transform the result
             *
             * @param  {String} query
             * @return {Array}  results
             */
            function search(query) {
                // Find the item in our index corresponding to the lunr one to have more info
                return lunrIndex.search(query).map(function(result) {console.log('' + result);
                        return pagesIndex.filter(function(page) {
                            return page.uri === result.ref;
                        })[0];
                    });
            }
            $( document ).ready(function() {
                var searchList = new autoComplete({
                    /* selector for the search box element */
                    selector: $("#search-input").get(0),
                    minChars: 2,
                    delay: 300,
                    /* source is the callback to perform the search */
                    source: function(term, response) {
                        response(search(term));
                    },
                    /* renderItem displays individual search results */
                    renderItem: function(item, term) {
                        var numContextWords = 2;
                        var text = item.content.match(
                            "(?:\\s?(?:[\\w]+)\\s?){0,"+numContextWords+"}" +
                                term+"(?:\\s?(?:[\\w]+)\\s?){0,"+numContextWords+"}");
                        item.context = text;
                        return '<div class="autocomplete-suggestion" ' +
                            'data-term="' + term + '" ' +
                            'data-title="' + item.title + '" ' +
                            'title="' + item.title + '" ' +
                            'data-uri="'+ item.uri + '" ' +
                            'data-context="' + item.context + '">' +
                            '» ' + item.title +
                            '<div class="context">' +
                            (item.context || '') +'</div>' +
                            '</div>';
                    },
                    /* onSelect callback fires when a search suggestion is chosen */
                    onSelect: function(e, term, item) {
                        console.log(item.getAttribute('data-val'));
                        location.href = item.getAttribute('data-uri');
                    }
                });
            });
        })
        .fail(function(jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.error("Error getting Hugo index file:", err);
        });
  }
  
  // Let's get started
  initLunr();
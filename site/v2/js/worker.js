self.importScripts('fuse.min.js')

let result = null;

onmessage = function (e) {
    let searchValue = e.data[0].trim();
    let options = {
        keys: [
            'name',
            'content',
            'date',
        ],
        caseSensitive: false,
        threshold: 0.4,
        location: 0,
        distance: 10e10,
        maxPatternLength: 64,
        minMatchCharLength: 3,
    }


    console.time('search')

    if (searchValue.length <= 3) {
        searchValue = searchValue.toUpperCase();
        options.distance = 10e4;
        options.caseSensitive = true
        options.minMatchCharLength = 1;
        if (searchValue.toUpperCase() === 'SPA') {
            options.location = 5
            options.threshold = 0.6
        }
    } else if (searchValue.length <= 32) {
        options.distance = 10e10
        options.location = 1
        options.minMatchCharLength = 3
    }

    if (searchValue[0] == '"' && searchValue[searchValue.length - 1] == '"') {
        options.threshold = 0.1;
        options.caseSensitive = true
        options.minMatchCharLength = 1;
        searchValue = searchValue.slice(0,-1).slice(1);
    }
    console.timeEnd('search')
    const fuse = new Fuse(e.data[1], options)
    result = fuse.search(searchValue)

    postMessage(result)
}
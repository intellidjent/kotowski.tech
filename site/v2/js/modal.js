
$(function () {
    const
        searchReact = $('#search_input_react'),
        modalOverlay = $('.modalOverlay'),
        closeButton = $('.closeButton'),
        modalSearchInput = $('.modalSearchInput'),
        clearInputButton = $('.clearInputButton');

    $('#search_input_react').attr('readonly', true);
    searchReact.val('')

    const noHistoryBlock =
        '<div class="noHistoryImg">' +
            '<div>' +
                '<img src="/img/loupe-copy.svg">' +
                '<span class="startSearchText">' +
                    'Start typing in what you\'re looking for' +
                '</span>' +
            '</div>' +
        '</div >'

    const noMatchesBlock =
        '<div class="noMatchesImg">' +
            '<div>' +
                '<img src="/img/1.svg">' +
                '<span class="startSearchText">' +
                    '<h6>We couldn\'t find anything</h6>' +
                    '<h4>Try another search term</h4>' +
                '</span>' +
            '</div>' +
        '</div>'

    $('.modalBody').append(noHistoryBlock)
    $('.modalBody').append(noMatchesBlock)

    let history = historyInit();

    // Shows modal and show history if exist
    searchReact.on('click', function () {
        modalOverlay.css('display', 'flex').hide().fadeIn(300)
        clearInputButton.hide();
        modalSearchInput.focus();
        searchReact.val('')

        if (modalSearchInput.val() === '' && !history.length) {
            $('.noMatchesImg').hide()
            $('.noHistoryImg').show()
        } else {
            $('.noMatchesImg').hide()
            $('.noHistoryImg').hide()
            renderHistory();
        }
        if (modalSearchInput.val() !== '') {
            clearInputButton.show();
            $('.historyBlock').detach();
        }
        if (modalSearchInput.val() !== '' && $('.resultCount').html() === "0") {
            $('.noMatchesImg').show()
        }
        $('body').addClass('modalwindow')
    })

    // Methods below are closes modal window
    closeButton.on('click', function () {
        searchReact.val('')
        modalOverlay.hide()
        $('.historyBlock').detach()
        $('body').removeClass('modalwindow')
    })

    $(document).click(function (e) {
        if ($(e.target).is('.modalOverlay')) {
            $('.modalOverlay').fadeOut(300);
            $('.historyBlock').detach()
            $('body').removeClass('modalwindow')
            searchReact.val('')
        }
    });

    //Cleans input string
    clearInputButton.on('click', function () {
        modalSearchInput.val('');
        searchReact.val('')
        $('.modalContent').hide();
        $(this).hide()
        if (!history.length) {
            $('.modalContent').hide()
            $('.noHistoryImg').show()
        } else {
            renderHistory();
        }
        $('.noMatchesImg').hide()
    })

    $(document).on('keydown', function (e) {
        if (e.keyCode === 27) {
            $(modalOverlay).hide();
            $('.historyBlock').detach()
            $('body').removeClass('modalwindow')
        }
    });

    /**
     * Data loading and throw up to Fuse search
     */
    let
        currentVersion = $('a[href="/versions"] > h3').text(),
        ver = null,
        indexPath = 'js/' + currentVersion + '.json',
        getVersions = window.$.getJSON(getBaseUrl() + 'js/versions.json', function (res) {
            return ver = res
        });

    $.ajax({
        url: getBaseUrl() + indexPath,
        cache: false,
        dataType: "json",
        success: function (res) {
            const myWorker = new Worker('/js/worker.js')

            // Live-search as a type
            modalSearchInput.on('keyup', function (e) {
                switch (e.which) {
                    case 16: return; // Shift
                    case 17: return; // Ctrl
                    case 18: return; // Alt
                    case 20: return;
                    case 35: return; // End
                    case 36: return; // Home
                    case 37: return; // cursor left
                    case 38: return; // cursor up
                    case 39: return; // cursor right
                    case 40: return; // cursor down
                    case 78: return; // N (Opera 9.63+ maps the "." from the number key section to the "N" key too!) (See: http://unixpapa.com/js/key.html search for ". Del")
                    case 110: return; // . number block (Opera 9.63+ maps the "." from the number block to the "N" key (78) !!!)
                    case 190: return;
                }
                let a, b, ul, val = this.value;
                let result = null;
                if (window.Worker) {
                    var $this = $(this);
                    var $delay = 500;
                    $('.modalContent').show();
                    $('.historyBlock').hide();
                    $('.noHistoryImg').hide();
                    $('.noMatchesImg').hide();
                    clearInputButton.show()

                    clearTimeout($this.data('timer'));

                    $this.data('timer', setTimeout(function () {
                        $this.removeData('timer');

                        myWorker.postMessage([val, res])
                        myWorker.onmessage = function (e) {
                            result = e.data;
                            const firstSeed = result.slice(0, 10);
                            const modalHeader = $('.modalHeader')

                            closeAllLists();

                            a = document.createElement('div')
                            a.setAttribute('class', 'modalContent')

                            modalHeader.parent().append(a)

                            ul = document.createElement('div')
                            ul.setAttribute('class', 'ul_list')
                            ul.innerHTML =
                                '<h6 class="resultArticles" >' +
                                    '<span class="resultCount">' + result.length + '</span>' + ' ARTICLES FOUND ' +
                                '</h6>'

                            a.appendChild(ul)

                            // check different cases what render: results or history
                            if (val !== '') {
                                if (result.length) {
                                    clearInputButton.show()
                                    $('.historyBlock').hide()
                                    $('.noHistoryImg').hide()
                                    $('.noMatchesImg').hide()
                                } else {
                                    $('.modalContent').insertBefore('.noMatchesImg')
                                    $('.historyBlock').hide()
                                    $('.noHistoryImg').hide()
                                    $('.noMatchesImg').show()
                                }
                            } else {
                                clearInputButton.hide()
                                if (history.length) {
                                    $('.modalContent').hide()
                                    $('.noMatchesImg').hide()
                                    $('.noHistoryImg').hide()
                                    $('.historyBlock').detach()
                                    renderHistory()
                                } else {
                                    $('.modalContent').hide()
                                    $('.noMatchesImg').hide()
                                    $('.noHistoryImg').show()
                                }
                            }

                            // Renders initial results. In dataLazyLoad function renders the next results page.
                            renderMatches(firstSeed);

                            // Should invokes after initial results seed
                            dataLazyLoad();
                        }
                    }, $delay))
                } else {
                    console.error('Your browser doesnt support workers')
                }

                function renderMatches(array) {
                    // Renders direction results and results with typos
                    array.map(function (m) {
                        let
                            content = getSnippet(m.content, val),
                            resultDate = m.date.replace(/-/gi, ', ').replace(/,/, ' '),

                            //generate link to document. Depends on version.
                            linkToDoc = (ver[0] === currentVersion) ? getBaseUrl() + 'docs/' + m.fullPath : getBaseUrl() + 'docs/' + currentVersion + '/' + m.fullPath,
                            linkToSpace = linkToDoc.split('/'),
                            spaceName = '';

                        //define document space
                        if (linkToSpace.indexOf('user-guide') != -1) {
                            if (ver[0] === currentVersion) {
                                linkToSpace = getBaseUrl() + 'docs/iac/core/user-guide'
                            } else {
                                linkToSpace = getBaseUrl() + 'docs/' + currentVersion + '/iac/core/user-guide'
                            }
                            spaceName = 'User Guides'
                        } else if (linkToSpace.indexOf('admin') != -1) {
                            if (ver[0] === currentVersion) {
                                linkToSpace = getBaseUrl() + 'docs/iac/admin/install-spa/overview'
                            } else {
                                linkToSpace = getBaseUrl() + 'docs/' + currentVersion + '/iac/admin/install-spa/overview'
                            }
                            spaceName = 'Administrator\'s Guide'
                        } else {
                            if (ver[0] === currentVersion) {
                                linkToSpace = getBaseUrl() + 'docs/iac'
                            } else {
                                linkToSpace = getBaseUrl() + 'docs/' + currentVersion + '/iac'
                            }
                            spaceName = 'IAC'
                        }

                        // Creates result block with data
                        b = document.createElement("div");
                        b.setAttribute('class', 'result-item')
                        b.innerHTML = 
                            '<p class="resultHighlight">' + highlightArticle(m.name, val) + '</p>' + 
                            '<h6 class="resultArticles">' + resultDate + '</h6>' + 
                            '<span class="item-content">' + 
                                (content !== '' ? highlightSnippet(content, val) : highlightSnippet(m.content, val).trunc(200) + '...') + 
                            '</span>'


                        // On click add result to user's history
                        b.addEventListener("click", function () {
                            $('.modalOverlay').hide()
                            const historyLinks = JSON.parse(localStorage.getItem('historyItems'));
                            const docName = m.name
                            const date = resultDate
                            let historyObjIndex = historyLinks.findIndex(function (o) { return o.docName === docName })
                            if (historyObjIndex > -1) {
                                historyLinks.splice(historyObjIndex, 1)
                            }
                            historyLinks.push({
                                docName: docName,
                                docSpaceName: spaceName,
                                linkToSpace: linkToSpace,
                                linkToDoc: linkToDoc,
                                date: date
                            })
                            localStorage.setItem('historyItems', JSON.stringify(historyLinks));

                            //Redirects to document URL. Depends on index version
                            if (ver[0] === currentVersion) {
                                window.open(getBaseUrl() + 'docs/' + m.fullPath, "_self");
                            } else {
                                window.open(getBaseUrl() + 'docs/' + currentVersion + '/' + m.fullPath, "_self");
                            }
                            closeAllLists();
                        });
                        ul.appendChild(b);
                    })
                }
                /**
                 * LazyLoad results based on pagination concept.
                 */
                function dataLazyLoad() {
                    let pageNumber = 1;
                    let pageSize = 10;

                    $('.modalContent').bind('scroll', function (e) {
                        let
                            wrapper = e.target,
                            list = wrapper.firstElementChild,
                            scrollTop = wrapper.scrollTop,
                            wrapperHeight = wrapper.offsetHeight,
                            listHeight = list.offsetHeight,
                            diffHeight = listHeight - wrapperHeight;

                        if (diffHeight <= scrollTop) {
                            pageNumber++
                            let
                                startRow = (pageNumber - 1) * pageSize,
                                endRow = pageNumber * pageSize,
                                nextChunk = result.slice(startRow, endRow);
                            renderMatches(nextChunk)
                        }
                    })
                }
            })
        },
        error: function (request, status, error) {
            console.log(status + ", " + error + ', ' + request);
        }
    });

    // Renders history of recently visited pages and doc spaces.
    function renderHistory() {
        const historyItemSize = 8;
        const historySpaceSize = -3;

        let historyBlock = document.createElement('div');
        historyBlock.setAttribute('class', 'historyBlock');

        let historyBlockInner = document.createElement('div');

        historyBlockInner.setAttribute('class', 'historyBlockInner');
        historyBlockInner.innerHTML = '<h6 class="resultArticles">' + 'RECENTLY VISITED' + '</h6>';

        //Return last 8 recently visited links if exist
        const historyItemBlock = history.slice(-historyItemSize).reverse().map(function (m) {
            return '<div class="historyItem" onclick="window.open(\'' + m.linkToDoc + '\') ">' + 
                        '<p class="historyText">' + m.docName + '</p>' + 
                        '<h6 class="resultInfo">' + m.date + ' ' + '&nbsp;' + '&nbsp;' + '</h6>' + 
                    '</div>'
        })
        //Return last 3 recent spaces if exist
        const docSpacesBlock = removeDuplicates(history, 'docSpaceName').slice(historySpaceSize).map(function (s) {
            return '<div class="historySpace" onclick="window.open(\'' + s.linkToSpace + '\') ">' + 
                        '<p class="historyText">' + s.docSpaceName + '</p>' + 
                   '</div>'
        })

        $(historyBlockInner).append(historyItemBlock)
        $(historyBlockInner).append('<h6 class="resultSpaces">RECENT SPACES</h6>')
        $(historyBlockInner).append(docSpacesBlock)
        $(historyBlock).append(historyBlockInner);
        $('.modalBody').append(historyBlock);

        function removeDuplicates(myArr, prop) {
            return myArr.filter(function (obj, pos, arr) {
                return arr.map(function (mapObj) {
                    return mapObj[prop]
                }).indexOf(obj[prop]) === pos;
            });
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        let x = document.getElementsByClassName("modalContent");
        for (let i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != modalSearchInput) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    function getBaseUrl() {
        return window.location.protocol + '//' + window.location.host + '/'
    }

    function escapeRegExp(text) {
        return text.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, '\\$&')
    }

    // Snippet for results
    function getSnippet(text, val) {
        const
            preLength = 25,
            posLength = 260;


        let snippet = ''
        let regex = ''

        if (val.length <= 2) {
            regex = new RegExp('.{0,' + preLength + '}' + escapeRegExp(val) + '.{0,' + posLength + '}', 'i');
        } else {
            regex = new RegExp('.{0,' + preLength + '}' + escapeRegExp(val) + '?' + '.{0,' + posLength + '}', 'i');
        }

        if (regex.exec(text) === null) {
            snippet = text.trunc(200)
        } else {
            snippet = (regex.exec(text) || [])[0]
        }
        return '...' + snippet + '...'
    }

    String.prototype.trunc = String.prototype.trunc ||
        function (n) {
            return (this.length > n) ? this.substr(0, n - 1) : this;
        };

    function highlightSnippet(ttl, value) {

        let str = value.trim().split(' ');
        str = str.map(function (i) {
            return i = escapeRegExp(i)
        })

        if (value.length <= 3) {
            return ttl.replace(new RegExp(str.join(' '), 'ig'), function (x) { return '<strong>' + x + '</strong>' });
        } else {
            return ttl.replace(new RegExp(str.join(' ') + '?', 'ig'), function (x) { return '<strong>' + x + '</strong>' });
        }
    }

    function highlightArticle(ttl, value) {

        let str = value.trim().split(' ');
        str = str.map(function (i) {
            return i = escapeRegExp(i)
        })

        // if (value.length <= 2) {
        //     return ttl.replace(new RegExp(str.join('|'), 'ig'), function (x) { return '<strong>' + x + '</strong>' });
        // } else {
        return ttl.replace(new RegExp(str.join('|'), 'ig'), function (x) { return '<strong>' + x + '</strong>' });
        // }
    }

});
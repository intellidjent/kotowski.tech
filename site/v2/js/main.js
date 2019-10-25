// on page load delete middle dot (u+00b7) in itle 
window.onload = disableTagDot;

function disableTagDot() {
    return  document.title = document.title.replace(/\u00b7/i, '')
}

$(function () {
    const navUl = $('.nav-site');
    const actualVersion = $('a[href="/versions"] > h3');
    const nextDocBtn = $('.docs-next.button');
    const prevDocBtn = $('.docs-prev.button > span');
    let versions = function () {
        var tmp = null;
        $.ajax({
            async: false,
            type: "GET",
            dataType: 'json',
            url: getBaseUrl() + '/js/versions.json',
            success: function (data) {
                tmp = data;
            }
        });
        return tmp;
    }();
    let currentVersion = versions[0]

    // Detach docs old navigation arrows
    $('.arrow-prev').detach()
    $('.arrow-next').detach()

    nextDocBtn.append('<svg width="6px" height="11px" viewBox="0 0 8 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><g id="SAP-Landing-page" transform="translate(-1518.000000, -4302.000000)" stroke="#272B30" stroke-width="2"><g id="Group-Copy" transform="translate(1521.000000, 4309.000000) rotate(-180.000000) translate(-1521.000000, -4309.000000) translate(1497.000000, 4285.000000)"><polyline id="Stroke-1" points="26 18 20 24 26 30"></polyline></g></g></g></svg>')

    $('<svg width="6px" height="11px" viewBox="0 0 8 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><g id="SAP-Landing-page" transform="translate(-154.000000, -4302.000000)" stroke="#272B30" stroke-width="2"><g id="Group-Copy-2" transform="translate(159.000000, 4309.000000) rotate(-360.000000) translate(-159.000000, -4309.000000) translate(135.000000, 4285.000000)"><polyline id="Stroke-1" points="26 18 20 24 26 30"></polyline></g></g></g></svg>').insertBefore(prevDocBtn)

    // Hover effect for nav buttons
    nextDocBtn.hover( function () {
        $(this).find('g#SAP-Landing-page').css({stroke: '#fff'})
    })
    nextDocBtn.mouseleave( function () {
        $(this).find('g#SAP-Landing-page').css({stroke: '#272B30'})
    })
    $('.docs-prev.button').hover( function () {
        $(this).find('g#SAP-Landing-page').css({stroke: '#fff'})
    })
    $('.docs-prev.button').mouseleave( function () {
        $(this).find('g#SAP-Landing-page').css({stroke: '#272B30'})
    })
    // Build dropdown resources menu
    navUl.append(
        ' <li class="resourcesMenu">' +
        ' <svg class="resourcesMenuIcon" width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
            '<defs>' +
                '<path d="M5,3 C6.1045695,3 7,3.8954305 7,5 C7,6.1045695 6.1045695,7 5,7 C3.8954305,7 3,6.1045695 3,5 C3,3.8954305 3.8954305,3 5,3 Z M12,3 C13.1045695,3 14,3.8954305 14,5 C14,6.1045695 13.1045695,7 12,7 C10.8954305,7 10,6.1045695 10,5 C10,3.8954305 10.8954305,3 12,3 Z M19,3 C20.1045695,3 21,3.8954305 21,5 C21,6.1045695 20.1045695,7 19,7 C17.8954305,7 17,6.1045695 17,5 C17,3.8954305 17.8954305,3 19,3 Z M5,10 C6.1045695,10 7,10.8954305 7,12 C7,13.1045695 6.1045695,14 5,14 C3.8954305,14 3,13.1045695 3,12 C3,10.8954305 3.8954305,10 5,10 Z M12,10 C13.1045695,10 14,10.8954305 14,12 C14,13.1045695 13.1045695,14 12,14 C10.8954305,14 10,13.1045695 10,12 C10,10.8954305 10.8954305,10 12,10 Z M19,10 C20.1045695,10 21,10.8954305 21,12 C21,13.1045695 20.1045695,14 19,14 C17.8954305,14 17,13.1045695 17,12 C17,10.8954305 17.8954305,10 19,10 Z M5,17 C6.1045695,17 7,17.8954305 7,19 C7,20.1045695 6.1045695,21 5,21 C3.8954305,21 3,20.1045695 3,19 C3,17.8954305 3.8954305,17 5,17 Z M12,17 C13.1045695,17 14,17.8954305 14,19 C14,20.1045695 13.1045695,21 12,21 C10.8954305,21 10,20.1045695 10,19 C10,17.8954305 10.8954305,17 12,17 Z M19,17 C20.1045695,17 21,17.8954305 21,19 C21,20.1045695 20.1045695,21 19,21 C17.8954305,21 17,20.1045695 17,19 C17,17.8954305 17.8954305,17 19,17 Z" id="path-1"></path>' +
            '</defs>' +
            '<g id="Dashboard" stroke="none" stroke-width="1" fill="#ffffff" fill-rule="evenodd">' +
                ' <g id="My-Profile-–-Badge" transform="translate(-1619.000000, -27.000000)">' +
                    '<g id="Header-/-1" transform="translate(300.000000, 0.000000)">' +
                        '<g id="Group-11">' +
                            '<g id="Group" transform="translate(823.000000, 20.000000)">' +
                                ' <g id="icn-/-24-/-resources-3-icn-/-24-/-resources-" transform="translate(493.000000, 4.000000)">' +
                                    ' <mask id="mask-2" fill="white">' +
                                        '<use xlink:href="#path-1"></use>' +
                                    ' </mask>' +
                                        '<use id="Mask" fill="rgba(255, 255, 255, 0.8)" xlink:href="#path-1"></use>' +
                                ' </g>' +
                            ' </g>' +
                        '</g>' +
                    '</g>' +
                '</g>' +
            '</g>' +
        '</svg>' +
        '</li>')

    navUl.append('<div class="dropdown-menu">' +
        '<button class="resourcesCloseBtn">' +
            '<img src="/img/close.svg">' +
        '</button>' +
        '<div class="resourcesGroup">' +
            '<a href="https://www.workfusion.com/iac/" target="_blank" class="resourcesItem">' +
                ' <div class="resourcesItemImg">' +
                    '<img src="/img/wf-logo.svg" style="padding-top: 7px">' +
                ' </div>' +
                '<span class="resourcesItemText">' +
                    '<span class="resourcesItemHeadline">Intelligent Automation Cloud</span>' +
                    '<span class="resourcesItemDesc">Automate your operations</span>' +
                '</span>' +
            '</a>' +
            '<a href="https://automationacademy.com/en" target="_blank" class="resourcesItem">' +
                '<div class="resourcesItemImg">' +
                    '<img src="/img/A.svg">' +
                '</div>' +
                '<span class="resourcesItemText">' +
                    '<span class="resourcesItemHeadline">Automation Academy</span>' +
                    '<span class="resourcesItemDesc">Get free courses</span>' +
                '</span>' +
            '</a>' +
            '<a href="https://forum.workfusion.com/ " target="_blank" class="resourcesItem">' +
                ' <div class="resourcesItemImg">' +
                    '<img src="/img/forum icon.svg">' +
                '</div>' +
                '<span class="resourcesItemText">' +
                    '<span class="resourcesItemHeadline">Forum</span>' +
                    '<span class="resourcesItemDesc">Get support from expert users</span>' +
                ' </span>' +
            ' </a>' +
        '</div>' +
        '<div class="resourcesLinksHeadline"> <span class="headlineText"> Resources </span>  </div>' +
            '<div class="resourcesLinksGroup">' +
                '<a href="https://www.workfusion.com/blog/" target="_blank" class="resourcesLinksItem">' +
                    'Blog WorkFusion' +
                    '<img src="/img/external link.svg">' +
                '</a>' +
                    '<a href="https://www.workfusion.com/events-webinars/" target="_blank" class="resourcesLinksItem">' +
                    ' Events & Webinars' +
                '<img src="/img/external link.svg">' +
                    '</a>' +
                    '<a href="https://www.workfusion.com/reports-whitepapers/" target="_blank" class="resourcesLinksItem">' +
                ' Reports & Whitepapers' +
                    '<img src="/img/external link.svg">' +
                    ' </a>' +
                '<a href="https://www.workfusion.com/demos-videos/" target="_blank" class="resourcesLinksItem">' +
                    ' Demos & Videos' +
                    '<img src="/img/external link.svg">' +
                ' </a>' +
            '</div>' +
        ' </div>')

    // Overlay nav
    $('<div class="navWrapperOverlay"></div>' ).insertBefore('.nav-footer')
    
    // Body container overlay
    $('<div class="bodyOverlay"></div>' ).insertBefore('.nav-footer')


    // Hide on-page-navigation if empty
    if ($('.onPageNav').children().length === 0) {
        $('#tocToggler').detach()
    }

    // Replace search bar near to logo
    $('a[href="/"]').css({width: '200px'})
    $('.navSearchWrapper.reactNavSearchWrapper').insertBefore('.navigationWrapper.navigationSlider')

    // Hover effect for 9dots icon
    $('.resourcesMenu').hover(function () {
        $(this).find('#Mask').css({fill: '#fff'})
    })
    $('.resourcesMenu').mouseleave(function () {
        $(this).find('#Mask').css({ fill: "rgba(255, 255, 255, 0.8)" })
    })

    // Hover effect for socials icon 
    $('.nav-footer .copyright .socials a').each( function (i, el) {
        $(el).hover( function () {
            $(this).find('g#Footer').css({fill:'#fc4710'})
        })
        $(el).mouseleave( function () {
            $(this).find('g#Footer').css({fill:'#3B424A'})
        })
    })

    if ( $(window).width() > 651) {
        // Show/hide dropdown menu
        $('.resourcesMenu').click(function () {
            $('.dropdown-menu').toggle(300)
        })
        $('.resourcesCloseBtn').click(function () {
            $('.dropdown-menu').fadeOut(300)
        })
    }

    $(document).mouseup(function (e) {
        var dropdownMenu = $(".dropdown-menu");
        var resourcesMenu = $(".resourcesMenu");
        var hamburgerMenu = $(".hamburgerMenu");
        if (!dropdownMenu.is(e.target)
            && dropdownMenu.has(e.target).length === 0 && !resourcesMenu.is(e.target) && resourcesMenu.has(e.target).length === 0 && !hamburgerMenu.is(e.target) && hamburgerMenu.has(e.target).length === 0) {
            
            dropdownMenu.fadeOut();
            $('.bodyOverlay').removeClass('active')
            $('.dropdown-menu').removeClass('active')
            $('body').removeClass('dropdownMobileShown')
            $('.headerOverlay').hide()
            $('.bodyOverlay').hide()
        }
    });

    // Float button
    $('#back-to-top').replaceWith(`
    <div id="back-to-top-our" class="hidden">
        <svg viewBox="0 0 24 24">
        <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path>
    </svg></div>
    `);

    $(window).scroll(function () {
        if ($(this).scrollTop() > 1000) {
            $('#back-to-top-our').removeClass('hidden');
        } else {
            $('#back-to-top-our').addClass('hidden');
        }
        });
        // scroll body to 0px on click
        $('#back-to-top-our').click(function () {
        $('body,html').animate({
        scrollTop: 0
        }, 800);
        return false;
    });

    // Show/hide navigation side menu
    $('.navBreadcrumb.wrapper h2 i').detach()
    $('#navToggler').detach()
    $('.navBreadcrumb.wrapper h2').append('<span class="navToggleIcon"><img src="/img/down_footer.svg"></span>')

    $('.footerAccIcon').hide()
    
    // Header versions dropdown
    const versionsHeadlineHeader = $('<span class="versionsHeaderHeadline">' + actualVersion.text() + '<svg width="8px" height="5px" viewBox="0 0 10 5" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M0.853553391,0.853553391 L4.64644661,4.64644661 C4.84170876,4.84170876 5.15829124,4.84170876 5.35355339,4.64644661 L9.14644661,0.853553391 C9.34170876,0.658291245 9.34170876,0.341708755 9.14644661,0.146446609 C9.05267842,0.0526784202 8.92550146,-2.43597394e-17 8.79289322,0 L1.20710678,0 C0.930964406,5.07265313e-17 0.707106781,0.223857625 0.707106781,0.5 C0.707106781,0.632608245 0.759785201,0.759785201 0.853553391,0.853553391 Z" id="path-4"></path></defs><g id="Dashboard" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="My-Profile-–-Badge" transform="translate(-1567.000000, -36.000000)">            <g id="Header-/-1" transform="translate(300.000000, 0.000000)"><g id="Group-11"><g id="Group" transform="translate(823.000000, 20.000000)"><g id="Group-3" transform="translate(300.000000, 0.000000)"><g id="icn-/-24-/-language-copy-icn-/-16/-dropdown-/-open" transform="translate(141.000000, 9.000000)"><g id="Bg-/-light-/-gray-1" transform="translate(3.000000, 7.000000)"><mask id="mask-2" fill="white"><use xlink:href="#path-4"></use>     </mask><use id="Mask" fill="rgba(255, 255, 255, 0.8)" xlink:href="#path-4"></use></g></g></g></g></g></g></g></g></svg></span>');

     const versionsHeaderDropdownBlock = $('<div class="versionsHeaderDropdown"></div>')
     const versionsHeaderItems = versions.map( function (i) {
         let versionHeaderItem = $('<span class="versionItem">' + i + '</span>');
         if (i === actualVersion.text()) {
            versionHeaderItem.addClass('active')
            versionHeaderItem.css({'pointer-events': 'none'})
         }
         $(versionHeaderItem).on('click', function() {
            if (i === currentVersion) {
                window.open(getBaseUrl() + 'docs/iac', "_self");
            } else {
                window.open(getBaseUrl() + 'docs/' + i + '/iac', "_self");
            }
         })
         return versionHeaderItem
     })

     versionsHeadlineHeader.insertBefore('.navSearchWrapper.reactNavSearchWrapper');
     versionsHeaderDropdownBlock.insertBefore('.navSearchWrapper.reactNavSearchWrapper');
     $(versionsHeaderDropdownBlock).append(versionsHeaderItems);

     versionsHeadlineHeader.click( function () {
         this.classList.toggle('active')
         versionsHeaderDropdownBlock.toggle()
     })

    // Header versions hover effect 
     $('.versionsHeaderHeadline').mouseover(function () {
        $(this).css({color: '#fff'})
        $(this).find('#Mask').css({fill: '#fff'})
    })
    $('.versionsHeaderHeadline').mouseleave(function () {
        $(this).css({color: 'rgba(255, 255, 255, 0.8)'})
        $(this).find('#Mask').css({ fill: "rgba(255, 255, 255, 0.8)" })
    })

     // Footer versions dropdown menu 
     const versionsHeadline = $('<span class="versionsHeadline">' + 'version ' + actualVersion.text() +' <svg width="10px" height="5px" viewBox="0 0 10 5" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M0.853553391,0.853553391 L4.64644661,4.64644661 C4.84170876,4.84170876 5.15829124,4.84170876 5.35355339,4.64644661 L9.14644661,0.853553391 C9.34170876,0.658291245 9.34170876,0.341708755 9.14644661,0.146446609 C9.05267842,0.0526784202 8.92550146,-2.43597394e-17 8.79289322,0 L1.20710678,0 C0.930964406,5.07265313e-17 0.707106781,0.223857625 0.707106781,0.5 C0.707106781,0.632608245 0.759785201,0.759785201 0.853553391,0.853553391 Z" id="path-2"></path></defs>     <g id="Dashboard" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="My-Profile-–-Badge" transform="translate(-1567.000000, -36.000000)"><g id="Header-/-1" transform="translate(300.000000, 0.000000)"><g id="Group-11"><g id="Group" transform="translate(823.000000, 20.000000)"><g id="Group-3" transform="translate(300.000000, 0.000000)"><g id="icn-/-24-/-language-copy-icn-/-16/-dropdown-/-open" transform="translate(141.000000, 9.000000)"><g id="Bg-/-light-/-gray-1" transform="translate(3.000000, 7.000000)"><mask id="mask-2" fill="black">   <use xlink:href="#path-2"></use></mask><use id="Mask" fill="#C4C4C4" xlink:href="#path-2"></use></g></g></g></g></g></g></g></g></svg></span>');
     const versionsDropdownBlock = $('<div class="versionsDropdown"></div>')
     const versionsItems = versions.map( function (i) {
         let versionItem = $('<span class="versionItem">' + 'version ' + i + '</span>');
         if (i === actualVersion.text()) {
            versionItem.addClass('active')
            versionItem.css({'pointer-events': 'none'})
         }
         $(versionItem).on('click', function() {
            if (i === currentVersion) {
                window.open(getBaseUrl() + 'docs/iac', "_self");
            } else {
                window.open(getBaseUrl() + 'docs/' + i + '/iac', "_self");
            }
         })
         return versionItem
     })

     $('.versionsTextGroup').append(versionsHeadline);
     $('.versionsTextGroup').append(versionsDropdownBlock);
     $(versionsDropdownBlock).append(versionsItems);

     versionsHeadline.click( function () {
         this.classList.toggle('active')
         versionsDropdownBlock.toggle()
     })

     // Footer versions hover effect 
     $('.versionsHeadline').mouseover(function () {
        $(this).css({color: '#535E68'})
        $(this).find('#Mask').css({fill: '#535E68'})
    })
    $('.versionsHeadline').mouseleave(function () {
        $(this).css({color: '#C4C4C4'})
        $(this).find('#Mask').css({ fill: "#C4C4C4" })
    })

    

    // Documentation navigation
    $('.navBreadcrumb.wrapper > h2 > span').first().click( function () {
        $('.navToggleIcon').toggleClass('active')
        $('body').toggleClass('bodyNoScroll')
        $('.navGroups').toggle().toggleClass('active')
        $('#tocToggler').toggle()
        $('.navWrapperOverlay').toggle();
    })

    //  Adaptivity for tablets (651px - 1023px)
     if ( $(window).width() >= 651 && $(window).width() <= 1023) {

        // Change menu close img
        $('.resourcesCloseBtn img').attr('src', '/img/close_mobile.svg')

        // Hamburger menu
        $('.nav-site.nav-site-internal').append('<div class="hamburgerMenu"><div class="hamburgerLine"></div><div class="hamburgerLine"></div><div class="hamburgerLine"></div></div>')

        $('.hamburgerMenu').click(function () {
            $('.dropdown-menu').toggle(300)
        })
        
        $('<h3 class="activeNavigationHeadline">Active Navigation</h3>').insertBefore('.navBreadcrumb.wrapper > h2');
        $('.activeNavigationHeadline').hide()

        // Builds dropdown menu (mobile version)
        const mainMenu = $('.navigationSlider .slidingNav ul').children().slice(0, -2);
        mainMenu.first().addClass('navMenuGroup')
        mainMenu.hide()
        mainMenu.insertBefore('.resourcesGroup')
        mainMenu.show()
    
        $('<span class="resourcesAccordeonIcon"><img src="/img/resources.svg"></span>').insertBefore('.headlineText')
        $('.resourcesLinksHeadline').append('<span class="accordeonArrow"><img src="/img/down.svg"> </span>')

        const closeBtn = $('.resourcesCloseBtn')
        const menuHeadline = $('<div class="menuHeadline"></div')
        menuHeadline.html('Menu')
        menuHeadline.insertBefore('.navMenuGroup')
        menuHeadline.append(closeBtn)

        // Replaces blocks inside dropdown menu
        $('.resourcesLinksHeadline').insertBefore('.resourcesGroup')
        $('.resourcesItemImg').detach();
        $('.resourcesLinksGroup > a > img').detach()

        // Moves socials block over contacts
        $('.nav-footer .copyright .socials').insertBefore('.contacts')

        $('.resourcesLinksHeadline').click( function () {
            this.classList.toggle('active')
            $('.resourcesGroup').toggle(200)
            $('.resourcesLinksGroup').toggle(350)
        })

        // Current document navigation
        $('#tocToggler, .onPageNav a').click( function (){
            $('.navGroups').hide()
            $('body').toggleClass('bodyNoScroll')
            $('.onPageNav').toggleClass('active')
            $('.navToggleIcon').toggle()
            $('.activeNavigationHeadline').toggle()
            $('.navWrapperOverlay').toggle();
            $('.onPageNav .toc-headings>li>a:first').removeClass('active');
        })
     }

    // Adaptivity for mobile devices <= 650px
    if ($(window).width() <= 650) { 

        // Change menu close img
        $('.resourcesCloseBtn img').attr('src', '/img/close_mobile.svg')
        
        // 
        $('.clearInputButton').detach()
        $('.footerAccIcon').show()

        // Add headline to current document navigation
        $('<h3 class="activeNavigationHeadline">Active Navigation</h3>').insertBefore('.navBreadcrumb.wrapper > h2');
        $('.activeNavigationHeadline').hide()

        // Hamburger menu
        $('.nav-site.nav-site-internal').append('<div class="hamburgerMenu"><div class="hamburgerLine"></div><div class="hamburgerLine"></div><div class="hamburgerLine"></div></div>')

        $('.hamburgerMenu').click(function () {
            $('.dropdown-menu').show()
            $('.bodyOverlay').addClass('active')
            $('.headerOverlay').show()
            $('.bodyOverlay').show()
            $('body').addClass('dropdownMobileShown')
            $('.dropdown-menu').addClass('active')
        })

        // Builds dropdown menu (mobile version)
        const mainMenu = $('.navigationSlider .slidingNav ul').children().slice(0, -2);
        mainMenu.first().addClass('navMenuGroup')
        mainMenu.hide()
        mainMenu.insertBefore('.resourcesGroup')
        mainMenu.show()
    
        $('<span class="resourcesAccordeonIcon"><img src="/img/resources.svg"></span>').insertBefore('.headlineText')
        $('.resourcesLinksHeadline').append('<span class="accordeonArrow"><img src="/img/down.svg"> </span>')

        const menuHeadline = $('<div class="menuHeadline"></div')
        menuHeadline.html('Menu')
        menuHeadline.insertBefore('.navMenuGroup')
        menuHeadline.append($('.resourcesCloseBtn'))

        // Closes resources menu
        $('.resourcesCloseBtn, li.resourcesMenu ').click(function () {
            $('.dropdown-menu').fadeOut(300)
            $('.headerOverlay').hide()
            $('.bodyOverlay').removeClass('active')
            $('.bodyOverlay').hide()
            $('body').removeClass('dropdownMobileShown')
            $('.dropdown-menu').removeClass('active')
        })

        // Current document navigation
        $('#tocToggler, .onPageNav a').click( function (){
            $('.navGroups').hide()
            $('body').toggleClass('bodyNoScroll')
            $('.onPageNav').toggleClass('active')
            $('.navToggleIcon').toggle()
            $('.activeNavigationHeadline').toggle()
            $('.navWrapperOverlay').toggle();
            $('.onPageNav .toc-headings>li>a:first').removeClass('active');
        })

        // Replaces blocks inside dropdown menu
        $('.resourcesLinksHeadline').insertBefore('.resourcesGroup')
        $('.resourcesItemImg').detach();
        $('.resourcesLinksGroup > a > img').detach()

        // Moves socials block over contacts
        $('.nav-footer .copyright .socials').insertBefore('.contacts')

        // Resources accordion
        $('.resourcesLinksHeadline').on('click', function () {
            this.classList.toggle('active')
            $('.resourcesGroup').toggle(200)
            $('.resourcesLinksGroup').toggle(350)
        })
        
        // Overlay header
        $('.navigationSlider .slidingNav ul').append('<div class="headerOverlay"></div>')

        // Footer accordion
        $('.footerColumn').click( function () {
            this.classList.toggle('active')
            $(this).next().toggle()
        })
        // Open modal search window
        $('.navSearchWrapper.reactNavSearchWrapper').append('<span class="mobileSearch"><img src="/img/search-mobile.svg"></span>')

        // Triggers search button
        $('.mobileSearch').click( function () {
            $('#search_input_react').triggerHandler('click')
        })
    }
    function getBaseUrl() {
        return window.location.protocol + '//' + window.location.host + '/'
    }

    // detaches current version link
    $('a[href="/versions"]').detach()
})
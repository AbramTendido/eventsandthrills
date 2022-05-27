window.onerror = (message, source, lineno) => {
    console.log(`ErrMessage ${message}`);
    console.log(`Url ${source}`);
    console.log(`Error on line ${lineno}`);
}

// Load 
window.onload = () => {

    navigationFunc();
    index();
    locations();
    calendar();
    contact();
    orders();
    footer();
};

const base = 'assets/data/';

//Page Location
const pageLoc = (page) => {

    let url = location.href;
    try {
        let arr = ['index.html', 'locations.html', 'calendar.html', 'contact.html', 'orders.html', 'users.html'];
        if (!arr.includes(page)) {
            throw new Error(`Bad url input ${page}`);
        }
        return url.indexOf(page) != -1;
    } catch (err) {
        console.log(err);
    }

}

// Local Storage
const setLsItems = (data) => {
    let id = data.map(i => i.id);
    localStorage.setItem('varObjA', JSON.stringify(id));
}
const setLs = (name, val) => {
    return localStorage.setItem(name, JSON.stringify(val));
}
const getLs = (lsName) => {
    return JSON.parse(localStorage.getItem(lsName));
}

// AJAX 
const ajax = (url, success) => {
    $.ajax({
        url: url,
        method: "get",
        dataType: "json",
        success: success,
        error: (xhr) => {
            console.log(xhr);
        }
    });

}
const printDisplay = (div, html) => {
    try {
        document.querySelector(div).innerHTML = html;
    } catch (e) {
        console.log(e);
    }

}

// Navigation 
const navigationFunc = () => {

    //nav animation
    const navScroll = () => {

        let scrollTopPx = {
            bodyScrollTop: 50,
            documentElementScrollTop: 80
        };

        try {
            if (document.body.scrollTop > scrollTopPx.bodyScrollTop || document.documentElement.scrollTop > scrollTopPx.bodyScrollTop) {
                $('nav').css({
                    "transition": ".5s ease",
                    "padding-bottom": "0px"
                });
                $('#logo a').css({
                    'font-size': '1.6em',
                    "transition": ".3s ease",
                    "margin-bottom": "10px",
                    "margin-top": "-5px"
                });

                $('nav #links').css({
                    'transition': '.3s',
                    'margin-top': '0px'
                });
            } else {
                $('nav').css({
                    "padding-bottom": "15px"
                });
                $('#logo a').css({
                    'font-size': '1.8em',
                    "margin": "0px"
                });

                $('nav #links').css({
                    "margin": "10px 0px"
                });
            }
        } catch (e) {
            console.log(e);
        }
    }
    $(document).scroll(navScroll);

    //display navigation burger
    const displayNavburger = () => {

        document.querySelector('#hamburger i').addEventListener('click', () => {
            document.querySelector('#links').classList.toggle('varNavA');
        });

    }
    displayNavburger();

    // dynamic print display
    const navigationFuncprintDisplay = () => {

        ajax(`${base}nav.json`, (data) => {
            const navFunc = nav(data);
            navFunc();
        })

        const nav = (data) => {

            let htmlLogo = '';
            let htmlNav = '';

            data.logo.forEach(i => {
                htmlLogo += `<a href="${i.href}">${i.display}</a>`;
            })

            data.meni.forEach(nav => {
                htmlNav += `<a href="${nav.href}" class="">${nav.display}</a>`;
            });

            printDisplay('#logo', htmlLogo);
            printDisplay('#links', htmlNav);

            const active = () => {

                let url = window.location.pathname.slice(1);

                try {
                    $('#links').find('a').each(() => {
                        $(this).toggleClass('active', $(this).attr('href') == url);
                    });
                } catch (err) {
                    console.log(err);
                }

            }
            return active;

        }
    }
    navigationFuncprintDisplay();
}

//Index Comments
const index = () => {
    if (pageLoc('index.html')) {

        const adverts = () => {

            ajax(`${base}perks.json`, (data) => {
                advertsprintDisplay(data);
            });

            const advertsprintDisplay = (data) => {
                let htmladverts = '';

                data.forEach(i => {
                    htmladverts += `<div class="optionChoice">
                    <h3>${i.titleStyle}</h3>
                    <p>${i.titleDesc}</p>
                </div>`;
                });

                printDisplay("#options", htmladverts);

            }
        }
        adverts();
        // Comments top display 
        const comments = () => {

            let frontComments = ['I met my future wife here 10/10 would go again.', 'Sick rides and the shows are lit! ', 'Well maintained will practice here again!'];

            let htmlComments = '';

            frontComments.forEach(i => {
                htmlComments += `
                <div class="cBlock">
                    <p><span><i class="fas fa-quote-left"></i></span> ${i}<span><i class="fas fa-quote-left"></i></span></p>
                </div>
                `;
            });

            printDisplay('#blockComment', htmlComments);
        }

        comments();
    }
}


//Locations
const locations = () => {


    if (pageLoc('locations.html')) {

        const sort = () => {

            // printDisplay sort 
            ajax(`${base}sort.json`, (data) => {
                sortprintDisplay(data);
                let lsSort = getLs('sort');
                if (lsSort === null) {
                    lsSort = '0';
                }
                document.querySelector('#sort').value = lsSort;
            });

            const sortprintDisplay = (data) => {

                htmlSort = `  <select id="sort">
                <option value="0">Sort by</option>`;

                data.forEach(i => {
                    htmlSort += `<option value="${i.id}">${i.display}</option>`
                });

                htmlSort += `</select>`;

                printDisplay('#sortHtml', htmlSort);

            }
        }
        sort();

        const filter = () => {
            // Filter
            const filterSelLs = () => {
                let filterLs = getLs('filter');
                var checkbox = document.querySelectorAll("input[name=sel]");
                if (filterLs != null) {
                    console.log(filterLs);

                    checkbox.forEach(i => {
                        if (filterLs.includes(i.value)) {
                            console.log(i.value);
                            i.checked = true;
                        }
                    });

                }
            }
            const displayiFilter = () => {
                document.querySelector('#homeView').addEventListener('click', () => {
                    document.querySelector('#types').classList.toggle('diplayA');

                });
            }

            displayiFilter();

            ajax(`${base}filter.json`, (data) => {

                filterprintDisplay(data);
                setFilterLogic(data);
                filterselLs();

            });

            const filterprintDisplay = (data) => {

                let htmlFilter = `<form>`;
                data.forEach(i => {
                    htmlFilter += `<input type="checkbox" name="sel" id="${i.display}" value="${i.id}" data-id="${i.id}"/class="sorter"><span>${i.display.slice(0,1).toUpperCase() + i.display.slice(1)}</span><br/>`;
                });
                htmlFilter += `</form>`;
                printDisplay('#types', htmlFilter);

            }

            const setFilterLogic = (data) => {
                // filter
                var checkbox = document.querySelectorAll("input[name=sel]");
                checkbox.forEach(i => {
                    i.addEventListener('change', filterLogic);

                });

            }
        }

        filter();

        //printDisplay 
        const locObj = () => {

            ajax(`${base}locObj.json`, (data) => {
                locObjprintDisplay(data);
                filterJ(data);
            });

            const filterJ = (data) => {
                let ls = localStorage.getItem('varObjA');

                if (ls != null && ls.length != 0) {

                    data.sort((a, b) => {
                        ls.indexOf(a.id) - ls.indexOf(b.id);
                    });

                    locObjprintDisplay(data);
                    sortLogic();
                }
            }
        }

        locObj();

        //Categories Display
        const locObjprintDisplay = (data) => {

            let htmllocObj = ``;
            data.forEach(i => {
                htmllocObj += `<div class="objA">
                <img src="${i.img.src}" alt="${i.img.alt}"/>
                <h2 class="titleStyle">${i.titleStyle}</h2>
                <div class="typeA">`
                for (let j of i.category) {
                    htmllocObj += ` <p>${j.categoryName}</p>`

                }

                htmllocObj += `
                </div>
                <p>Duration ${i.duration.printDisplay}</p>
                <p>Released ${i.date.printDisplay}</p>
                <a href="#" class="get">Get Tickets</a>
            </div>`;
            });

            printDisplay('#locObj', htmllocObj);

            const displayGetTicket = () => {

                let classGet = document.querySelectorAll('.get');

                for (let i = 0; i < classGet.length; i++) {
                    classGet[i].addEventListener('click', (e) => {
                        e.preventDefault();
                        console.log(i);
                        document.querySelector('#getTicket').style.display = 'block';
                    });
                }
                document.querySelector('#getUpTicket i').addEventListener('click', () => {
                    document.querySelector('#getTicket').style.display = 'none';
                });
            }
            displayGetTicket();

        }


        let arrSel = [];

        function filterLogic() {

            if (getLs('filter')) {
                arrSel = getLs('filter');
            }

            let selected = this.value;

            //string outlines
            if (arrSel.includes(selected)) {
                arrSel = arrSel.filter(i => {
                    return i != selected;
                });
            }
            //string entries
            else {
                arrSel.push(selected);
            }

            setLs('filter', arrSel);

            ajax('assets/data/locObj.json', (data) => {

                printDisplayFiltriranihobjAova(data);

            });

            const printDisplayFiltriranihobjAova = (data) => {

                let printDisplay = [];
                printDisplay = data.filter(i => {

                    if (arrSel.length != 0) {

                        for (let j of arrSel) {
                            for (let k of i.category)
                                if (j == k.indexA) {
                                    return true;
                                }
                        }

                    } else {
                        // if empty display all
                        return true;
                    }
                });
                if (printDisplay.length === 0) {
                    alert('None!');
                }
                locObjprintDisplay(printDisplay);
                setLsItems(printDisplay);

            }
        }
        //Sort Dates
        function sortLogic() {

            let el = document.querySelector('#sort');
            console.log(el);
            let arr = [];
            ajax('assets/data/locObj.json', (data) => {

                setSortLogic(data);

            });
            const setSortLogic = (data) => {

                if (localStorage.getItem('varObjA')) {

                    let ls = localStorage.getItem('varObjA');
                    data = data.filter(i => {
                        return localStorage.getItem('varObjA').includes(i.id);
                    });

                    data.sort((a, b) => {
                        return ls.indexOf(a.id) - ls.indexOf(b.id);
                    });
                }

                for (let i of data) {
                    arr.push(i);
                }

                const sortDateVar = (exec) => {
                        arr.sort(exec);
                    }
                    // Date and time text 
                switch (el.value) {
                    case '0':
                        sortDateVar(function(a, b) {
                            return a.id - b.id;
                        });
                        break;
                    case '1':
                        sortDateVar((a, b) => {
                            a = a.date.date.split('.');
                            b = b.date.date.split('.');
                            return a[2] - b[2] || a[1] - b[1] || a[0] - b[0];
                        });
                        break;
                    case '2':
                        sortDateVar((a, b) => {
                            a = a.date.date.split('.');
                            b = b.date.date.split('.');
                            return b[2] - a[2] || b[1] - a[1] || b[0] - a[0];
                        });
                        break;
                    case '3':
                        sortDateVar((a, b) => {
                            return a.duration.time - b.duration.time;
                        });
                        break;
                    case '4':
                        sortDateVar((a, b) => {
                            return b.duration.time - a.duration.time;
                        });
                        break;
                    default:
                        locObjprintDisplay(data);
                }

                const setSortLs = () => {
                    let sortId = document.querySelector('#sort');
                    sortId.addEventListener('change', () => {

                        let vrednost = sortId.value;
                        setLs('sort', vrednost);

                    });
                }

                setSortLs();
                locObjprintDisplay(arr);
                setLsItems(arr);
            }

        }
        $("body").on("change", "#sort", sortLogic);


        //Popup Form for orders
        const ticket = () => {

            let get = document.getElementsByClassName('get');


            for (let i of get) {
                i.addEventListener('click', (e) => {
                    e.preventDefault();

                });
            }
            ajax("assets/data/locObj.json", (data) => {
                printDisplayForme(data);

            });
            // Location display information
            const printDisplayForme = (data) => {
                let html = '';

                html += `<form action="#" method="POST" id="formAGetTicket">
                <div class="form-group">
                    <label for="nameobjA">Location Name</label>
                    <!-- <input type="text" id="locationName" name="locationName" value="titleStyle"/> -->
                    <select id="nameobjA">
                        <option value="0">Choose Location</option>`
                for (let i of data) {
                    html += `<option value="${i.id}">${i.titleStyle}</option>`
                }
                html += `
                    </select>
                </div>
                <div class="form-group">
                    <label for="varJ">Entry Tickets to Buy</label>
                    <input type="number" min="1" max="10" id="varJ" name="varJ" value="1">
                </div>
                <div class="form-group">
                    <label for="time">Time</label>
                    <select id="time">
                        <option value="0">Choose Time</option>
                        
                        
                    </select>
                </div>
                <input type="submit" id="submitTicket" name="submitTicket" value="Order Ticket"/>
                </form>`


                document.querySelector('#getBotTicket').innerHTML = html;

                const printDisplaySched = () => {
                    let objA = document.querySelector('#nameobjA');
                    objA.addEventListener('change', () => {
                        if (objA.value != 0) {

                            let selected = objA.value;
                            let selectedobjAJson = --selected;
                            let htmlotherStyle = '';

                            for (let i of data[selected].otherStyle) {
                                htmlotherStyle += `<option value='${i.indexOtherStyle}'>${i.displayTimeA}</option>`
                            }
                            printDisplay('#time', htmlotherStyle);

                        } else {
                            htmlotherStyle = '';
                            printDisplay('#time', htmlotherStyle);
                        }
                    })
                }
                printDisplaySched();
                // Take information from form
                const getDataFromForm = () => {
                    const formA = document.querySelector('#formAGetTicket');
                    const objA = document.querySelector('#nameobjA');
                    const varJchart = document.querySelector('#varJ');
                    const otherStyle = document.querySelector('#time');
                    const submit = document.querySelector('#submitTicket');

                    submit.addEventListener('click', (e) => {
                        e.preventDefault();

                        if (objA.value == 0) {
                            alert('Choose location in dropdown list');
                            return false;
                        } else {

                            if (localStorage) {
                                addToOrders();
                            } else {
                                alert("Browser does not support localStorage");
                            }

                            return true;
                        }

                    });

                    // Location to order
                    function addToOrders() {

                        let varObjAOrder = objA.value;
                        let varJchartLs = varJchart.value;
                        let otherStyleLs = otherStyle.value;

                        let locations = JSON.parse(localStorage.getItem("locationOrders"));


                        if (locations) {

                            if (locations.filter(location => location.id == varObjAOrder).length) {
                                for (let i in locations) {
                                    if (locations[i].id == varObjAOrder) {

                                        locations[i].brchart = varJchartLs;
                                        locations[i].otherStyle = otherStyleLs;

                                    }
                                }
                                setLs('locationOrders', locations);

                            } else {
                                // add objA if has one

                                locations.push({
                                    id: varObjAOrder,
                                    brchart: varJchartLs,
                                    otherStyle: otherStyleLs
                                });

                                setLs('locationOrders', locations);
                            }

                        } else {
                            //add objA to list Ls
                            let locationOrder = [];

                            locationOrder[0] = {
                                id: varObjAOrder,
                                brchart: varJchartLs,
                                otherStyle: otherStyleLs
                            };
                            setLs('locationOrders', locationOrder);
                        }

                        alert('SUCCESS! find it at Orders page');
                        location.reload();
                    }
                }
                getDataFromForm();
            }
        }
        ticket();
    }
}

//Calendar
const calendar = () => {
    if (pageLoc('calendar.html')) {

        const dates = () => {
            ajax(`${base}locObj.json`, (data) => {
                datesprintDisplay(data);

            });
            const datesprintDisplay = (data) => {
                let htmldate = ``;
                data.forEach(i => {
                    htmldate += `
                    <div class="date">
              
                    <div class="objOtherStyle">
                        <div class="line"></div>
                        <h3>${i.titleStyle}</h3>
                        <div class="displayTime">
                            `
                    for (let j of i.otherStyle) {

                        htmldate += ` <p> |${j.displayTimeA}|</p>`;

                    }

                    htmldate += `
                        </div>
                        
                    </div>
                </div>
                    `;
                })

                printDisplay('#dates', htmldate);
            }

            //Current Date Display
            const currDate = () => {

                let date = new Date();
                let day = date.getDate();
                let month = date.getMonth() + 1;
                let year = date.getFullYear();
                let htmlcurrDate = `${day}.${month}.${year}`;

                printDisplay('#podtitleStyleSpan', htmlcurrDate);
            }
            currDate();
        }
        dates();
    }
}

//Contact Page
const contact = () => {
    if (pageLoc('contact.html')) {
        const formA = document.querySelector('#contactform');
        const name = document.querySelector('#name');
        const email = document.querySelector('#email');
        const messageF = document.querySelector('#messageF');
        const submit = document.querySelector('#submit');
        let err = 0;

        // Contact display
        try {
            const inputError = (input, vrednost) => {
                input.style.border = '2px solid red';
                let div = input.parentElement;
                let inputErrorDisplay = div.querySelector('p');
                inputErrorDisplay.innerHTML = vrednost;
                err = 1;
            }

            const inputSuccess = (input) => {
                input.style.border = '2px solid #19B5FE';
            }

            const obFields = (...args) => {
                args.forEach(i => {
                    console.log(args);
                    if (i.value.trim() == '') {
                        inputError(i, `Field is required`);
                    } else {
                        inputSuccess(i);
                        return true;
                    }
                });
            }

            const checkLength = (input, min, max) => {
                if (input.value.length < min) {
                    inputError(input, `Field must contain min ${min} characters`);
                } else if (input.value.length > max) {
                    inputError(input, `Field must contain max ${max} characters`);
                } else {
                    inputSuccess(input);
                    return true;
                }
            }

            const fieldCheck = (input, reg, message) => {

                if (!reg.test(input.value)) {
                    inputError(input, message);
                } else {
                    inputSuccess(input);
                    return true;
                }
            }

            // Name and Email
            submit.addEventListener('click', (e) => {
                e.preventDefault();
                obFields(name, email, messageF);

                let a = checkLength(name, 3, 80);
                checkLength(messageF, 3, 300);

                if (a) {
                    fieldCheck(name, /^[A-ZŠĐŽČĆ][a-zšđžčć]{2,15}(\s[A-ZŠĐŽČĆ][a-zšđžčć]{2,15})*$/, 'Name must begin with Uppercase letters.');
                }

                if (!obFields(email)) {
                    fieldCheck(email, /^\w[.\d\w]*\@[a-z]{2,10}(\.[a-z]{2,3})+$/, 'Please enter a valid email.');
                }

                if (err == 0) {
                    alert("Message Sent.");
                    location.reload();
                }
            });
        } catch (e) {
            console.log(e);
        }
    }
}

//Orders
const orders = () => {

    if (pageLoc('orders.html')) {

        const printDisplayLocationOrder = () => {


            let locationsBooked = JSON.parse(localStorage.getItem('locationOrders'));

            if (locationsBooked.length != 0) {
                ajax(`${base}locObj.json`, (data) => {
                    printDisplaylocations(data);
                });

            }


            const printDisplaylocations = (data) => {
                let result = data.filter(i => {
                    for (let location of locationsBooked) {
                        if (i.id == location.id) {
                            return true;
                        }
                    }
                });
                console.log(result);
                printDisplayA(result);
            }

            // Orders display information
            const printDisplayA = (data) => {
                let html = '';

                data.map(x => {
                    let varObjAL = locationsBooked.find(y => y.id == x.id);

                    x.quantity = parseInt(varObjAL.brchart);

                    x.time = x.otherStyle.find(p => p.indexOtherStyle == varObjAL.otherStyle).displayTimeA;
                })


                data.forEach(i => {

                    html += `
                    <div class="objABooked">
                        <img src="${i.img.src}" alt="${i.img.alt}"/>
                        <h2>${i.titleStyle}</h2>
                        <p>Tickets: <span>${i.quantity}</span></p>
                        <p>Entry Time: <span>${i.time}</span></p>
                        <p class="deleteOrder" onclick="deleteOrder(${i.id})">Cancel</p>
                    </div>`;

                });

                printDisplay('#orders', html);

            }
            const emptyOrder = () => {
                if (locations.length !== null) {
                    let html = `<div class="emptyA"><p> No Orders!</p>
                    <p>Go to Locations Page to find out more!</p></div>`;

                    printDisplay('#orders', html);
                }
            }
            emptyOrder();
        }

        printDisplayLocationOrder();

    }

}

//Delete
const deleteOrder = (id) => {

    try {
        let locations = JSON.parse(localStorage.getItem('locationOrders'));
        let filterJ = locations.filter(location => location.id != id);
        setLs('locationOrders', filterJ);
        orders();
        console.log(id);
        if (id == null || id == undefined || id == NaN || typeof(id) != 'number') {
            throw (`Error: id -> ${id} is not in right formAt`);
        }
    } catch (e) {
        console.log(e);
    }

}

// Footer
const footer = () => {
    //Locations Display first 5
    ajax(`${base}locObj.json`, (data) => {
        printDisplayData(data);

    });
    const printDisplayData = (data) => {
        let varJ = 0;
        let htmlFooterlocObj = '';
        try {
            for (let i of data) {
                varJ++;
                htmlFooterlocObj += `<a href="locations.html">${i.titleStyle}</a>`
                if (varJ == 5) {
                    break;
                }
            }
            printDisplay('#footerLinks', htmlFooterlocObj);
        } catch (e) {
            console.log(e);
        }
    }
}
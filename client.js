
document.addEventListener("pageChange", function () {
    pageInit();
});


document.addEventListener("firstLoad", function () {
    appInit();
});


function pageInit() {
    dashboard();
    initStatusColor();
    //initMde();
}


function appInit() {
    if (document.body['data-init']) return;
    document.body['data-init'] = 1;
    addGeneralStyle();
    addEditorStyle();
}


function dashboard() {
    const allowedViews = ["Projects_Detail", "Customers_Detail", "Task_Detail"]; // Array di view ammesse
    const view = getUrlParameter("view");

    // Controlla se la view è nell'array consentito
    if (!allowedViews.includes(view)) {
        console.log("View non ammessa:", view);
        return;
    }

    const columns = document.querySelectorAll('[data-testid="slideshow-page-column"]');
    if (!columns) return;

    // Seleziona il primo blocco di col1 e lo sposta nell'header
    const infoCard = columns[0].querySelector('[data-testid="slideshow-page-card"]');
    if (!infoCard) return;

    //Selezione header
    const _headerColumn = document.querySelector('[data-testid="slideshow-page-header-column"]');
    if (!_headerColumn || _headerColumn["data-init"] == 1) return;
    _headerColumn["data-init"] = 1;

    //Creo contaienr dentro header
    const newDiv = document.createElement("div");
    newDiv.classList.add("fixed-col"); 
    _headerColumn.appendChild(newDiv); 

    //Inserisco le prime 2 col in header 
    const headerColumn = document.querySelector('.fixed-col');
    headerColumn.appendChild(_headerColumn.querySelector('div')); //Buttons
    headerColumn.appendChild(infoCard); //Info

    


    // Prende i restanti blocchi di col1 e tutti quelli di col2
    const col1Cards = columns[0].querySelectorAll('[data-testid="slideshow-page-card"]');
    const col2Cards = columns[1] ? columns[1].querySelectorAll('[data-testid="slideshow-page-card"]') : [];

    // Intercala i blocchi di col2 tra quelli di col1
    const newOrder = [];
    const maxLength = Math.max(col1Cards.length, col2Cards.length);

    if (col2Cards[0]) newOrder.push(col2Cards[0]);
    for (let i = 0; i < maxLength; i++) {
        if (col1Cards[i]) newOrder.push(col1Cards[i]);
        if (col2Cards[i + 1]) newOrder.push(col2Cards[i + 1]);
    }
    console.log(newOrder);

    // Svuota col1 e riordina gli elementi
    columns[0].innerHTML = "";
    console.log(columns);

    newOrder.forEach((card) => {
        console.log(card)
        columns[0].appendChild(card)
    });

    // Rimuove col2
    if (columns[1]) columns[1].remove();


    // Inietta il CSS dinamicamente
    addCss(`
            .fixed-col {
                position: fixed;
                overflow: scroll;
                max-height: 85.5vh;
            }
            .fixed-col > div {
                min-height: 200px !important;
                position: relative !important;
                 margin-top: 16px;
                 max-width: 400px;
            }
            .fixed-col > div:nth-of-type(1) {
                margin-top: 0px !important;
            }
            [data-testid="slideshow-page-column"], .DesktopModeContainer {
                max-width: 100% !important;
            }
            .TableView__list > .EmptyView, .DeckView__list > .EmptyView {
                min-height: 40px !important;
            }

        `);
}

function statusColor() {
    document.querySelectorAll('.TextTypeDisplay__text').forEach(el => {
        const text = el.textContent.trim().toLowerCase(); // Normalizza il testo

        const statusClasses = {
            'active': 'status-active-text',
            'draft': 'status-draft-text',
            'on hold': 'status-onhold-text',
            'archived': 'status-archived-text',
            'to do': 'status-todo-text',
            'in progress': 'status-inprogress-text',
            'done': 'status-done-text'
        };




        // Aggiunge la classe specifica dello stato se esiste nella mappa
        if (statusClasses[text]) {
            el.classList.forEach(c => {
                if (c.includes('status-')) {
                    el.classList.remove(c);
                }
            });
            el.classList.add(statusClasses[text]);
            el.classList.add('status-text');
            // Aggiunge la classe status-text-container al contenitore (elemento padre)
            if (el.parentElement) {
                el.parentElement.classList.add('status-text-container');
            }
            //Aggiungi on change su text =>  statusColor()
        }


    });

    addCss(`
            .status-text-container {
                border-radius: 4px;
            }

            .status-text {
                padding: 8px;
                line-height: 30px;
            }

            .status-active-text, .status-done-text { background-color: rgba(150, 255, 150, 0.15); color: rgb(39, 167, 65); border: 1px solid rgba(60, 255, 100, 0.5); }  
            .status-draft-text { background-color: rgba(255, 255, 255, 0.2); color: rgba(255, 255, 255, 1); border: 1px solid rgba(150, 150, 150, 0.5); }  
            .status-onhold-text { background-color: rgba(255, 200, 100, 0.15); color: rgba(255, 165, 0, 1); border: 1px solid rgba(255, 165, 0, 0.5); }  
            .status-archived-text { background-color: rgba(227, 89, 34, 0.15); color: rgb(167, 59, 59); border: 1px solid rgba(100, 100, 100, 0.5); }  
            .status-inprogress-text { background-color: rgba(100, 180, 255, 0.15); color: rgba(30, 144, 255, 1); border: 1px solid rgba(30, 144, 255, 0.5); }  
            .status-todo-text { background-color: rgba(180, 100, 255, 0.15); color: rgba(138, 43, 226, 1); border: 1px solid rgba(138, 43, 226, 0.5); }  

            `);

}

function initStatusColor() {
    statusColor();
    // Osserva i cambiamenti nei nodi di testo e richiama statusColor() quando cambia il contenuto
    const observer = new MutationObserver(() => {
        statusColor();
    });

    document.querySelectorAll('.status-text-container').forEach(el => {
        observer.observe(el, { childList: true, subtree: true, characterData: true });
    });
}

function addEditorStyle() {
    addCss(`
        .EasyMDEContainer .CodeMirror {
            text-align: left;
        }
            
            `);
}

function addGeneralStyle() {
    console.log("Aggiungi stile generale");
    addCss(`
                .SlideshowPage__heading-label {font-weight: 600; font-size: 1rem;}
                .BaseTypeDisplay {font-size: 0.95rem;}
                .BasePrimaryView:first-child { background-color:rgb(195, 196, 198);}
                
           `);
}


function getUrlParameter(name) {
    const params = new URLSearchParams(window.location.hash.substring(1)); // Rimuove il '#' iniziale
    return params.get(name);
}


function initMde() {
    const interval = setInterval(() => {
        if (typeof EasyMDE !== 'undefined') {  // Controlla se EasyMDE è disponibile
            clearInterval(interval); // Interrompe l'intervallo dopo aver trovato EasyMDE

            document.querySelectorAll('.LongTextTypeInput > textarea').forEach(el => {
                if (el["data-mde"] == 1) return;
                console.log('Easymde on:', el);
                el["data-mde"] = 1;

                const smde = new EasyMDE({
                    element: el,
                    maxHeight: '150px',
                    forceSync: true,
                    lineWrapping: true,
                    indentWithTabs: false,
                    spellChecker: false,
                    status: false,
                });

                smde.codemirror.on("blur", function () {
                    setTimeout(() => {
                        el.textContent = smde.value();
                        el.value = smde.value();
                    }, 200);
                });
            });
        } else {
            console.log("EasyMDE not yet loaded");
        }
    }, 200);
}







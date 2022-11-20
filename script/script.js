//List of initial destinations
let destinations = []

/**
 * Lancee on load de window
 */
window.onload = async () => {
    //Video autoplay
    if (document.getElementById('mainvid')) document.getElementById('mainvid').play()

    //Navbar
    const navbarParent = document.getElementById('navbar-links')
    const navbarLinks = navbarParent.querySelectorAll('a.ALeftToRight:not(.dropdown-link)')

    navbarLinks.forEach((nav) => {
        if (nav.dataset.section != 'contact') nav.addEventListener('click', () => switchViews(nav))
    })
    document.addEventListener('scroll', () => activeNavbar(window.scrollY))
    //Init mobile bar
    initMobileNavbar()

    //Get destinations
    destinations = await getDestinations();

    // console.log(destinations);
    // Display destinations
    displayDestinations(destinations)

    //TP 3 modify / add image on change
    document.getElementById('imageDest').addEventListener('change', async () => {
        let image = await readFile(document.getElementById('imageDest'))
        document.getElementById('imagePreviewDest').style.background = 'url(' + image + ')'
    })
}

//SECTION Navbar
/**
 * Ajoute un background sur le navbar en fonction de la scroll position d'ecran
 * @param {int} scrollpos
 */
function activeNavbar(scrollpos) {
    const navbar = document.getElementById('navbar')
    scrollpos > 20 ? navbar.classList.add('scrolling') : navbar.classList.remove('scrolling')
}

/**
 * Affiche le menu mobile
 */
function displayResponsiveMenu() {
    let mobileNavbar = document.getElementById('mobileNavbar')
    let body = document.body
    if (mobileNavbar.classList.contains('hidden')) {
        mobileNavbar.classList.remove('hidden')
        body.style.overflow = 'hidden'
    } else {
        mobileNavbar.classList.add('hidden')
        body.style.overflow = 'auto'
    }
}

/**
 * Initialise dynamiquement le menu responsive
 */
function initMobileNavbar() {
    let navbar = document.getElementById('navbar')
    let mobileNavbarLinks = document.getElementById('mobileNavbarLinks')
    let links = navbar.querySelectorAll('.ALeftToRight')
    links.forEach((nav) => {
        let p = nav.cloneNode(true)
        p.addEventListener('click', () => {
            switchViews(p)
        })
        if (p.dataset.section) mobileNavbarLinks.appendChild(p)
    })
}
//!SECTION

//SECTION TP 3
//SECTION TP3 Affichage de menu en single page

/**
 * Change de vue en fonction de nav cliquer
 * @param {Element} nav navigateur clicked
 */
function switchViews(nav) {
    // Get the last active nav
    let lastActiveMobileNav = document.querySelector('#mobileNavbarLinks>a.active')
    let lastActiveNavParent = nav.closest('#navbar-links')

    if (lastActiveNavParent) {
        let lastActiveNav = lastActiveNavParent.querySelector('a.active')
        lastActiveNav.classList.remove('active')
    }
    //Remove display of last activated nav
    lastActiveMobileNav.classList.remove('active')
    //add display to the newly selected nav
    document.querySelector(`#mobileNavbarLinks>[data-section='${nav.dataset.section}']`).classList.add('active')
    nav.classList.add('active')

    //Close the old section
    let lastActiveSection = document.querySelector('section.active')
    lastActiveSection.classList.remove('active')
    lastActiveSection.classList.add('hidden')
    //Open the new section
    let openSection = document.getElementById(nav.dataset.section)
    openSection.classList.remove('hidden')
    openSection.classList.add('active')

    //Close mobile menu
    document.getElementById('mobileNavbar').classList.add('hidden')
    // Hamburger animation on switch
    document.getElementById('hamburger').checked = false
    // body overflow auto
    document.body.style.overflow = 'auto'
}

//!SECTION

/**
 * Affiche les destinations donneer sur la table de destinations
 * @param {array}<Destination> array of <Destination> object
 */
function displayDestinations(destinations) {
    let destinationTable = document.getElementById('destinationsTable')
    if (destinationTable) {
        destinationTable.innerHTML = ''
        destinations.forEach((destination) => {
            let tarifFormated = new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR',
            }).format(destination.tarif)

            // is image BASE64?
            let imageBASE64 = destination.photoURL.includes('data:image')

            // Check if is admin | user
            let admin = isAdmin()
            let user = isUser()

            if (admin) 
                document.getElementById('addImage').classList.remove('hidden')
            else 
                document.getElementById('addImage').classList.add('hidden')

            let decouvrir = `
                <span class="trashcan" onclick="cardZoom('destination${destination.id}')">
                    <img width="30px"src="images/decouvrir.svg" alt="decouvrir">
                </span>
                `
            let controls = `
                            <span class="trashcan" onclick="removeDestination(${destination.id})">
                                <img width="30px"src="images/remove.svg" alt="remove">
                            </span>
                            <span onclick="destinationFormState(${destination.id},'modify')">
                                <img width="30px" src="images/edit.svg" alt="edit">
                            </span>
                            ${decouvrir}
                            `

            destinationTable.innerHTML += `
                <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12 no-padding" id="destination${destination.id}">
                    <div class="card flex flexColumn justify-content-space-between">
                        <div class="card-top">
                            <div class="card-header flex align-items-center">
                                <h3>${destination.pays}</h3>
                                <div class="card-controls">
                                    ${admin ? controls : user ? decouvrir : ``}
                                </div>
                            </div>
                            <div class="card-image-parent">
                                <div style="background-image:url('${!imageBASE64 ? '../' : ''}${destination.photoURL}')" class="card-image"></div>
                            </div>
                        </div>
                        <div class="card-content">
                            <p>${destination.circuit}</p>
                            <div class="reserver flex align-items-center justify-content-space-between margin-top-10px">
                                <p>${tarifFormated}</p>
                                <button class="ALeftToRight">Reserver 
                                    <div class='absolute'><hr/></div>
                                </button>
                            </div>   
                        </div>                 
                    </div>
			`
        })
    }
}

// SECTION Modifier Ajouter des destinations

/**
 * Affiche le formulaire d'ajout / modifier baser sur l'etat (action)
 * @param {int} id de destination
 * @param {string} action l'etat de form (add/modify)
 */
function destinationFormState(id, action) {
    //Declaration du form et reinitialisation
    let paysDest = document.getElementById('paysDest')
    let idDest = document.getElementById('idDest')
    let imageDest = document.getElementById('imageDest')
    let circuitDest = document.getElementById('circuitDest')
    let tarifDest = document.getElementById('tarifDest')
    let imagePreview = document.getElementById('imagePreviewDest')
    let form = document.getElementById('destinationForm')
    let destinationFormModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('destinationFormModal'))

    // Reinit all values
    paysDest.value = ''
    imagePreview.style.background = ''
    idDest.value = ''
    imageDest.value = ''
    circuitDest.value = ''
    tarifDest.value = ''

    // Si l'action est d'ajouter une nouvelle destination
    if (action == 'add') {
        let title = document.getElementById('modalFormTitle')
        title.innerHTML = 'Ajouter une destination'
        form.addEventListener('submit', (e) => addDestination(e), { once: true })
    } else {
        // Ouvrir le modal
        destinationFormModal.show()
        // Sinon c'est l'action modifier
        let editDestination
        destinations.forEach((dest) => {
            if (dest.id == id) {
                editDestination = dest
            }
        })
        let title = document.getElementById('modalFormTitle')
        title.innerHTML = 'Modifier la destination'
        imagePreview.style.background = 'url(' + editDestination.photoURL + ')'
        paysDest.value = editDestination.pays
        idDest.value = editDestination.id
        circuitDest.value = editDestination.circuit
        tarifDest.value = parseInt(editDestination.tarif)

        form.addEventListener('submit', (e) => modifyDestination(e), { once: true })
    }
}
/**
 * Insere une nouvelle destination sur le variable destinations
 * puis met a jour l'affichage de la liste
 * @param {event} e l'event de destination
 */
async function addDestination(e) {
    e.preventDefault()
    // inputs
    let image = document.getElementById('imageDest')
    let circuit = document.getElementById('circuitDest').value
    let tarif = document.getElementById('tarifDest').value
    let pays = document.getElementById('paysDest').value

    // Lire l'image
    image = await readFile(image)

    //increment the id
    let id = destinations.length;

    //Ajouter sur la liste
    let newDestination = new Destination(id,pays, image, circuit, parseInt(tarif))
    destinations.push(newDestination)

    // Preparer le requette ajax
    let post = {
        action: 'updateOrAdd',
        data:newDestination.toJSON(),
    }
    console.log(post);

    // Lancer la requette ajax
    await $.ajax({
        url: './data/persistance.php',
        type: 'POST',
        data: post,
        success: function (data) {
            console.log(JSON.parse(data));
        },
    })

    // Mettre a jour l'affichage et enlever le form
    displayDestinations(destinations)
    // Fermer le form
    let destinationFormModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('destinationFormModal'))
    destinationFormModal.hide()
}

/**
 * Modifie la destination choisie
 * @param {event} e
 */
async function modifyDestination(e) {
    e.preventDefault()
    // inputs
    let idDest = document.getElementById('idDest').value
    let image = document.getElementById('imageDest')
    let circuit = document.getElementById('circuitDest').value
    let tarif = document.getElementById('tarifDest').value
    let pays = document.getElementById('paysDest').value

    // Trouver la destination sur la liste des destinations
    let destPos = destinations
        .map((x) => {
            return x.id
        })
        .indexOf(parseInt(idDest))

    // Modifier les informaions de la destination trouvee
    destinations[destPos].circuit = circuit
    destinations[destPos].tarif = parseInt(tarif)
    destinations[destPos].pays = pays
    if (image.files[0]) {
        image = await readFile(image)
        destinations[destPos].photoURL = image
    }
    
    let post = {
        action: 'updateOrAdd',
        data: destinations[destPos].toJSON(),
    }

    await $.ajax({
        url: './data/persistance.php',
        type: 'POST',
        data: post,
        success: function (data) {
            destinationsJSON = JSON.parse(data)
        },
    })


    //Mettre a jour l'affichage
    displayDestinations(destinations)
    // Fermer le form
    let destinationFormModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('destinationFormModal'))
    destinationFormModal.hide()
}

/**
 * Lire l'image inserer
 * @param {element} input input htmlelement
 * @returns base64 data value de l'image
 */
async function readFile(input) {
    let file = input.files[0]

    let reader = new FileReader()

    return new Promise((resolve, reject) => {
        reader.onerror = () => {
            reader.abort()
            reject(new DOMException('Problem parsing input file.'))
        }

        reader.onload = () => resolve(reader.result)
        return reader.readAsDataURL(file)
    })
}

/**
 * Supprime la destination avec l'id {id} puis reinitialise l'affichage de la liste
 * @param {int} id id of destination to remove
 */
async function removeDestination(id) {
    let destToRemoveId = '';
    destinations.forEach((destination) => {
        if (destination.id == id) {
            destToRemoveId = destination.id;
            destinations = destinations.filter((dest) => dest.id != id)
        }
    })

    let post = {
        action: 'delete',
        data: destToRemoveId,
    }

    await $.ajax({
        url: './data/persistance.php',
        type: 'POST',
        data: post,
        success: function (data) {
            destinationsJSON = JSON.parse(data)
        },
    })

    displayDestinations(destinations)
}
//!SECTION
//!SECTION

//SECTION TP 4

/**
 * Requette ajax qui fait une tentative de connection
 * Affiche un toast en fonction de la reponse ajax
 * Change l'affichage des destinations en fonction s'il est admin, utilisateur ou pas,
 * @param {HTMLElement} form Le login form
 * @param {Event} e Event
 */
async function connection(form, e) {
    e.preventDefault()
    let login = document.getElementById('login').value
    let password = document.getElementById('password').value

    let formData = { login: login, password: password }

    $.ajax({
        url: './data/connection.php',
        type: 'POST',
        data: formData,
        success: function (data, textStatus, jqXHR) {
            if (data == 'Success' && formData.login == 'admin') {
                sessionStorage.setItem('user', 'admin')
                showToast('Connection', 'Connection Reussi. Bienvenue Admin!')
            } else if (data == 'Success' && formData.login == 'user') {
                showToast('Connection', 'Connection Reussi. Bienvenue Normal User!')
                sessionStorage.setItem('user', 'normal')
            } else {
                showToast('Connection', 'Echec de Connection!')
                sessionStorage.removeItem('user')
            }
            //remove the modal
            let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById(form.dataset.modal))
            modal.hide()
            //Redisplay
            displayDestinations(destinations)
        },
        error: function (jqXHR, textStatus, errorThrown) {},
    })
}
/**
 * Retourne Vrai si l'utilisateur est un admin Faux sinon
 * @returns boolean
 */
function isAdmin() {
    return sessionStorage.getItem('user') == 'admin'
}
/**
 * Retourne Vrai si l'utilisateur est connectee Faux sinon
 * @returns boolean
 */
function isUser() {
    return sessionStorage.getItem('user') ? true : false
}

/**
 * Affiche un toast avec le titre est le message donnee
 * @param {string} title Titre de toast
 * @param {string} message Message du toast
 */
function showToast(title, message) {
    document.getElementById('toast-body').innerHTML = message
    document.getElementById('toast-title').innerHTML = title
    new bootstrap.Toast(document.getElementById('toast'), { animation: true, autohide: true, delay: 3000 }).show()
}

async function getDestinations() {

    let destinations = [];
    let destinationsJSON;

    let post = {action:'read'}

    await $.ajax({
        url: './data/persistance.php',
        type: 'POST',
        data: post,
        success: function (data) {
            destinationsJSON = JSON.parse(data)
        },
    })

    destinationsJSON.forEach((destination) => {
        destinations.push(new Destination(destination.id,destination.pays, destination.photoURL, destination.circuit, destination.tarif))
    })
    return destinations
}

/**
 * Ajoute l'effet de zoom sur une card 
 * @param {string} cardId 
 */
function cardZoom(cardId) {
    console.log(cardId);
    let card = document.getElementById(cardId).querySelector('.card');
    card.classList.add('zoomed');

    card.addEventListener('mouseleave', () => {
            card.classList.remove('zoomed')
        },{ once: true });
}
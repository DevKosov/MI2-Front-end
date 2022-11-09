//SECTION Navbar
const navbar = document.getElementById('navbar')
function activeNavbar(scrollpos) {
    (scrollpos > 100)
        ? navbar.classList.add('scrolling')
        : navbar.classList.remove('scrolling')
}
document.addEventListener('scroll', () => activeNavbar(window.scrollY))
//!SECTION


//TP 4
// async function getDestinations() {
//     const destinations = [];
//     const destinationsJSON = await fetch('./script/destinations.json')
//         .then((response) => response.json())

//     destinationsJSON.forEach(destination => {
//         destinations.push(new Destination(destination.pays,destination.photoURL,destination.circuit,destination.tarif));
//     });
//     return destinations;
// }

//SECTION TP 3

//List of initial destinations
let destinations = [
    new Destination(
        'Kosovo',
        'images/albania.jpg',
        'Circuits de 8 jours / 7 nuits au départ de Paris le 17 avr. 2023',
        9000
    ),
    new Destination(
        'Albania',
        'images/albania.jpg',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit vero nesciunt amet tempora illo adipisci ut fuga aspernatur quibusdam est.',
        6000
    ),
    new Destination(
        'France',
        'images/albania.jpg',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit vero nesciunt amet tempora illo adipisci ut fuga aspernatur quibusdam est.',
        15000
    ),
    new Destination(
        'Turkey',
        'images/albania.jpg',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit vero nesciunt amet tempora illo adipisci ut fuga aspernatur quibusdam est.',
        9000
    )
]

//SECTION TP3 Affichage de menu en single page

/**
 * Change de vue en fonction de nav cliquer
 * @param {Element} nav navigateur clicked
 */
function switchViews(nav) {
    if (nav.dataset.section != 'accueil')
        document.getElementById('navbar').classList.add('scrolling');
    else
        document.getElementById('navbar').classList.remove('scrolling')
    //Remove display of last activated nav 
    let lastActiveNav = navbarParent.querySelector('a.active')
    lastActiveNav.classList.remove('active')
    //add display to the newly selected nav
    nav.classList.add('active')

    //Close the old section
    let lastActiveSection = document.querySelector('section.active')
    lastActiveSection.classList.remove('active')
    lastActiveSection.classList.add('hidden')
    //Open the new section
    let openSection = document.getElementById(nav.dataset.section)
    openSection.classList.remove('hidden')
    openSection.classList.add('active')
}

const navbarParent = document.getElementById('navbar-links');
const navbarLinks = navbarParent.querySelectorAll('a.ALeftToRight:not(.dropdown-link)')

navbarLinks.forEach((nav) => {
    nav.addEventListener('click', () => switchViews(nav));
})

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


            destinationTable.innerHTML += `
			<tr id="destination${destination.id}">
				<td><img src="${destination.photoURL}" alt="${destination.pays}"></td>
				<td class="pays">${destination.pays}</td>
				<td class="circuit">${destination.circuit}</td>
				<td class="tarif">${tarifFormated}</td>
				<td class="reserver">
					<button class="ALeftToRight "> 
					Reserver 
					<div class='absolute'><hr/></div>
					</button>
                    <span class="trashcan" onclick="removeDestination(${destination.id})"><img src="images/remove.svg"></span>
                    <span class="edit" onclick="destinationFormState(${destination.id},'modify')"><img src="images/edit.svg"></span>
				</td>
			</tr>
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
function destinationFormState(id,action) {

    //Declaration du form et reinitialisation 
    let paysDest = document.getElementById('paysDest');
    let idDest = document.getElementById('idDest');
    let imageDest = document.getElementById('imageDest');
    let circuitDest = document.getElementById('circuitDest');
    let tarifDest = document.getElementById('tarifDest');
    let imagePreview = document.getElementById('imagePreviewDest');
    let form = document.getElementById('destinationForm');
    
    // Reinit all values
    paysDest.value = '';
    imagePreview.setAttribute('src','');
    idDest.value = '';
    imageDest.value = '';
    circuitDest.value = '';
    tarifDest.value = '';    
    
    // Si l'action est d'ajouter une nouvelle destination
    if (action == 'add'){
        // Afficher le form
        form.classList.remove('hidden');
        let title = form.querySelector('h3')
        title.innerHTML = 'Ajouter une destination'
        form.addEventListener('submit',(e) => addDestination(e),{once: true});
    }else{ // Sinon c'est l'action modifier
        let editDestination;
        destinations.forEach(dest => {
            if (dest.id == id){
                editDestination = dest;
            }
        });
        form.classList.remove('hidden');
        let title = form.querySelector('h3');
        title.innerHTML = "Modifier la destination";
        imagePreview.setAttribute('src', editDestination.photoURL);

        paysDest.value = editDestination.pays;
        idDest.value = editDestination.id;
        circuitDest.value = editDestination.circuit;
        tarifDest.value = parseInt(editDestination.tarif);
        console.log(editDestination);

        form.addEventListener('submit', (e) => modifyDestination(e),{once: true});
    }

}
/**
 * Insere une nouvelle destination sur le variable destinations 
 * puis met a jour l'affichage de la liste
 * @param {event} e l'event de destination
 */
async function addDestination(e) {
    e.preventDefault();
    // inputs
    let image = document.getElementById('imageDest');
    let circuit = document.getElementById('circuitDest').value;
    let tarif = document.getElementById('tarifDest').value;
    let pays = document.getElementById('paysDest').value;
    
    // Lire l'image
    image = await readFile(image);
    
    //Ajouter sur la liste
    destinations.push(new Destination(pays, image, circuit, parseInt(tarif)));
    
    // Mettre a jour l'affichage et enlever le form
    displayDestinations(destinations);
    document.getElementById('destinationForm').classList.add('hidden');
}

/**
 * Modifie la destination choisie
 * @param {event} e 
 */
async function modifyDestination(e) {
    e.preventDefault();
    // inputs
    let idDest = document.getElementById('idDest').value;
    let image = document.getElementById('imageDest')
    let circuit = document.getElementById('circuitDest').value
    let tarif = document.getElementById('tarifDest').value
    let pays = document.getElementById('paysDest').value

    // Trouver la destination sur la liste des destinations
    let destPos = destinations.map((x)=> {return x.id; }).indexOf(parseInt(idDest));

    // Modifier les informaions de la destination trouvee
    destinations[destPos].circuit = circuit
    destinations[destPos].tarif = parseInt(tarif);
    destinations[destPos].pays = pays
    if (image.files[0]){
        image = await readFile(image)
        destinations[destPos].photoURL = image
    }

    //Mettre a jour l'affichage
    displayDestinations(destinations)
    // Fermer le form
    document.getElementById('destinationForm').classList.add('hidden')

}

// /**
//  * 
//  * @param {string} url 
//  * @returns 
//  */
// async function toDataURL(url) {
//     return fetch(url)
//     .then((response) => response.blob())
//     .then((blob) =>
//             new Promise((resolve, reject) => {
//                 const reader = new FileReader()
//                 reader.onloadend = () => resolve(reader.result)
//                 reader.onerror = reject
//                 reader.readAsDataURL(blob)
//             })
//     )
// }

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
function removeDestination(id) {
    destinations.forEach((destination) => {
        if (destination.id == id) {
            destinations = destinations.filter((dest) => dest.id != id)
        }
    })
    displayDestinations(destinations)
}
//!SECTION
//!SECTION

/**
 * Lancee on load de window
 */
window.onload = async () => {
    //Video autoplay
    if (document.getElementById('mainvid'))
        document.getElementById('mainvid').play();

    // TP 3:
    // Display destinations
    displayDestinations(destinations);

    //TP 3 modify / add image on change
    document.getElementById('imageDest').addEventListener('change',async ()=>{
        let image = await readFile(document.getElementById('imageDest'));
        document.getElementById('imagePreviewDest').setAttribute('src', image);
    });

    //TP 4:
    //List of initial destinations
    // const destinations = await getDestinations()
    //Display destinations
    // console.log(destinations);
    // displayDestinations(destinations);
}

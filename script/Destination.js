class Destination {
    /**
     * Cree un objet Destination
     * @param {int} pays : nom du pays
     * @param {string} pays : nom du pays
     * @param {string} photoURL : url du photo
     * @param {string} circuit : description du circuit
     * @param {int} tarif
     */
    constructor(id, pays, photoURL, circuit, tarif) {
        this.id = id
        this.pays = pays
        this.photoURL = photoURL ? photoURL : 'images/albania.jpg'
        this.circuit = circuit
        this.tarif = tarif
    }

    /**
     * Converts Class values to JSON
     * @returns JSON object
     */
    toJSON() {
        //convert to json
        return JSON.stringify({
            id: this.id,
            pays: this.pays,
            photoURL: this.photoURL,
            circuit: this.circuit,
            tarif: this.tarif,
        })
    }
    get id() {
        return this._id
    }

    set id(value) {
        this._id = value
    }

    get pays() {
        return this._pays
    }

    set pays(value) {
        this._pays = value
    }

    get photoURL() {
        return this._photoURL
    }

    set photoURL(value) {
        this._photoURL = value
    }

    get circuit() {
        return this._circuit
    }

    set circuit(value) {
        this._circuit = value
    }

    get tarif() {
        return this._tarif
    }

    set tarif(value) {
        this._tarif = value
    }
    /**
     * Static method. Auto increments ids for destinations
     * @returns Next auto incremented id for a destination
     */
    // static incrementId() {
    //     if (!this._latestId)
    //         this._latestId = 0
    //     else
    //         this._latestId++
    //     return this._latestId
    // }
}
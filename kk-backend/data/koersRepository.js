var koersen = [];

exports.store = function (koers) {
    if(koers) {
        koersen.push(koers);
    }

    return koers;
}

exports.load = function (id) {

    if(id) {
        return koersen.find(x => x.id == id);
    }
    else { return undefined; }
}

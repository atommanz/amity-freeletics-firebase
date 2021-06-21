function findHashtag(searchText) {
    var regexp = /\B\#\w\w+\b/g
    result = searchText.match(regexp);
    if (result) {
        return result
    } else {
        return false;
    }
}

module.exports = findHashtag
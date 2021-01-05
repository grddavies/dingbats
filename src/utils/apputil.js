/** Generate a hex representation of a 32bit int for a given input string.  
 * Modificied JavaScript port of the Java String.hashCode() method.
 * @param {String} str
 * @return {String}
*/
function hashCode(str) {
    return Array.from(str).reduce((hash, c) => 0 | (31 * hash + c.charCodeAt(0)), 0).toString(16);
}

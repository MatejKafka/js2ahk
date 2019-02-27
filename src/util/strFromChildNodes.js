const indent = (str) => '\t' + str.split('\n').join('\n\t')

/**
 * @param {[AhkNode]} nodeList
 * @returns {string}
 */
const strFromAhkNodeList = (nodeList) =>
	nodeList
		.map(n => n.toString())
		.join('\n')


/**
 * @param {[AhkNode]} childNodes
 * @returns {string}
 */
module.exports = (childNodes) => indent(strFromAhkNodeList(childNodes))

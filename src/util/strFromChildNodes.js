const indent = (str) => '\t' + str.split('\n').join('\n\t')

/**
 * @param {[AhkNode]} nodeList
 * @returns {string}
 */
const strFromAhkNodeList = (nodeList) => {
	if (!Array.isArray(nodeList)) {
		return nodeList.toString()
	}
	return nodeList
		.map(strFromAhkNodeList)
		.join('\n')
}


/**
 * @param {[AhkNode]} childNodes
 * @returns {string}
 */
module.exports = (childNodes) => indent(strFromAhkNodeList(childNodes))

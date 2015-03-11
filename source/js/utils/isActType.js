var _const = require('./const');

function isActType(types, actType) {
	return _const[types].indexOf(actType) >= 0;
}

module.exports = isActType;

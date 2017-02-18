import CONST from './const.js';

export function isActType(types, actType) {
	return CONST[types].indexOf(actType) >= 0;
}

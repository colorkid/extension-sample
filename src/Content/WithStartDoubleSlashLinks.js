import Links from './Links.js';

export default class WithStartDoubleSlashLinks extends Links {
	
	getLink(item, hostProtocol) {
		return hostProtocol + "//" + item.split("").slice(2).join("");
	}

}
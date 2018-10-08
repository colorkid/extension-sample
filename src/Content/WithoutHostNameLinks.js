import Links from './Links.js';

export default class WithoutHostNameLinks extends Links {
	
	getLink(item, hostProtocol, hostName) {
		return hostProtocol + "//" + hostName + "/" + item;
	}

}
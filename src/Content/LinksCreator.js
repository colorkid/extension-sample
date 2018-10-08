import WithHttpLinks from './WithHttpLinks.js'
import WithoutHostNameLinks from './WithoutHostNameLinks.js'
import WithStartDoubleSlashLinks from './WithStartDoubleSlashLinks.js'
import Base64Links from './Base64Links.js'

export default class LinksCreator {
	constructor (item) {
		if (item.substring(0,4) === "http" || item.substring(0,5) === "https") {
			return new WithHttpLinks();
		} else if (item.substring(0,2) === "//") {
			return new WithStartDoubleSlashLinks();
		} else if (item.indexOf("data:image/gif;base64,") !== -1) {
			return new Base64Links();
		} else {
			return new WithoutHostNameLinks();
		}
	}
}
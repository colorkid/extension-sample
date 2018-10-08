export default class View {

	constructor() {
		this.listenerMessages();
		this.resultTable = document.querySelector(".result-table__result");
		this.inputNumber = document.querySelector(".extension__input");
		this.inputNumber.addEventListener("input", function() {
			window.parent.postMessage({message: "clickOnCountRowsField", numberFiles: this.value}, "*");
		});
		document.querySelector("#download").addEventListener("click", function() {
			window.parent.postMessage({message: "clickOnDownloadButton"}, "*");
		});
		document.querySelector("#close").addEventListener("click", function() {
			window.parent.postMessage({message: "clickOnCloseButton"}, "*");
		});
	}

	listenerMessages() {
		window.addEventListener("message", (event) => {
			if (event.data.message === "renderExtension") {
				this.renderNumberFiles(event.data.numberFiles);
				this.renderFiles(event.data.readyArr, event.data.numberDownload);
			}
		});
	}

	renderNumberFiles(numberFiles) {
		this.inputNumber.value = numberFiles;
	}

	renderFiles(links, count) {
		this.resultTable.innerHTML = "";
		if (links.length !== 0) {
			for (let i = 0; i < count; i++) {
		  		this.resultTable.appendChild(this.renderRow(links[i], i));
			}
		} else {
			this.resultTable.innerHTML = `<p class="no-pic-message">Sorry, but this page has no images.</p>`;
		}	
	}

	renderRow(item, i) {
		let row = document.createElement("div");
		row.className = "result-table__row";
		row.appendChild(this.renderCellName(item, i));
		row.appendChild(this.renderCellScale(item[2]));
		row.appendChild(this.renderCellSize(item[1]));
		return row;
	}

	renderCellName(item, i) {
		let cellName = document.createElement("div");
		cellName.className = "result-table__cell";
		cellName.appendChild(this.renderLink(item, i));
		return cellName;
	}

	renderLink(item, i) {
		let link = document.createElement("a");
		link.className = "result-table__link";
		link.setAttribute("href", `${item[0]}`);
		link.setAttribute("target", "_blank");
		link.innerText = `image${i+1}`;
		return link;
	}

	renderCellSize(size) {
		let cellSize = document.createElement("div");
		cellSize.className = "result-table__cell";
		if (size === 0) {
			cellSize.innerText = `Dynamic file size`; 
		} else {
			cellSize.innerText = `${size}(Kb)`;
		}
		return cellSize;
	}

	renderCellScale(scale) {
		let cellScale = document.createElement("div");
		cellScale.className = "result-table__cell";
		cellScale.innerText = `${scale}(Px)`;
		return cellScale;
	}

}

new View();
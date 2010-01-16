var Element = { attributes:{}, internalUse:{}, data:{}, functions:{} };

Element.data.tagsUsingInnerHtml = { button: true, td: true, span: true, div: true }

Element.new = function(options) {
	var type = options.type	
	var tag = Element.internalUse.createType(options)
	
	for(attribute in options) {
		var lookup = Element.attributes[attribute] 
		if(lookup != null) {
			lookup(type, options[attribute], tag);
		} else {
			Element.internalUse.defaultProcessing(attribute, options[attribute], tag);
		}
	}
	
	return new ElementWrapper(tag);
}
	
Element.attributes.parent = function(type, attribute, tag) {
	var element = Element.for(attribute)
	Element.internalUse.extern(element).appendChild(tag);
}

Element.attributes.before = function(type, attribute, tag) {
	var element = Element.internalUse.extern(attribute)
	var parent = element.parentNode
	Element.internalUse.extern(parent).insertBefore(tag, element);
}

Element.attributes.after = function(type, attribute, tag) {
	var element = Element.internalUse.extern(attribute)
	var parent = element.parentNode
	var hasSibling = element.nextSibling != null
	if( hasSibling ) {
		parent.insertBefore(tag, element.nextSibling);
	} else {
		Element.attributes.parent(type, parent, tag);
	}
}

Element.attributes.value = function(type, attribute, tag) {
	if(Element.data.tagsUsingInnerHtml[type]) {
		tag.innerHTML = attribute;
	} else {
		tag.value = attribute;
	}
}

Element.for = function(name) {
	if(name instanceof ElementWrapper) return name;
	
	if(Element.isString(name)) {
		var element = document.getElementById(name)
		return element == null ? null : new ElementWrapper(element)		
	}
	
	return new ElementWrapper(name)
}

Element.addClassName = function(element, className) {
	element = Element.internalUse.extern(element)
	var split = element.className.split(" ");
	Element.internalUse.addClassName(split, className);
	element.className = split.join(" ");
}

Element.removeClassName = function(element, className) {
	element = Element.internalUse.extern(element)
	var split = element.className.split(" ");
	Element.internalUse.removeClassName(split, className);
	element.className = split.join(" ");
}

Element.isString = function(value) {
	return typeof value == "string" || value instanceof String;
}

Element.internalUse.extern = function(value) {
	if(value instanceof ElementWrapper) return value.internal;
	
	if(Element.isString(value)) {
		var element = document.getElementById(value)
		return element == null ? null : element		
	}
	
	return value
}

Element.internalUse.addClassName = function (array, value) {
	var index = array.indexOf(array, value);
	if(index == -1) {
		array.push(value);
	}
	return array;
}

Element.internalUse.removeClassName = function(array, value) {
	var index = array.indexOf(value);
	if(index != -1) {
		array.splice(index, 1);
	}
	return array;
}

Element.internalUse.defaultProcessing = function(name, attribute, tag) {
	tag[name] = attribute
}

Element.internalUse.createType = function(options) {
	var element;
	var parent = Element.internalUse.extern(options.parent);
	if(options.type == 'tr') {
		element = Element.internalUse.addRowToTable(parent, options);
	} else if(options.type == 'td') {
		element = Element.internalUse.addCellToRow(parent, options);
	} else {
		element = document.createElement(options.type);
	}
	delete options.type;
	return element;
}

Element.internalUse.addRowToTable = function(parent, options) {
	delete options.parent;
	return parent.insertRow(-1);
}

Element.internalUse.addCellToRow = function(parent, options) {
	delete options.parent;
	return parent.insertCell(-1);
}

function ElementWrapper(element) {
	this.internal = element;

	this.remove = function() {
		var parent = element.parentNode;
		if(parent != null) {
			parent.removeChild(element);			
		}
	}
	
	this.addClassName = function(name) {
		Element.addClassName(this.internal, name);
	}
	
	this.removeClassName = function(name) {
		Element.removeClassName(this.internal, name);
	}
}

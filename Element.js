var Element = { attributes:{}, internalUse:{} };

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
	Element.internalUse.parentExtractor(attribute).appendChild(tag);
}
	
Element.attributes.value = function(type, attribute, tag) {
	if(type == 'button' || type == 'td' || type == 'span' || type == 'div') {
		tag.innerHTML = attribute;
	} else {
		tag.value = attribute;
	}
}

Element.internalUse.defaultProcessing = function(name, attribute, tag) {
	tag[name] = attribute
}

Element.internalUse.createType = function(options) {
	var element
	if(options.type == 'tr') {
		element = Element.internalUse.parentExtractor(options.parent).insertRow(-1);
		delete options.parent;
	} else if(options.type == 'td') {
		element = Element.internalUse.parentExtractor(options.parent).insertCell(-1);
		delete options.parent;
	} else {
		element = document.createElement(options.type);
	}
	delete options.type
	return element;
}

Element.internalUse.parentExtractor = function(target) {
	return (target instanceof ElementWrapper) ? target.internal : target;
}

function ElementWrapper(element) {
	this.internal = element;

	this.remove = function() {
		var parent = element.parentNode;
		if(parent != null) {
			parent.removeChild(element);			
		}
	}
}

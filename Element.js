
var Element = {		
	
	new: function(options) {
		var type = options.type	
		var tag = Element.internalUse.createType(options)
		delete options.type
		
		for(attribute in options) {
			var lookup = this[attribute] 
			if(lookup != null) {
				lookup(type, options[attribute], tag);
			} else {
				this['default'](attribute, options[attribute], tag);
			}
		}
		
		return Element.internalUse.createResultWrapper(tag)
	},
	
	parent: function(type, attribute, tag) {
		Element.internalUse.parentExtractor(attribute).appendChild(tag);
	},
	
	value: function(type, attribute, tag) {
		if(type == 'button' || type == 'td' || type == 'span' || type == 'div') {
			tag.innerHTML = attribute;
		} else {
			tag.value = attribute;
		}
	},
		
	default: function(name, attribute, tag) {
		tag[name] = attribute
	},
	
	internalUse: {}

}

Element.internalUse.createResultWrapper = function(tag) {
	return {
		_typeHack: "_fixMeWhenYouLearnJavascript",

		internal: tag,

		remove: function() {
			var parent = this.internal.parentNode;
			parent.removeChild(this.internal);
		}			
	}
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
	return element;
}

Element.internalUse.parentExtractor = function(target) {
	if(target._typeHack == "_fixMeWhenYouLearnJavascript") {
		return target.internal;
	}
	return target;
}

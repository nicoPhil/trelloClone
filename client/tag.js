function getCurrentCardId() {
	return Session.get('cardId');
}

function getTagsForCurrentCard() {
	var cardId = getCurrentCardId();
	return tagColl.find({
		cards: {
			cardId: cardId
		}
	});
}

Template.tagList.tags = function() {
	return getTagsForCurrentCard();
}

function hasTag(tag) {

	var tagFound = false;
	console.log('hastag');
	var tagArr = getTagsForCurrentCard();
	tagArr.forEach(function(it) {
		if (it.title == tag) {
			tagFound = true;
			return;
		}
	});
	return tagFound;
}

function saveNewTag(e, templ) {

	var cardId = getCurrentCardId();
	var textInput = $(templ.find("._newtagtitle"));
	var newtagtitle = textInput.val();

	if (!newtagtitle) {
		return;
	}
	if (hasTag(newtagtitle)) {
		return;
	}

	Meteor.call('addTag', cardId, newtagtitle);

}

function removeTag(e, templ) {
	var cardId = getCurrentCardId();
	var tagId = e.currentTarget.classList[2];

	Meteor.call('removeTag', cardId, tagId);

}

Template.tagList.events({
	'keypress ._newtagtitle': function(e, templ) {
		if (e.keyCode == 13) {
			saveNewTag(e, templ);
			$(templ.find("._newtagtitle")).blur();
		}
	},
	'click ._removeTag': function(e, templ) {
		removeTag(e, templ);
	}

});
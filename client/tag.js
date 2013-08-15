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

	var foundTag = tagColl.findOne({
		title: newtagtitle
	});

	if (foundTag) {
		tagColl.update({
			_id: foundTag._id
		}, {
			$push: {
				cards: {
					cardId: cardId
				}
			}
		})
	} else {
		tagColl.insert({
			title: newtagtitle,
			cards: [{
				cardId: cardId
			}]
		});
	}
}

function removeTag(e, templ) {
	var cardId = getCurrentCardId();
	var tagId = e.currentTarget.classList[2];
	tagColl.update({
		_id: tagId
	}, {
		$pull: {
			cards: {
				cardId: cardId
			}
		}
	});

	if(tagColl.findOne({_id: tagId}).cards.length == 0){
		tagColl.remove({_id: tagId});
	}
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
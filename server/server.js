Meteor.publish("workspaceColl", function() {
	return workspaceColl.find({
		userId: this.userId
	});
});

Meteor.publish("cardColl", function() {
	return cardColl.find({
		userId: this.userId
	});
});

Meteor.publish("categoryColl", function() {
	return categoryColl.find({
		userId: this.userId
	});
});

Meteor.publish("tagColl", function() {
	return tagColl.find({
		userId: this.userId
	});
});

function isAllowedToModifyCard(cardId, userId) {
	var foundCard = cardColl.findOne({
		_id: cardId
	});
	if (foundCard.userId != userId) {
		return false;
	}
	return true;
}

Meteor.methods({
	insertWorkspace: function(name) {
		var newId = workspaceColl.insert({
			name: name,
			userId: this.userId
		});
		return newId;
	},

	removeWorkspace: function(workspaceId) {
		workspaceColl.remove({
			_id: workspaceId
		});
	},

	insertCategory: function(title, workspaceId) {
		var newId = categoryColl.insert({
			title: title,
			workspaceId: workspaceId,
			userId: this.userId
		});
		return newId;
	},
	insertCard: function(title, categoryId) {
		var newId = cardColl.insert({
			title: title,
			categoryId: categoryId,
			userId: this.userId
		});
		return newId;
	},
	updateCard: function(cardId, title, description) {

		if (!isAllowedToModifyCard(cardId, this.userId)) {
			return;
		}

		cardColl.update(cardId, {
			$set: {
				title: title,
				description: description
			}
		});
	},
	removeCard: function(cardId) {

		if (!isAllowedToModifyCard(cardId, this.userId)) {
			return;
		}

		cardColl.remove({
			_id: cardId
		});
	},
	addNote: function(cardId, note) {

		if (!isAllowedToModifyCard(cardId, this.userId)) {
			return;
		}

		cardColl.update({
			_id: cardId
		}, {
			$push: {
				notes: {
					title: note
				}
			}
		})
	},

	addTag: function(cardId, tag) {
		var foundTag = tagColl.findOne({
			title: tag,
			userId: this.userId
		});

		if (foundTag) {
			tagColl.update({
				_id: foundTag._id
			}, {
				$inc: {
					nbCards: 1
				},
				$push: {
					cards: {
						cardId: cardId
					}
				}
			})
		} else {
			tagColl.insert({
				title: tag,
				userId: this.userId,
				nbCards: 1,
				cards: [{
					cardId: cardId
				}]
			});
		}
	},
	removeTag: function(cardId, tagId) {
		tagColl.update({
			_id: tagId
		}, {
			$inc: {
					nbCards: -1
				},
			$pull: {
				cards: {
					cardId: cardId
				}
			}
		});

		if (tagColl.findOne({
			_id: tagId
		}).cards.length == 0) {
			tagColl.remove({
				_id: tagId
			});
		}
	},

});
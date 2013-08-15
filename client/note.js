function saveNewNote(e, templ) {
	var cardId = Session.get('cardId');
	var textInput = $(templ.find("._newnotetitle"));
	var newnotetitle = textInput.val();
	if (!newnotetitle) {
		return;
	}

	cardColl.update({
		_id: cardId
	}, {
		$push: {
			notes: {
				title: newnotetitle
			}
		}
	})

}

Template.noteList.notes = function(){
	var cardId = Session.get('cardId');
	var ret =  cardColl.findOne({_id : cardId});
	return ret.notes;
}


Template.noteList.events({
	'keypress ._newnotetitle': function(e, templ) {
		if (e.keyCode == 13) {
			saveNewNote(e, templ);
			$(templ.find("._newnotetitle")).blur();
		}
	}
});
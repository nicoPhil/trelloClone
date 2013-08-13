Template.categoryList.categoryList = function() {
	return categoryColl.find({
		workspaceId: Session.get('workspaceId')
	});
}

Template.categoryList.rendered = function() {
	window.tc.setInputPlaceholder();
}

function saveNewCat(e, templ) {
	var title = templ.find("._newCatName").value;
	if (title) {
		categoryColl.insert({
			title: title,
			workspaceId: Session.get('workspaceId')
		})
	}

}

Template.categoryList.events({
	'click ._newCatSave': saveNewCat,
	'keypress ._newCatName':function(e,templ){
		if (e.keyCode == 13) {
			saveNewCat(e,templ);
			$(templ.find("._newCatName")).blur();
		}
	}
});
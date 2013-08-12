Template.categoryList.categoryList = function() {
	console.log('a');
	return categoryColl.find({
		workspaceId: Session.get('workspaceId')
	});
}

Template.categoryList.events({
	'click ._newCatSave': function(e,templ) {
		var title = templ.find("._newCatName").value;
		if (title) {
			categoryColl.insert({
				title: title,
				workspaceId: Session.get('workspaceId')
			})
		}
	}
});
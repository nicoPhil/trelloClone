Meteor.subscribe("workspaceColl");
Meteor.subscribe("cardColl");
Meteor.subscribe("categoryColl");
Meteor.subscribe("tagColl");



function selectCard(id) {
  Session.set('cardId', id);
}

function selectWorkspace(id) {

  Session.set('cardId', null);
  Session.set('workspaceId', id);
}


function getCardId() {
  var cardId = Session.get('cardId');
  return cardId;
}

Template.workspaceList.rendered = function() {
  window.tc.setInputPlaceholder();
}

Template.workspaceList.workspaces = function() {
  return workspaceColl.find();
};

Template.content.selectedWorkspace = function() {
  return Session.get('workspaceId');
}

Template.content.selectedCard = function() {
  return getCardId();
}

Template.barHaut.events({
  'click ._deletewWorkspace': function() {
<<<<<<< HEAD
    workspaceColl.remove({
      _id: this._id
    });
=======
    Meteor.call('removeWorkspace', this._id);
>>>>>>> debut filtres tags
    selectWorkspace(null);
  }
});


Template.barHaut.workspace = function() {
  return workspaceColl.findOne({
    _id: Session.get('workspaceId')
  });
}

<<<<<<< HEAD
=======
Template.barHaut.topTags = function() {
  return tagColl.find({}, {sort: {ndCards: -1}})
}


>>>>>>> debut filtres tags
function saveNewWorkspace(e, templ) {
  var textInput = $(templ.find("._newespacename"));
  var newWorkspaceName = textInput.val();
  if (!newWorkspaceName) {
    return;
  }

  Meteor.call('insertWorkspace', newWorkspaceName, function(err, newWorkspaceId) {
    textInput.val('');
    Session.set('workspaceId', newWorkspaceId);
  })

}

Template.workspaceList.events({
  'click ._newespacesave': saveNewWorkspace,
  'keypress ._newespacename': function(e, templ) {
    if (e.keyCode == 13) {
      saveNewWorkspace(e, templ);
      $(templ.find("._newespacename")).blur();
    }
  }

});

Template.workspace.events({
  'click ._workspaceItem': function(e, templ) {
    selectWorkspace(templ.data._id);
  }
});

Template.workspace.selected = function() {
  return Session.equals('workspaceId', this._id) ? 'selected' : '';
}

Template.card.selected = function() {
  return Session.equals('cardId', this._id) ? 'selected' : '';
}

Template.contentCards.rendered = function() {
  window.tc.setInputPlaceholder();
}

Template.contentCards.cards = function() {
  return cardColl.find({
    categoryId: this._id // this.id correspond a la categoryId
  })
}



Template.cardDetails.card = function() {
  return cardColl.findOne({
    _id: getCardId()
  });
}

Template.cardDetails.events({
  'click ._btnsave': function(e, templ) {
    var cardId = getCardId();
    var title = templ.find("._inputTitle").value;
    var description = templ.find("._inputDescription").value;

    Meteor.call('updateCard', cardId, title, description);
  },
  'click ._btndelete': function(e, templ) {
    var cardId = getCardId();
    Meteor.call('removeCard', cardId);
  }
});



Template.card.events({
  'click ._cardItem': function(e, templ) {
    Session.set('cardId', templ.data._id);
  },
});

function saveNewCard(e, templ) {
  var currentCatId = templ.data._id;
  var textInput = $(templ.find("._newcardtitle"));
  var newcardtitle = textInput.val();
  if (!newcardtitle) {
    return;
  }
  Meteor.call('insertCard', newcardtitle, currentCatId, function(err, newCardId) {
    selectCard(newCardId);
  });

}

Template.contentCards.events({
  'click ._newcardsave': saveNewCard,
  'keypress ._newcardtitle': function(e, templ) {
    if (e.keyCode == 13) {
      saveNewCard(e, templ);
      $(templ.find("._newcardtitle")).blur();
    }
  }
});
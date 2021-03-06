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

    Meteor.call('removeWorkspace', this._id);
    selectWorkspace(null);
  }
});


Template.barHaut.workspace = function() {
  return workspaceColl.findOne({
    _id: Session.get('workspaceId')
  });
}


Template.barHaut.selected = function() {

  var currentTagList = Session.get('currentTagList');
  var i;
  if (!currentTagList) {
    return '';
  }

  for (var i = 0; i < currentTagList.length; i++) {
    if (this.title == currentTagList[i].title) {
      return 'selected';
    }

  }

  return '';
}

Template.barHaut.topTags = function() {
  console.log('topTags');
  return tagColl.find({}, {
    sort: {
      ndCards: -1
    }
  })
}

function sessionAddOrRemoveTag(tagObj) {

  var i, j;
  var foundTag = false;
  var tag, card;
  var currentTagList = Session.get('currentTagList');
  currentTagList = currentTagList || [];

  var badCardList = [];

  function isCardInTagArray(cardId, tagArr) {
    var i = 0;

    for (i = 0; i < tagArr.length; i++) {
      if (tagArr[i].cardId == cardId) {
        return true;
      }
    }
    return false;
  }

  function handleOneTag(tag) {
    var cardArray = cardColl.find();
    cardArray.forEach(function(card) {
      console.log('cardArray.forEach');
      if (!isCardInTagArray(card._id, tag.cards)) {
        if ($.inArray(card._id, badCardList) == -1) {
          badCardList.push(card._id);
        }
      }
    })
  }



  for (i = 0; i < currentTagList.length; i++) {
    if (currentTagList[i].title == tagObj.title) {
      foundTag = true;
      currentTagList.splice(i, 1);
    }
  }

  if (!foundTag) {
    currentTagList.push(tagObj);
  }



  for (i = 0; i < currentTagList.length; i++) {
    console.log(currentTagList[i].title);
    handleOneTag(currentTagList[i]);
  }

  Session.set('badCardList', badCardList);
  Session.set('currentTagList', currentTagList);
}



Template.barHaut.events({
  'click ._tagItem': function(e, templ) {
    sessionAddOrRemoveTag(this);
  },
});

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

Template.card.hiddenCard = function() {
  var arr = Session.get('badCardList');
  if (!arr) {
    return '';
  }

  var found = ($.inArray(this._id, arr) != -1);
  console.log(found);

  if (found) {
    return 'hiddenCard';
  }
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
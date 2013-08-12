workspaceColl = new Meteor.Collection("workspaceColl");
cardColl = new Meteor.Collection("cardColl");

if (Meteor.isClient) {
  Template.workspaceList.workspaces = function() {
    return workspaceColl.find();
  };

  Template.workspaceList.events({
    'click ._newespacesave': function(e, templ) {
      var textInput = $(templ.find("._newespacename"));
      var newWorkspaceName = textInput.val();
      if (!newWorkspaceName) {
        return;
      }
      var toInsert = {
        name: newWorkspaceName
      };
      workspaceColl.insert(toInsert);
      textInput.val('');

    }

  });

  Template.workspace.events({
    'click ._workspaceItem': function(e, templ) {
      Session.set('workSpaceId', templ.data._id);
    }
  });

  Template.workspace.selected = function() {
    return Session.equals('workSpaceId', this._id) ? 'selected' : '';
  }

  Template.card.selected = function() {
    return Session.equals('cardId', this._id) ? 'selected' : '';
  }

  Template.contentCards.cards = function() {
    return cardColl.find({
      workspaceId: Session.get('workSpaceId')
    })
  }

function getCardId(){
  var cardId = Session.get('cardId');
  return cardId
}

  Template.cardDetails.card = function() {
    return cardColl.findOne({
      _id: getCardId()
    });
  }

  Template.cardDetails.events({
    'click ._btnsave': function(e, templ) {
      var cardId = getCardId();
      var data = {
        title: templ.find("._inputTitle").value,
        description: templ.find("._inputDescription").value,
        workspaceId: Session.get('workSpaceId')

      }
      cardColl.update(cardId, data);
    },
    'click ._btndelete': function(e, templ) {
      var cardId = getCardId();
      cardColl.remove({_id:cardId});
    }
  });



  Template.card.events({
    'click ._cardItem': function(e, templ) {
      Session.set('cardId', templ.data._id);
    },
  });

  Template.contentCards.events({
    'click ._newcardsave': function(e, templ) {
      var currentWorkspaceId = Session.get('workSpaceId');
      if (!currentWorkspaceId) {
        return;
      }
      var textInput = $(templ.find("._newcardtitle"));
      var newcardtitle = textInput.val();
      if (!newcardtitle) {
        return;
      }
      cardColl.insert({
        workspaceId: currentWorkspaceId,
        title: newcardtitle
      });
    },
  });
}
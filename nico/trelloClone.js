workspaceColl = new Meteor.Collection("workspaceColl");
cardColl = new Meteor.Collection("cardColl");

if (Meteor.isClient) {

  function selectCard(id){
    Session.set('cardId', templ.data._id);
  }

  function selectWorkspace(id){
      Session.set('cardId',null);
      Session.set('workspaceId',id);
  }

  function getCardId(){
    var cardId = Session.get('cardId');
    return cardId
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
    'click ._deletewWorkspace' : function(){
      workspaceColl.remove({_id:this._id});
      selectWorkspace(null);
    }
  });
  

  Template.barHaut.workspace = function() {
    return workspaceColl.findOne({
      _id: Session.get('workspaceId')
    });
  }

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
      var newWorkspaceId = workspaceColl.insert(toInsert);
      textInput.val('');
      Session.set('workspaceId',newWorkspaceId);
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

  Template.contentCards.cards = function() {
    return cardColl.find({
      workspaceId: Session.get('workspaceId')
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
      var data = {
        title: templ.find("._inputTitle").value,
        description: templ.find("._inputDescription").value,
        workspaceId: Session.get('workspaceId')

      }
      cardColl.update(cardId, data);
    },
    'click ._btndelete': function(e, templ) {
      var cardId = getCardId();
      cardColl.remove({
        _id: cardId
      });
    }
  });



  Template.card.events({
    'click ._cardItem': function(e, templ) {
      Session.set('cardId', templ.data._id);
    },
  });

  Template.contentCards.events({
    'click ._newcardsave': function(e, templ) {
      var currentWorkspaceId = Session.get('workspaceId');
      if (!currentWorkspaceId) {
        return;
      }
      var textInput = $(templ.find("._newcardtitle"));
      var newcardtitle = textInput.val();
      if (!newcardtitle) {
        return;
      }
      var newCardId = cardColl.insert({
        workspaceId: currentWorkspaceId,
        title: newcardtitle
      });
      selectedCard(newCardId);
    },
  });
}
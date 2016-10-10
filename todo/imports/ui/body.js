import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.js';

import './task.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks');
});

Template.body.helpers({

  tasks(){
    const instance = Template.instance();
    if ( instance.state.get('hideCompleted')) {
      return Tasks.find({ checked: {$ne:true}});
    }
    return Tasks.find({});
  },

  incompleteCount() {
    return Tasks.find({checked: {$ne: true} }).count();
  }

});

Template.body.events({
  'submit .new-task'(event){
    event.preventDefault();

    const text = event.target.text.value;
    //Tasks.insert({ text, createdAt: new Date(), owner: Meteor.userId(), username: Meteor.user().username});
    Meteor.call('tasks.insert', text);

    event.target.text.value = '';
  },

  'change .hide-completed'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  }

});

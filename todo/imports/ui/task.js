import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Tasks } from '../api/tasks.js';

import './task.html';

Template.task.helpers({
  isOwner() {
    return this.owner === Meteor.userId();
  }
})

Template.task.events({
  'click .toggle-checked'() {
    // Tasks.update(this._id, { $set: { checked: !this.checked } });
    Meteor.call('tasks.setChecked', this._id, !this.checked);
  },

  'click .delete'() {
    //Tasks.remove(this._id);
    Meteor.call('tasks.remove', this._id);
  },

});

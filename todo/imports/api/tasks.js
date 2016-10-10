import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  Meteor.publish('tasks', function tasksPublication(){
    return Tasks.find({
      $or: [
        { private: {$ne: true}},
        {owner: this.userId},
      ]
    });
  });
}

Meteor.methods({
  'tasks.insert'(text){
    check(text, String);
    if(!this.userId) {
      throw new Meteor.Error('not-authorised');
    }
    if(text){
      Tasks.insert({
        text,
        createdAt: new Date(),
        owner: this.userId,
        username: Meteor.users.findOne(this.userId).username
      });
    }
  },

  'tasks.setChecked'(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);

    Tasks.update(taskId, {$set: {checked: setChecked} });
    Tasks.update(taskId, {$set: {completedAt: new Date()} });
  },

  'tasks.remove'(taskId){
    check(taskId, String);

    const task = Tasks.findOne(taskId);
    if(task.private && task.owner !== this.userId){
      throw new Meteor.Error('not-authorised');
    }

    Tasks.remove(taskId);
  },

  'tasks.setPrivate'(taskId, setToPrivate){
    check(taskId, String);
    check(setToPrivate, Boolean);

    const task = Tasks.findOne(taskId);
    if(task.private && task.owner !== this.userId){
      throw new Meteor.Error('not-authorised');
    }

    Tasks.update(taskId, { $set: {private: setToPrivate} });
  }

});

'use strict';

module.exports = function(game, opts) {
  return new SprintPlugin(game, opts);
};
module.exports.pluginInfo = {
  loadAfter: ['voxel-keys'],
  clientOnly: true // TODO: server-side?
};

function SprintPlugin(game, opts) {
  this.game = game;
  this.keys = game.plugins.get('voxel-keys');
  if (!this.keys) throw new Error('voxel-sprint requires voxel-keys plugin');

  this.walkMaxSpeed = opts.walkMaxSpeed || 0.0056;
  this.runMaxSpeed = opts.runMaxSpeed || 0.0112;

  this.counter = 0;
  this.forwardUpAfterFirstDown = false;
  this.first = Date.now();
  this.sprinting = false;

  this.enable();
}

SprintPlugin.prototype.enable = function() {
  var self = this;

  self.keys.down.on('forward', self.onForwardDown = function() {
    // logic based on voxel-fly - TODO: refactor as general multi-keypress functionality?
    if (self.counter === 1) {
      if (Date.now() - self.first > 300) {
        self.forwardUpAfterFirstDown = true;
        self.first = Date.now();
        return;
      } else {
        if (self.forwardUpAfterFirstDown) {
          self.startSprint();
        }
      }

      self.forwardUpAfterFirstDown = false;
      self.counter = 0;
    } else if (self.counter === 0) {
      self.first = Date.now();
      self.counter += 1;
    }
  });

  self.keys.up.on('forward', self.onForwardUp = function() {
    if (self.sprinting) self.stopSprint();
  });
};

SprintPlugin.prototype.disable = function() {
  this.keys.down.removeListener('forward', this.onForwardDown);
  this.keys.up.removeListener('forward', this.onForwardUp);
};


SprintPlugin.prototype.startSprint = function() {
  this.game.controls.walk_max_speed = this.runMaxSpeed;
  this.sprinting = true;
};

SprintPlugin.prototype.stopSprint = function() {
  this.game.controls.walk_max_speed = this.walkMaxSpeed;
  this.sprinting = false;
};


'use strict';

module.exports = function(game, opts) {
  return new SprintPlugin(game, opts);
};
module.exports.pluginInfo = {
  clientOnly: true // TODO: server-side?
};

function SprintPlugin(game, opts) {
  this.game = game;

  if (!this.game.buttons.down) throw new Error('voxel-sprint requires game.buttons as kb-bindings');

  this.counter = 0;
  this.forwardUpAfterFirstDown = false;
  this.first = Date.now();

  this.enable();
}

SprintPlugin.prototype.enable = function() {
  var self = this;

  self.game.buttons.down.on('forward', self.onForwardDown = function() {
    console.log('forward',self.counter,self.forwardUpAfterFirstDown,self.first);
    // logic based on voxel-fly - TODO: refactor as general multi-keypress functionality?
    if (self.counter === 1) {
      if (Date.now() - self.first > 300) {
        self.forwardUpAfterFirstDown = true;
        self.first = Date.now();
        return;
      } else {
        if (self.forwardUpAfterFirstDown) {
          console.log('GO!');
          // TODO
        }
      }

      self.forwardUpAfterFirstDown = false;
      self.counter = 0;
    } else if (self.counter === 0) {
      self.first = Date.now();
      self.counter += 1;
    }
  });
};

SprintPlugin.prototype.disable = function() {
  this.game.buttons.down.removeListener('forward', this.onForwardDown);
};



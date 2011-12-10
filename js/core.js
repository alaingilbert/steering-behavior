/**
 * Copyright 2011,2012 Alain Gilbert <alain.gilbert.15@gmail.com>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

function $(id) { return document.getElementById(id); }

var Game = {
   canvas:    null,
   ctx:       null,
   interval:  null,
   opt:       1,
   lastFrame: new Date().getTime(),
   fps:       60,
   objs:      [],

   States:    { simple: 0 },
   state:     0,
   swState:   function (state) {
      if (state in this.States) { return States[state]; }
      return 0;
   },

   rand: function rand(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
   },

   init: function () {
      var self      = this;
      this.canvas   = $('canvas');
      this.ctx      = this.canvas.getContext('2d');
      for (var i=0; i<10; i++) {
         this.objs.push(new Agent({ x: this.rand(40, this.canvas.width-40), y: this.rand(40, this.canvas.height-40) }));
      }
      this.interval = setInterval(function () { self.cycle(); }, 1000/this.fps);
   },

   cycle: function () {
      var self = this;
      this.update();
      this.paint();

      var c = this.ctx;
      var time = (new Date().getTime() - this.lastFrame);
      c.save();
      c.font = '20px sans-serif';
      c.textBaseline = 'top';
      c.fillText('FPS:'+Math.round(1000/time), 10, 10);
      c.fillText('Objects:'+this.objs.length, 10, 30);
      c.restore();

      if (this.spawn) {
         this.spawnObjs();
      } else if (this.rem) {
         this.remObjs();
      }

      if (this.auto) {
         if (1000/time >= this.fps) {
            this.spawnObjs(true);
         } else if (1000/time <= this.fps-10) {
            this.remObjs();
         }
      }

      this.lastFrame = new Date().getTime();
   },

   update: function () {
      for (var i=0; i<this.objs.length; i++) {
         this.objs[i].update();
      }
   },

   paint: function () {
      var c = this.ctx;
      c.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (var i=0; i<this.objs.length; i++) {
         this.objs[i].paint();
      }

      c.strokeRect(0, 0, this.canvas.width, this.canvas.height);
   },

   spawnObjs: function (rnd) {
      pos = rnd ? { x: this.rand(40, this.canvas.width-40), y: this.rand(40, this.canvas.height-40) } : this.mouse;
      this.objs.push(new Agent(pos));
   },

   remObjs: function () {
      if (this.objs.length > 10) {
         this.objs.splice(0, 1);
      }
   }

};

document.addEventListener('DOMContentLoaded', function () {
   Game.init();
   Game.canvas.addEventListener('mousemove', function (evt) {
      Game.mouse = { x: evt.clientX-Game.canvas.offsetLeft, y: evt.clientY-Game.canvas.offsetTop };
   }, false);
   Game.canvas.addEventListener('mousedown', function (evt) {
      if (evt.metaKey) { Game.rem   = true; }
      else             { Game.spawn = true; }
   }, false);
   document.addEventListener('mouseup', function (evt) {
      Game.rem   = false;
      Game.spawn = false;
   }, false);
   $('ckbAuto').onclick = function (evt) {
      if ($('ckbAuto').checked) {
         Game.auto = true;
      } else {
         Game.auto = false;
      }
   };

   $('opt1').onclick = function (evt) {
      Game.opt = 1;
   };
   $('opt2').onclick = function (evt) {
      Game.opt = 2;
   };
});

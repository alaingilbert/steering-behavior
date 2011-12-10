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

var Agent = function (pos) {
   var pos    = pos || {};
   this.p     = $V([ pos.x || 0, pos.y || 0 ]);
   this.f     = $V([ 1, 0 ]);
   this.a     = 0;
   this.v     = $V([ 0, 0 ]);
   this.r     = 10;
   this.s     = 0;
   this.m     = 1;
   this.max   = 100;
   this.color = '#c0c0c0';

   this.update = function () {
      var deltaTime = (new Date().getTime() - Game.lastFrame) / 1000;
      this.s = this.v.modulus();

      this.f = $V([ 0, 0 ]);

      if (this.p.e(1) + 2*this.r > Game.canvas.width)  {
         if (this.v.e(1) > 0) {
            this.v.setElements([ -this.v.e(1), this.v.e(2) ]);
         }
      }
      if (this.p.e(2) + 2*this.r > Game.canvas.height) {
         if (this.v.e(2) > 0) {
            this.v.setElements([ this.v.e(1), -this.v.e(2) ]);
         }
      }
      if (this.p.e(1) - 2*this.r < 0) {
         if (this.v.e(1) < 0) {
            this.v.setElements([ -this.v.e(1), this.v.e(2) ]);
         }
      }
      if (this.p.e(2) - 2*this.r < 0) {
         if (this.v.e(2) < 0) {
            this.v.setElements([ this.v.e(1), -this.v.e(2) ]);
         }
      }

      var hadToSubtract = false;
      var contact = false;
      this.color = '#c0c0c0';
      for (var i=0; i<Game.objs.length; i++) {
         var obj = Game.objs[i];
         if (obj == this) { continue; }
         
         if (!contact && this.p.distanceFrom(obj.p) < this.r * 2) {
            contact = true;
            this.color = '#fd6562';
         }

         if (this.p.distanceFrom(obj.p) < this.r * 3) {
            this.f = this.f.add( this.p.subtract(obj.p) );
            hadToSubtract = true;
         }
      }
      if (!hadToSubtract) {
         var near = 999999999999;
         var no = null;
         var tmp1 = null;
         for (var i=0; i<Game.objs.length; i++) {
            var obj = Game.objs[i];
            if (obj == this) { continue; }
            var tmp = this.p.distanceFrom(obj.p);
            if (tmp < near) {
               near = tmp;
               no = obj;
            }
            if (Game.opt == 2) {
               if (!tmp1) {
                  tmp1 = obj.p.subtract(this.p);
               } else {
                  tmp1 = tmp1.add(obj.p.subtract(this.p));
               }
            }
         }

         if (Game.opt == 1) {
            this.f = no.p.subtract(this.p).toUnitVector().x(1);
         } else if (Game.opt == 2) {
            this.f = tmp1.toUnitVector().x(1);
         }
      }


      this.a = this.f.x( 1/this.m );
      this.v = this.v.add( this.a );
      if (this.v.modulus() > this.max) {
         this.v = this.v.toUnitVector();
         this.v = this.v.x( this.max );
         this.s = this.max;
      } else {
         this.s = this.v.modulus();
      }
      var tmp = this.v.x( deltaTime ).add( this.a.x( 0.5 * deltaTime * deltaTime ) );
      this.p = this.p.add( tmp );
   },

   this.paint = function () {
      var c = Game.ctx;
      c.save();
      c.fillStyle   = this.color;
      c.strokeStyle = '#555';
      c.beginPath();
      c.arc(this.p.e(1), this.p.e(2), this.r, 0, 2*Math.PI);
      c.closePath();
      c.stroke();
      c.fill();
      c.restore();
   }
};

// uses sylvester and Underscore
var Strokes = (function () {
  return {
    sim: function(fst, snd) {
      if (fst.length === snd.length) {
        return _(_.zip(fst, snd)).all(function (vs) {
          v = vs[0]; w = vs[1];
          return v.distanceFrom(w) === 0;
        });      
      }
      else {
        return false;
      }
    },
    unduplicate: function(stroke) {
      var res = _.first(stroke, 1);
      _(_.rest(stroke)).each(function(v) {
        if (v.distanceFrom(_.last(res)) !== 0) {
          res.push(v);
        }
      });
      return res;
    },
    smooth: function(stroke) {
      var res = _.first(stroke, 1);
      while (stroke.length > 2) {
        var last = stroke[0];
        var current = stroke[1];
        var next = stroke[2];
        stroke = _.rest(stroke);
        res.push(last.add(current).add(next).x(1.0/3.0));
      }
      return res.concat(_.rest(stroke));
    },
    redistribute: function(stroke, length) {
      // var res = _.first(stroke, 1);
      // var current = _.first(stroke);
      // stroke = _.rest(stroke);
      // while (stroke.length > 1) {
      //   var last = _.last(res);
      //   var next = _.first(stroke);
      //   stroke = _.rest(stroke);
      // }
      // return res.concat(_.rest(stroke));
      return stroke;
    },
    // returns a Matrix where the cols are bottom-left and top-right
    boundingbox: function(stroke) {
      var l = _(stroke).first().e(1);
      var b = _(stroke).first().e(2);
      var r = _(stroke).first().e(1);
      var t = _(stroke).first().e(2);
      var lbrt = _(stroke).chain().rest().reduce(function(lbrt, v) {
        var l = v.e(1);
        var b = v.e(2);
        var r = v.e(1);
        var t = v.e(2);
        var lMin = lbrt[0];
        var bMin = lbrt[1];
        var rMax = lbrt[2];
        var tMax = lbrt[3];
        return [Math.min(l, lMin), Math.min(b, bMin), Math.max(r, rMax), Math.max(t, tMax)];
      }, [l,b,r,t]).value();
      var lMin = lbrt[0];
      var bMin = lbrt[1];
      var rMax = lbrt[2];
      var tMax = lbrt[3];
      return $M([[lbrt[0], lbrt[2]], [lbrt[1], lbrt[3]]]);
    }
  };
})();
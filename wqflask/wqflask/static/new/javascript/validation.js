// Generated by CoffeeScript 1.3.3
(function() {

  $(function() {
    var remove_samples_is_valid, validate_remove_samples;
    remove_samples_is_valid = function(input) {
      var new_splats, pattern, splat, splats, _i, _len;
      if (_.trim(input).length === 0) {
        return true;
      }
      splats = input.split(",");
      new_splats = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = splats.length; _i < _len; _i++) {
          input = splats[_i];
          _results.push(_.trim(input));
        }
        return _results;
      })();
      console.log("new_splats:", new_splats);
      pattern = /^\d+\s*(?:-\s*\d+)?\s*$/;
      for (_i = 0, _len = new_splats.length; _i < _len; _i++) {
        splat = new_splats[_i];
        console.log("splat is:", splat);
        if (!splat.match(pattern)) {
          return false;
        }
      }
      return true;
    };
    validate_remove_samples = function() {
      /*
              Check if input for the remove samples function is valid and notify the user if not
      */

      var input;
      input = $('#remove_samples_field').val();
      console.log("input is:", input);
      if (remove_samples_is_valid(input)) {
        console.log("input is valid");
        return $('#remove_samples_invalid').hide();
      } else {
        console.log("input isn't valid");
        return $('#remove_samples_invalid').show();
      }
    };
    return $('#remove_samples_field').change(validate_remove_samples);
  });

}).call(this);

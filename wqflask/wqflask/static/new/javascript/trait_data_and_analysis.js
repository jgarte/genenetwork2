// Generated by CoffeeScript 1.3.3
(function() {
  var is_number,
    __slice = [].slice;

  console.log("start_b");

  is_number = function(o) {
    return !isNaN((o - 0) && o !== null);
  };

  $(function() {
    var edit_data_change, hide_tabs, make_table, process_id, stats_mdp_change, update_stat_values;
    hide_tabs = function(start) {
      var x, _i, _results;
      _results = [];
      for (x = _i = start; start <= 10 ? _i <= 10 : _i >= 10; x = start <= 10 ? ++_i : --_i) {
        _results.push($("#stats_tabs" + x).hide());
      }
      return _results;
    };
    hide_tabs(1);
    stats_mdp_change = function() {
      var selected;
      selected = $(this).val();
      hide_tabs(0);
      return $("#stats_tabs" + selected).show();
    };
    $(".stats_mdp").change(stats_mdp_change);
    update_stat_values = function(the_values) {
      var category, current_mean, current_n_of_samples, id, in_box, n_of_samples, the_mean, total, value, _i, _j, _len, _len1, _ref, _ref1, _results;
      _ref = ['primary', 'other', 'all'];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        category = _ref[_i];
        id = "#" + process_id(category, "mean");
        console.log("id:", id);
        total = 0;
        _ref1 = the_values[category];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          value = _ref1[_j];
          total += value;
        }
        the_mean = total / the_values[category].length;
        the_mean = the_mean.toFixed(2);
        console.log("aaa");
        in_box = $(id).html;
        console.log("in_box:", in_box);
        current_mean = parseFloat($(in_box)).toFixed(2);
        console.log("the_mean:", the_mean);
        console.log("current_mean:", current_mean);
        console.log("aab");
        if (the_mean !== current_mean) {
          console.log("setting mean");
          $(id).html(the_mean).effect("highlight");
          console.log("should be set");
        }
        n_of_samples = the_values[category].length;
        id = "#" + process_id(category, "n_of_samples");
        console.log("n_of_samples id:", id);
        current_n_of_samples = $(id).html();
        console.log("cnos:", current_n_of_samples);
        console.log("n_of_samples:", n_of_samples);
        if (n_of_samples !== current_n_of_samples) {
          _results.push($(id).html(n_of_samples).effect("highlight"));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    edit_data_change = function() {
      var category, checkbox, checked, real_value, row, the_values, value, values, _i, _len;
      the_values = {
        primary: [],
        other: [],
        all: []
      };
      console.log("at beginning:", the_values);
      values = $('#value_table').find(".edit_strain_value");
      for (_i = 0, _len = values.length; _i < _len; _i++) {
        value = values[_i];
        real_value = $(value).val();
        row = $(value).closest("tr");
        console.log("row is:", row);
        console.log("row[0].id is:", row[0].id);
        category = row[0].id;
        checkbox = $(row).find(".edit_strain_checkbox");
        checked = $(checkbox).attr('checked');
        if (!checked) {
          console.log("Not checked");
          continue;
        }
        if (is_number(real_value) && real_value !== "") {
          real_value = parseFloat(real_value);
          if (_(category).startsWith("Primary")) {
            the_values.primary.push(real_value);
          } else if (_(category).startsWith("Other")) {
            the_values.other.push(real_value);
          }
          the_values.all.push(real_value);
        }
      }
      console.log("torwads end:", the_values);
      return update_stat_values(the_values);
    };
    make_table = function() {
      var column, header, row, row_line, rows, table, the_id, the_rows, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
      header = "<thead><tr><th>&nbsp;</th>";
      _ref = basic_table['columns'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        column = _ref[_i];
        console.log("column:", column);
        the_id = process_id("column", column.t);
        header += "<th id=\"" + the_id + "\">" + column.n + "</th>";
      }
      header += "</thead>";
      rows = [
        {
          vn: "n_of_samples",
          pretty: "N of Samples"
        }, {
          vn: "mean",
          pretty: "Mean"
        }, {
          vn: "median",
          pretty: "Median"
        }, {
          vn: "se",
          pretty: "Standard Error (SE)"
        }
      ];
      console.log("rows are:", rows);
      the_rows = "<tbody>";
      console.log("length of rows:", rows.length);
      for (_j = 0, _len1 = rows.length; _j < _len1; _j++) {
        row = rows[_j];
        console.log("rowing");
        row_line = "<tr>";
        row_line += "<td id=\"" + row.vn + "\">" + row.pretty + "</td>";
        _ref1 = basic_table['columns'];
        for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
          column = _ref1[_k];
          console.log("apple:", column);
          the_id = process_id(column.t, row.vn);
          console.log("the_id:", the_id);
          row_line += "<td id=\"" + the_id + "\">foo</td>";
        }
        row_line += "</tr>";
        console.log("row line:", row_line);
        the_rows += row_line;
      }
      the_rows += "</tbody>";
      table = header + the_rows;
      console.log("table is:", table);
      return $("#stats_table").append(table);
    };
    process_id = function() {
      var processed, value, values, _i, _len;
      values = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      /* Make an id or a class valid javascript by, for example, eliminating spaces
      */

      processed = "";
      for (_i = 0, _len = values.length; _i < _len; _i++) {
        value = values[_i];
        console.log("value:", value);
        value = value.replace(" ", "_");
        if (processed.length) {
          processed += "-";
        }
        processed += value;
      }
      return processed;
    };
    _.mixin(_.str.exports());
    $('#value_table').change(edit_data_change);
    console.log("loaded");
    console.log("basic_table is:", basic_table);
    make_table();
    edit_data_change();
    return console.log("end");
  });

}).call(this);

var block_outliers, composite_mapping_fields, do_ajax_post, get_progress, mapping_method_fields, open_mapping_results, outlier_text, showalert, submit_special, toggle_enable_disable, update_time_remaining;

update_time_remaining = function(percent_complete) {
  var minutes_remaining, now, period, total_seconds_remaining;
  now = new Date();
  period = now.getTime() - root.start_time;
  console.log("period is:", period);
  if (period > 8000) {
    total_seconds_remaining = (period / percent_complete * (100 - percent_complete)) / 1000;
    minutes_remaining = Math.round(total_seconds_remaining / 60);
    if (minutes_remaining < 3) {
      return $('#time_remaining').text(Math.round(total_seconds_remaining) + " seconds remaining");
    } else {
      return $('#time_remaining').text(minutes_remaining + " minutes remaining");
    }
  }
};

get_progress = function() {
  var params, params_str, temp_uuid, url;
  console.log("temp_uuid:", $("#temp_uuid").val());
  temp_uuid = $("#temp_uuid").val();
  params = {
    key: temp_uuid
  };
  params_str = $.param(params);
  url = "/get_temp_data?" + params_str;
  console.log("url:", url);
  $.ajax({
    type: "GET",
    url: url,
    success: (function(_this) {
      return function(progress_data) {
        var percent_complete;
        percent_complete = progress_data['percent_complete'];
        console.log("in get_progress data:", progress_data);
        $('#marker_regression_progress').css("width", percent_complete + "%");
        if (root.start_time) {
          if (!isNaN(percent_complete)) {
            return update_time_remaining(percent_complete);
          }
        } else {
          return root.start_time = new Date().getTime();
        }
      };
    })(this)
  });
  return false;
};

block_outliers = function() {
  return $('.outlier').each((function(_this) {
    return function(_index, element) {
      return $(element).find('.trait_value_input').val('x');
    };
  })(this));
};

do_ajax_post = function(url, form_data) {
  $.ajax({
    type: "POST",
    url: url,
    data: form_data,
    error: (function(_this) {
      return function(xhr, ajaxOptions, thrownError) {
        alert("Sorry, an error occurred");
        console.log(xhr);
        clearInterval(_this.my_timer);
        $('#progress_bar_container').modal('hide');
        $('#static_progress_bar_container').modal('hide');
        return $("body").html("We got an error.");
      };
    })(this),
    success: (function(_this) {
      return function(data) {
        clearInterval(_this.my_timer);
        $('#progress_bar_container').modal('hide');
        $('#static_progress_bar_container').modal('hide');
        return open_mapping_results(data);
      };
    })(this)
  });
  console.log("settingInterval");
  this.my_timer = setInterval(get_progress, 1000);
  return false;
};

open_mapping_results = function(data) {
  return $.colorbox({
    html: data,
    href: "#mapping_results_holder",
    height: "90%",
    width: "90%",
    onComplete: (function(_this) {
      return function() {
        var filename, getSvgXml;
        root.create_lod_chart();
        filename = "lod_chart_" + js_data.this_trait;
        getSvgXml = function() {
          var svg;
          svg = $("#topchart").find("svg")[0];
          return (new XMLSerializer).serializeToString(svg);
        };
        $("#exportform > #export").click(function() {
          var form, svg_xml;
          svg_xml = getSvgXml();
          form = $("#exportform");
          form.find("#data").val(svg_xml);
          form.find("#filename").val(filename);
          return form.submit();
        });
        return $("#exportpdfform > #export_pdf").click(function() {
          var form, svg_xml;
          svg_xml = getSvgXml();
          form = $("#exportpdfform");
          form.find("#data").val(svg_xml);
          form.find("#filename").val(filename);
          return form.submit();
        });
      };
    })(this)
  });
};

outlier_text = "One or more outliers exist in this data set. Please review values before mapping. Including outliers when mapping may lead to misleading results.";
showalert = function(message, alerttype) {
  return $('#outlier_alert_placeholder').append('<div id="mapping_alert" class="alert ' + alerttype + '"><a class="close" data-dismiss="alert">�</a><span>' + message + '</span></div>');
};

$('#suggestive').hide();

$('input[name=display_all]').change((function(_this) {
  return function() {
    console.log("check");
    if ($('input[name=display_all]:checked').val() === "False") {
      return $('#suggestive').show();
    } else {
      return $('#suggestive').hide();
    }
  };
})(this));

//ZS: This is a list of inputs to be passed to the loading page, since not all inputs on the trait page are relevant to mapping
var mapping_input_list = ['temp_uuid', 'trait_id', 'dataset', 'tool_used', 'form_url', 'method', 'transform', 'trimmed_markers', 'selected_chr', 'chromosomes', 'mapping_scale',
                          'sample_vals', 'vals_hash', 'score_type', 'suggestive', 'significant', 'num_perm', 'permCheck', 'perm_output', 'perm_strata', 'categorical_vars',
                          'num_bootstrap', 'bootCheck', 'bootstrap_results', 'LRSCheck', 'covariates', 'maf', 'use_loco', 'manhattan_plot', 'control_marker',
                          'do_control', 'genofile', 'pair_scan', 'startMb', 'endMb', 'graphWidth', 'lrsMax', 'additiveCheck', 'showSNP', 'showGenes', 'viewLegend',
                          'haplotypeAnalystCheck', 'mapmethod_rqtl_geno', 'mapmodel_rqtl_geno', 'temp_trait', 'group', 'species', 'primary_samples']

$(".rqtl-geno-tab, #rqtl_geno_compute").on("click", (function(_this) {
  return function() {
    if ($(this).hasClass('active') || $(this).attr('id') == "rqtl_geno_compute"){
      var form_data, url;
      url = "/loading";
      $('input[name=method]').val("rqtl_geno");
      $('input[name=selected_chr]').val($('#chr_rqtl_geno').val());
      $('input[name=mapping_scale]').val($('#scale_rqtl_geno').val());
      $('input[name=genofile]').val($('#genofile_rqtl_geno').val());
      $('input[name=num_perm]').val($('input[name=num_perm_rqtl_geno]').val());
      $('input[name=categorical_vars]').val(js_data.categorical_vars)
      $('input[name=manhattan_plot]').val($('input[name=manhattan_plot_rqtl]:checked').val());
      $('input[name=control_marker]').val($('input[name=control_rqtl_geno]').val());
      $('input[name=do_control]').val($('input[name=do_control_rqtl]:checked').val());
      $('input[name=tool_used]').val("Mapping");
      $('input[name=form_url]').val("/run_mapping");
      $('input[name=wanted_inputs]').val(mapping_input_list.join(","));
      return submit_special(url);
    } else {
      return true
    }
  };
})(this));

$(".gemma-tab, #gemma_compute").on("click", (function(_this) {
  return function() {
    if ($(this).hasClass('active') || $(this).attr('id') == "gemma_compute"){
      var form_data, url;
      url = "/loading";
      $('input[name=method]').val("gemma");
      $('input[name=selected_chr]').val($('#chr_gemma').val());
      $('input[name=num_perm]').val(0);
      $('input[name=genofile]').val($('#genofile_gemma').val());
      $('input[name=maf]').val($('input[name=maf_gemma]').val());
      $('input[name=tool_used]').val("Mapping");
      $('input[name=form_url]').val("/run_mapping");
      $('input[name=wanted_inputs]').val(mapping_input_list.join(","));
      return submit_special(url);
    } else {
      return true
    }
  };
})(this));

$(".reaper-tab, #interval_mapping_compute").on("click", (function(_this) {
  return function() {
    if ($(this).hasClass('active') || $(this).attr('id') == "interval_mapping_compute"){
      var form_data, url;
      console.log("In interval mapping");
      url = "/loading";
      $('input[name=method]').val("reaper");
      $('input[name=selected_chr]').val($('#chr_reaper').val());
      $('input[name=mapping_scale]').val($('#scale_reaper').val());
      $('input[name=genofile]').val($('#genofile_reaper').val());
      $('input[name=num_perm]').val($('input[name=num_perm_reaper]').val());
      $('input[name=control_marker]').val($('input[name=control_reaper]').val());
      $('input[name=do_control]').val($('input[name=do_control_reaper]:checked').val());
      $('input[name=manhattan_plot]').val($('input[name=manhattan_plot_reaper]:checked').val());
      $('input[name=mapping_display_all]').val($('input[name=display_all_reaper]'));
      $('input[name=suggestive]').val($('input[name=suggestive_reaper]'));
      $('input[name=tool_used]').val("Mapping");
      $('input[name=form_url]').val("/run_mapping");
      $('input[name=wanted_inputs]').val(mapping_input_list.join(","));
      return submit_special(url);
    } else {
      return true
    }
  };
})(this));

$("#interval_mapping_compute, #gemma_compute, rqtl_geno_compute").on("mouseover", (function(_this) {
  return function() {
    if ($(".outlier").length && $(".outlier-alert").length < 1) {
      return showalert(outlier_text, "alert-success outlier-alert");
    }
  };
})(this));

composite_mapping_fields = function() {
  return $(".composite_fields").toggle();
};

mapping_method_fields = function() {
  return $(".mapping_method_fields").toggle();
};

$("#use_composite_choice").change(composite_mapping_fields);

$("#mapping_method_choice").change(mapping_method_fields);

$("#mapmodel_rqtl_geno").change(function() {
  if ($(this).val() == "np"){
    $("#mapmethod_rqtl_geno").attr('disabled', 'disabled');
    $("#mapmethod_rqtl_geno").css('background-color', '#CCC');
    $("#missing_geno").attr('disabled', 'disabled');
    $("#missing_geno").css('background-color', '#CCC');
  } else {
    $("#mapmethod_rqtl_geno").removeAttr('disabled');
    $("#mapmethod_rqtl_geno").css('background-color', '#FFF');
    $("#missing_geno").removeAttr('disabled');
    $("#missing_geno").css('background-color', '#FFF');
  }
});

$("#mapmethod_rqtl_geno").change(function() {
  if ($(this).val() == "mr"){
    $("#missing_geno_div").css('display', 'block');
  } else {
    $("#missing_geno_div").css('display', 'none');
  }
});

$("li.mapping-tab").click(function() {
  if ($(this).hasClass("rqtl")){
    $(".rqtl_description").css("display", "block");
  } else {
    $(".rqtl_description").css("display", "none");
  }
});

toggle_enable_disable = function(elem) {
  return $(elem).prop("disabled", !$(elem).prop("disabled"));
};

$("#choose_closet_control").change(function() {
  return toggle_enable_disable("#control_locus");
});

$("#display_all_lrs").change(function() {
  return toggle_enable_disable("#suggestive_lrs");
});

$('#genofile_rqtl_geno').change(function() {
  geno_location = $(this).children("option:selected").val().split(":")[0]
  $('#scale_rqtl_geno').empty()
  the_scales = js_data.scales_in_geno[geno_location]
  for (var i = 0; i < the_scales.length; i++){
    $('#scale_rqtl_geno').append($("<option></option>").attr("value", the_scales[i][0]).text(the_scales[i][1]));
  }
});
$('#genofile_reaper').change(function() {
  geno_location = $(this).children("option:selected").val().split(":")[0]
  $('#scale_reaper').empty()
  the_scales = js_data.scales_in_geno[geno_location]
  for (var i = 0; i < the_scales.length; i++){
    $('#scale_reaper').append($("<option></option>").attr("value", the_scales[i][0]).text(the_scales[i][1]));
  }
});

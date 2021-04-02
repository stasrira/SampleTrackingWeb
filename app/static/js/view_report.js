$(document).ready(function() {

    $('#select_report').on('change', function () {
        //alert(this.value);
        $.post("/get_report_filters",
        {
            report_id: this.value,
            cur_program_id: $('#program_id').val() ? $('#program_id').val() : ""
        },
        function(data,status){
          if (status == 'success'){
                //save study_id and associated program ids for the currenlty selected study id dropdown
                current_study_id = $('#study_id option:selected').val();
                current_study_program_id = $('#study_id option:selected').attr("program_id");

                //refresh filter's div with the received data
                $('#filters').html(data);
                $('#filters').show();
                on_program_change(); //register event
                validate_studies($('#program_id').val()); //run this function for first time on loading

                //check if previously selected study_id can be selected again
                if (current_study_program_id = $('#program_id').val()) {
                  //if current study_id item belongs to the currently selected program_id
                  if ($('#study_id option[value = ' + current_study_id + ']').css('display') != 'none'){
                      //if the option being selected is visible
                    $('#study_id option[value = ' + current_study_id + ']').prop('selected', true);
                  }
                }
          }
        });
    });

    //declare onChange event for program_id control
    var on_program_change = function() {
        $('#program_id').on('change', function () {
            validate_studies(this.value);
        });
    }

    var validate_studies = function(cur_prg_id){
        $("[program_id]").show(); //make all items visible
        $("[program_id]").not("[program_id="+ cur_prg_id + "]").hide(); //hide items with not matching program_id
        $('#study_id').val(''); //clear the current value
    }
} );
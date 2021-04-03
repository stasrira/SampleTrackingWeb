$(document).ready(function() {

    $('#select_report').on('change', function () {
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
                on_program_change(); //register program id control event
                on_filter_change(); //register filter change event

                $('#study_id').multiselect({
                    buttonWidth: '100%',
                    includeResetOption: true,
                    resetText: "Clear all selected options",
                });
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
    var on_filter_change = function() {
        $("#filters :input").on('change', function () {
            //$("#program_id").on('change', function () {
            var loading = '<div style="width=100%; height: 100px; background-color: red; horiz-align: left; color: darkgray"><h2>Loading...</h2></div>';
            $('#div_report').html(loading);
            //$('#div_report').hide();
            // alert('test');
            $.post("/get_report_data",
                {
                    report_id: $('#select_report').val() ? $('#select_report').val() : "",
                    program_id: $('#program_id').val() ? $('#program_id').val() : "",
                    study_id: $('#study_id').val() ? $('#study_id').val() : "",
                    aliquot_ids: $('#aliquot_ids').val() ? $('#aliquot_ids').val() : "",
                    date_from: $('#date_from').val() ? $('#date_from').val() : "",
                    date_to: $('#date_to').val() ? $('#date_to').val() : "",
                    pivot_by: $('#pivot_by').val() ? $('#pivot_by').val() : "",
                },
                function (data, status) {
                    $('#div_report').html(data);
                    $('#div_report').show();
                    var mytable = data_table();
                    mytable.buttons()
                        .container()
                        .appendTo( '#report_wrapper .col-md-6:eq(0)' );
                });
        });
    }

    //declare onChange event for program_id control
    var on_program_change = function() {
        $('#program_id').on('change', function () {
            validate_studies(this.value);
        });
    }

    var validate_studies = function(cur_prg_id){
        // $("[program_id]").show(); //make all items visible
        $(".multiselect-container > button.disabled").show();
        $("[program_id]").removeAttr("disabled");
        //$("[program_id]").not("[program_id="+ cur_prg_id + "]").hide(); //hide items with not matching program_id
        $("[program_id]").not("[program_id="+ cur_prg_id + "]").attr("disabled", true);
        $('#study_id').val(''); //clear the current value
        $('#study_id').multiselect('refresh');
        $(".multiselect-container > button.disabled").hide();
    }

    var data_table = function() {
        return $('#report').DataTable({
            dom: "<'row'<'col-sm-12 col-md-1'l><'col-sm-12 col-md-1'><'col-sm-12 col-md-3'B><'col-sm-12 col-md-1'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
            buttons: [
                'copyHtml5', 'csvHtml5', 'colvis'
            ],
            "pageLength": 25,
            initComplete: function () {
                // Apply the search
                var table = this; //reference to the DataTable
                //setup events handler for all controls with "data-column-name" attribute name
                $("[data-column-name]").on( 'keyup change clear', function() {
                    //console.log($(this).attr("data-column-name") + " : " + $(this).val());
                    //console.log(table.api().columns());
                    table.api()
                        .columns($(this).attr("data-column-id"))
                        .search( $(this).val())
                        .draw();
                });

            }
        });
    }
} );
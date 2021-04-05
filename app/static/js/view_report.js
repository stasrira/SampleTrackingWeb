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
                // on_filter_change(); //register filter change event
                on_run_report(); //register Run Report button click

                $('#study_id').multiselect({
                    buttonWidth: '100%',
                    maxHeight: 250,
                    includeResetOption: true,
                    includeResetDivider: true,
                    numberDisplayed: 2,
                    resetText: "Clear all selected options",
                    enableFiltering: true,
                    enableCaseInsensitiveFiltering: true,
                    includeFilterClearBtn: true,
                    // includeSelectAllOption: true,
                    nonSelectedText: 'Please Choose... ',
                    selectedClass: 'active multiselect-selected'
                    // onDeselectAll: function() {
                    //     alert('onDeselectAll triggered!');
                    // },
                    // onChange: function(element, checked) {
                    //     if (checked === true) {
                    //         console.debug('checked => ' + element.value);
                    //     } else if (checked === false) {
                    //         console.debug('un-checked => ' + element.value);
                    //     }
                    // }
                });

                $("#study_id + div").css("height","100%");

                 // initilalite datepicker plugin
                init_datepicker();
                // });

                //hides/shows studies based on the selected program id
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

    var init_datepicker = function (){
          // if desktop device, use DateTimePicker
          $("[datepicker]").datetimepicker({
            useCurrent: false,
            format: "L",
            showTodayButton: true,
            icons: {
              next: "fa fa-chevron-right",
              previous: "fa fa-chevron-left",
              today: "todayText"
            }
          });
          // $("#timepicker").datetimepicker({
          //   format: "LT",
          //   icons: {
          //     up: "fa fa-chevron-up",
          //     down: "fa fa-chevron-down"
          //   }
          // });
    }

    //declare onChange event for any filter change
    var on_filter_change = function() {
        $("#filters :input").on('change', function () {
            //$("#program_id").on('change', function () {
            $('#div_report').hide();
            $('#loader').show();
            //$('#div_report').hide();
            //alert($('#study_id option:selected')); //$('#study_id')
            var sel_studies_arr = [];
            var sel_studies = '';
            var i;

            // $('#study_id option:selected').each(function() {
            //     sel_studies = sel_studies + (',' + this.value ? sel_studies : this.value)
            // })

            if ($('#study_id option:selected')) {
                for (i = 0; i < $('#study_id option:selected').length; i++) {
                    sel_studies_arr[i] = $('#study_id option:selected')[i].value;
                }
                sel_studies = sel_studies_arr.join();
            }
            console.log('Selected studies-> ' + sel_studies);

            $.post("/get_report_data",
                {
                    report_id: $('#select_report').val() ? $('#select_report').val() : "",
                    program_id: $('#program_id').val() ? $('#program_id').val() : "",
                    //study_id: $('#study_id').val() ? $('#study_id').val() : "",
                    study_id: sel_studies,
                    aliquot_ids: $('#aliquot_ids').val() ? $('#aliquot_ids').val() : "",
                    date_from: $('#date_from').val() ? $('#date_from').val() : "",
                    date_to: $('#date_to').val() ? $('#date_to').val() : "",
                    pivot_by: $('#pivot_by').val() ? $('#pivot_by').val() : "",
                },
                function (data, status) {
                    $('#loader').hide();
                    $('#div_report').html(data);
                    $('#div_report').show();
                    var mytable = data_table();
                    mytable.buttons()
                        .container()
                        .appendTo( '#report_wrapper .col-md-6:eq(0)' );
                });
        });
    }

    //declare onChange event for any filter change
    var on_run_report = function() {
        $("#run_report").click(function () {
            //$("#program_id").on('change', function () {
            $('#div_report').hide();
            $('#loader').show();
            //$('#div_report').hide();
            //alert($('#study_id option:selected')); //$('#study_id')
            var sel_studies_arr = [];
            var sel_studies = '';
            var i;

            // $('#study_id option:selected').each(function() {
            //     sel_studies = sel_studies + (',' + this.value ? sel_studies : this.value)
            // })

            if ($('#study_id option:selected')) {
                for (i = 0; i < $('#study_id option:selected').length; i++) {
                    sel_studies_arr[i] = $('#study_id option:selected')[i].value;
                }
                sel_studies = sel_studies_arr.join();
            }
            console.log('Selected studies-> ' + sel_studies);

            $.post("/get_report_data",
                {
                    report_id: $('#select_report').val() ? $('#select_report').val() : "",
                    program_id: $('#program_id').val() ? $('#program_id').val() : "",
                    //study_id: $('#study_id').val() ? $('#study_id').val() : "",
                    study_id: sel_studies,
                    aliquot_ids: $('#aliquot_ids').val() ? $('#aliquot_ids').val() : "",
                    date_from: $('#date_from').val() ? $('#date_from').val() : "",
                    date_to: $('#date_to').val() ? $('#date_to').val() : "",
                    pivot_by: $('#pivot_by').val() ? $('#pivot_by').val() : "",
                },
                function (data, status) {
                    $('#loader').hide();
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
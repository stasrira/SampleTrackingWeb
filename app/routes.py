from app import app
from flask import render_template, request
from datetime import datetime
import inspect
from utils import common2 as cm2
from utils import MetadataDB
from utils import reports as rp
from errors import WebError
import json
import traceback


@app.route('/')
@app.route('/index')
def index():
    #verify main app settings and get config and logging references
    mcfg = cm2.get_main_config()
    mlog, mlog_handler = cm2.get_logger()
    env_validated = cm2.check_env_variables(__file__, mlog)

    if mcfg and env_validated:
        # test code
        test = mcfg.get_value('DB/mdb_sql_proc_load_sample')
        request_datetime = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
        mlog.info('Processing web request at {}'.format(request_datetime))
        cm2.stop_logger(mlog, mlog_handler)
        return "Current date: {}<br>{}<br><br>Environment variables status: {}".format(request_datetime, test,
                                                                                    str(env_validated))
    else:
        return "Main application settings are not properly set, cannot continue."

@app.route('/view_reports')
def view_reports():
    mcfg = cm2.get_main_config()
    cfg_rep_loc = 'Reports/Tracking'
    reports = mcfg.get_value(cfg_rep_loc)
    if reports:
        return render_template("view_report.html", reports = reports)
    else:
        mlog, mlog_handler = cm2.get_logger()
        mlog.info('No list of available reports found in the config, check value of the "{}" parameter.'.format(cfg_rep_loc))
        cm2.stop_logger(mlog, mlog_handler)
        return render_template('error.html', report_name="View Reports", error = "No list of available reports found.")

@app.route('/get_report_filters', methods=['POST'])
def get_report_filters():
    cfg_rep_loc = 'Reports/Tracking'
    mcfg = cm2.get_main_config()
    # str = ''
    filters_out = {}
    if request.method == 'POST':
        print(request.form['report_id']) #request.form['program_id'])
        reports = mcfg.get_value(cfg_rep_loc)
        for rep in reports:
            if rep['rep_id'] == request.form['report_id']:
                if 'filters' in rep:
                    filters = rep['filters']
                    for filter in filters:
                        data = get_filter_values(filter)
                        if 'result' in data and data['result']:
                             filters_out[filter] = data
                        else:
                            filters_out[filter] = None
    cur_program_id =  int((request.form['cur_program_id']) if request.form['cur_program_id'].isnumeric() else -1)
    return render_template('report_filters.html', filters=filters_out, cur_program_id = cur_program_id)

def get_filter_values(filter_id):
    mcfg = cm2.get_main_config()
    mlog, mlog_handler = cm2.get_logger()
    result = None
    columns = None
    err = None
    filter_data = {}

    if filter_id == 'program_id':
        result, columns, err = rp.get_filter_data(mcfg, mlog, filter_id)
    if filter_id == 'study_id':
        result, columns, err = rp.get_filter_data(mcfg, mlog, filter_id)

    if result:
        if not err.exist():
            filter_data['id'] = filter_id
            filter_data['result'] = result
            filter_data['columns'] = columns

    return filter_data


@app.route('/reports/lstsbycateg')
def web_report_lstsbycateg():
    mcfg = cm2.get_main_config()
    mlog, mlog_handler = cm2.get_logger()
    result, columns, report_name, err = rp.report_tr_lstsbycateg(mcfg, mlog)

    if not err.exist():
        mlog.info('Proceeding to render the web page.')
        cm2.stop_logger(mlog, mlog_handler)
        return render_template('report_standalone.html', report_name=report_name, columns=columns, data=result)
    else:
        mlog.info('Proceeding to report an error to the web page.')
        cm2.stop_logger(mlog, mlog_handler)
        return render_template('error.html', report_name=report_name)

@app.route('/api/reports/lstsbycateg')
def api_report_lstsbycateg():
    mcfg = cm2.get_main_config()
    mlog, mlog_handler = cm2.get_logger()
    result, columns, report_name, err = rp.report_tr_lstsbycateg(mcfg, mlog)

    if not err.exist():
        mlog.info('Proceeding to render the api response.')
        cm2.stop_logger(mlog, mlog_handler)
        return render_template('report_json_only.html', report_name='latest Status Grouped By Categories',
                               data ={'json': json.dumps(result, default=str)})
    else:
        mlog.info('Proceeding to report an error to the web page.')
        cm2.stop_logger(mlog, mlog_handler)
        return render_template('error.html', report_name=report_name)

@app.route('/reports/lstsbyactgrp')
def web_report_tr_lstsbyactgrp():
    mcfg = cm2.get_main_config()
    mlog, mlog_handler = cm2.get_logger()
    result, columns, report_name, err = rp.report_tr_lstsbyactgrp(mcfg, mlog)

    if not err.exist():
        mlog.info('Proceeding to render the web page.')
        cm2.stop_logger(mlog, mlog_handler)
        return render_template('report_standalone.html', report_name=report_name, columns=columns, data=result)
    else:
        mlog.info('Proceeding to report an error to the web page.')
        cm2.stop_logger(mlog, mlog_handler)
        return render_template('error.html', report_name=report_name)

@app.route('/api/reports/lstsbyactgrp')
def api_report_tr_lstsbyactgrp():
    mcfg = cm2.get_main_config()
    mlog, mlog_handler = cm2.get_logger()
    result, columns, report_name, err = rp.report_tr_lstsbyactgrp(mcfg, mlog)

    if not err.exist():
        mlog.info('Proceeding to render the api response.')
        cm2.stop_logger(mlog, mlog_handler)
        return render_template('report_json_only.html', report_name='latest Status Grouped By Categories',
                               data ={'json': json.dumps(result, default=str)})
    else:
        mlog.info('Proceeding to report an error to the web page.')
        cm2.stop_logger(mlog, mlog_handler)
        return render_template('error.html', report_name=report_name)
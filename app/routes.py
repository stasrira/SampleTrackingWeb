from app import app
from datetime import datetime
import os, inspect
from utils import common2 as cm2
# from utils import global_const as gc


@app.route('/')
@app.route('/index')
def index():
    mcfg, mlog, mlog_handler = cm2.getConfigAndLogRefs ('index')

    # current function: inspect.stack()[0][3], current caller: inspect.stack()[1][3]
    cur_function = inspect.stack()[0][3]  #  current function name
    cur_file = os.path.realpath(__file__) # current file name
    # validate expected environment variables; if some variable are not present, abort execution
    env_vars_status = cm2.validate_available_envir_variables(mlog, mcfg, ['default'], '{}=>{}'. format(cur_file, cur_function))

    # test code
    test = mcfg.get_value('DB/mdb_sql_proc_load_sample')
    request_datetime = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    mlog.info('Processing web request at {}'.format(request_datetime))

    cm2.stop_logger (mlog, mlog_handler)
    # test code
    return "Hello, World! Current date: {}<br>{}<br><br>Environment variables status: {}".format(request_datetime, test, str(env_vars_status))


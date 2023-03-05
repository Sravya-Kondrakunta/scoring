import json
import pandas as pd
from collections import defaultdict


def get_code(lines):
    final_codes = []
    code = defaultdict(list)
    code_lines = []
    code_file = ""
    flag = False
    for line in lines:
        if "##" in line and ".cpp" in line:
            code_file = line.replace("## ", "")
            continue

        elif not code_file:
            continue

        elif "```cpp" in line:
            code_lines += [line]

        elif "```" in line:
            code_lines += [line]
            code['header'].append(code_file)
            code['message'].append(code_lines)
            final_codes.append(code)
            code = defaultdict(list)
            code_lines = []
            code_file = ""
        else:
            code_lines += [line]

    if not final_codes:
        return [None]

    return final_codes


def get_warnings(lines):

    final_warnings = []
    warnings = defaultdict(list)
    warnings_lines = []
    warnings_file = ""
    flag = False
    for line in lines:
        if "**warnings:" in line and ".cpp" in line:
            warnings_file = line.replace("**", "")
            continue

        elif not warnings_file:
            continue

        elif "```" in line:
            if warnings_lines:
                warnings_lines += [line]
                warnings['header'].append(warnings_file)
                warnings['message'].append(warnings_lines)
                final_warnings.append(warnings)
                warnings = defaultdict(list)
                warnings_lines = []
                warnings_file = ""
                flag = False
            else:
                flag = True
                warnings_lines += [line]

        else:
            if flag:
                warnings_lines += [line]

    if not final_warnings:
        return [None]

    return final_warnings


def get_results(lines):

    final_results = []
    results = defaultdict(list)
    results_lines = []
    results_file = ""
    flag = False
    for line in lines:
        if "**results of " in line and ".cpp" in line:
            results_file = line.replace("**results of ", "")
            continue

        elif not results_file:
            continue

        elif "```" in line:
            if results_lines:
                results_lines += [line]
                results['header'].append(results_file)
                results['message'].append(results_lines)
                final_results.append(results)
                results = defaultdict(list)
                results_lines = []
                results_file = ""
                flag = False
            else:
                flag = True
                results_lines += [line]

        else:
            if flag:
                results_lines += [line]

    if not final_results:
        return [None]

    return final_results


def show_results_clearly(assignment: str, return_result=False) -> dict:
    """
    Parameters
    ----------
    assignment: str

    Returns
    ----------
    None
    """
    students = {"student_name":[],
                "code": [],
                "warnings": [],
                "result": []}

    student_name = ""
    total_lines = []

    assignment = assignment.split("\n")

    assignment_name = assignment[0].split(" ")[1]
    for line in assignment:
        line = line.rstrip()
        if f"# {assignment_name} – " in line:
            if total_lines:
                students['student_name'] += [student_name]
                students['code'] += get_code(total_lines)
                students['warnings'] += get_warnings(total_lines)
                students['result'] += get_results(total_lines)

            student_name = line.replace(f"# {assignment_name} – ", "")
            total_lines = []
            continue

        total_lines += [line]

    # last student will be saved
    if total_lines:
        students['student_name'] += [student_name]
        students['code'] += get_code(total_lines)
        students['warnings'] += get_warnings(total_lines)
        students['result'] += get_results(total_lines)

    if return_result:
        return students

    students = json.dumps(students, sort_keys=True, indent=4)
    return students


def get_summary(assignment):
    students = json.loads(str(assignment))

    # dataframe
    df = pd.DataFrame.from_dict(students)

    # total
    total = {"total": [len(df)],
             "missing": [len(df[df['code'].isna()])],
             "errors": [len(df[~df['warnings'].isna()])],
             "success": [len(df[~df['result'].isna()])]
    }

    # Summary metrics
    return pd.DataFrame.from_dict(total).to_html(classes='table table-stripped center', index=False).replace('<td>', '<td align="right">')


def get_missing(assignment):
    students = json.loads(str(assignment))

    # dataframe
    df = pd.DataFrame.from_dict(students)
    df = df[df['code'].isna()]
    df['student_name'] = df['student_name'] + "@stolaf.edu"
    names = df['student_name'].to_list()
    return ", ".join(names)
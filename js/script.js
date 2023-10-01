var result = {}
var data = {}
var summary_results = ""
var missing_emails = ""

function summary(input) {
summary_results = input
}

function escapeHtml(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function emails(input) {
missing_emails = input
}

function make_csv_data(input) {
csv_data = "student_id,email_id,score,feedback,\n"

for (const [key, value] of Object.entries(input)) {
  console.log(key, value)
  email_id = key+"@stolaf.edu"
  feedback = value[1].includes("\n") ? `"${value[1]}"` : value[1]; // Enclose in double quotes if contains newline
  csv_data += key + "," + email_id + "," + value[0] + "," + feedback + "\n";
  }
return csv_data
}

function clear_ids() {

var node = document.getElementById('result')
node.innerHTML = ""

var node = document.getElementById('feedback')
node.innerHTML = ""

var node = document.getElementById('code')
node.innerHTML = ""

var node = document.getElementById('upload')
node.innerHTML = ""

}

function get_students(student, i) {
    i = i+1
    content = ""
    if (student == null)
        return content

     content +=
     '<li "class="tooltip-element" data-tooltip="'+i+'"> \
          <a id='+student+'_student href="#", class="active" data-active="'+i+'"> \
            <div class="icon"> \
              <i class="fa-solid fa fa-user"></i> \
            </div> \
            <span class="link hide">'+i+'. '+ student +'</span> \
          </a> \
     </li>'
    return content
   }

function display_code(i) {

    i= (i-1)
    clear_ids();

    // show upload button and the name of the files
    if (i==-1)
    {

        content = '<link rel="stylesheet" href="css/style1.css" /> \
                    <input type="file" id="file-input" multiple /> \
                    <label for="file-input"> \
                                  <i class="fa-solid fa-arrow-up-from-bracket"></i> \
                                  Choose File To Upload \
                    </label> \
                    <div id="num-of-files">No Files Choosen</div> \
                    <ul id="files-list"></ul> \
                  '
        var node = document.getElementById('upload')
        node.innerHTML = content
        files();
        return
    }

    if (i >= data['student_name'].length)
    {

    content = "<h4><b> Summary Results: </b></h4>"
    content += summary_results + "<br>"
    content += "<h4><b> Emails of Missing Assignments: </b></h4>"
    content += "<pre><code>"
    content += missing_emails + "\n\n"
    content += "</pre></code>" + "<br><br>"

    content += '<link rel="stylesheet" href="css/style1.css" /> \
            <label for="download"> \
                          <i class="fa fa-download"></i> \
                          Download Scores \
            </label> \
            <input style="display: none;" id="download" type="button" onClick="DownloadResults()" /> \
          '
    var node = document.getElementById('upload')
    node.innerHTML = content

    return

    }

    // code and warnings
    content =  "<h4><b> Code & Warnings : </b></h4>"
    content += "<pre><code>"
    content += get_code(data['code'][i], "code")
    content += get_code(data['warnings'][i], "warnings")
    content += "</code></pre>"

    var node = document.getElementById('code')
    node.innerHTML = content

    // result
    content =  "<h4><b> Result : </b></h4>"
    content += "<pre><code>"
    content += get_code(data['result'][i], "result")
    content += "</code></pre>"

    var node = document.getElementById('result')
    node.innerHTML = content

    get_feedback(i)
   }

function get_code(codes, text) {
    content = ""
    if (codes == null)
        return content

    for (let j = 0; j < codes['header'].length; j++){
        if (text == "code")
            content += "File Name: " + escapeHtml(codes['header'][j] + "\n") + ""
        else
            content +=  escapeHtml("\n" + codes['header'][j] + "\n")

        for (let k = 0; k < codes['message'][j].length; k++)
        content +=  escapeHtml(codes['message'][j][k] + "\n")
    }
    return content
   }

function gatherResults (form_id) {
    form = document.getElementById(form_id)
    var feedback = form.feedback.value;
    var score = form.score.value;
    result[form_id] = [score, feedback]
    localStorage['result'] = JSON.stringify(result)

    // change color to green
    document.getElementById(form_id+"_student").style.color = "#006400";
    document.getElementById(form_id+"_student").style.fontWeight = 'bold';

    return false
}

function get_feedback(i) {

    // feedback
    feedback_value = ""
    score_value = ""
    student = data['student_name'][i]
     if (result != null)
        if (result[student] != null)
            {
                feedback_value = result[student][1]
                score_value = result[student][0]
            }
     if (feedback_value == "")
        textarea = '<textarea class="form-control" name="feedback", type="text" placeholder="Please enter your feedback here" style="height: 10rem; color: darkblue" data-sb-validations="required"></textarea>'
     else
        textarea = '<textarea class="form-control" name="feedback", type="text" placeholder="Please enter your feedback here" style="height: 10rem; color: darkblue" data-sb-validations="required">'+feedback_value+'</textarea>'

     content = '<h4><b> Feedback : </b></h4> \
                <form id='+ student +' name='+ student +' action="" onsubmit="return gatherResults(\'' + student + '\')"> \
                      <!-- Message input --> \
                      <div class="mb-3"> \
                      '+textarea+' \
                      </div> \
                      <div class="mb-3"> \
                        <input style="color: darkred;" class="form-control" type="number" name="score" value="'+score_value+'" placeholder="Your score here" data-sb-validations="required" /> \
                      </div> \
                      <!-- Form submit button --> \
                      <div class="d-grid"> \
                        <button class="btn btn-primary btn-md" type="button" name="'+student+'" value="Submit" onClick="gatherResults(\'' + student + '\')">Submit</button> \
                      </div> \
                </form> \
                '
    var node = document.getElementById('feedback')
    node.innerHTML = content
}

function DownloadResults () {
    const link = document.createElement("a");
    link.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURI(make_csv_data(result)));
    link.setAttribute("download", "result.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function load_students(input) {

   data = input

    var stored = localStorage['result'];
    if (stored) result = JSON.parse(stored);
    else result = {};


    content = ""
    data_store = {}
    for (let i = 0; i < data['student_name'].length; i++) {
        student = data['student_name'][i]
        data_store[student] = ["", ""]
        content += get_students(student, i)
     }
     if(result
            && Object.keys(result).length === 0
            && Object.getPrototypeOf(result) === Object.prototype)
        result = data_store
     i = data['student_name'].length + 1
     content +=
     '<li class="tooltip-element" data-tooltip="'+i+'"> \
          <a href="#", class="active" data-active="'+i+'"> \
            <div class="icon"> \
              <i class="fa-solid fa fa-download"></i> \
            </div> \
            <span class="link hide">Download</span> \
          </a> \
     </li>'

    var node = document.getElementById('student')
    node.innerHTML += content

    if ((result != {}) && (result != null)){
        for (let i = 0; i < data['student_name'].length; i++) {
                student = data['student_name'][i]
                score_value = result[student][0]
                if (score_value){
                    // change color to green
                    document.getElementById(student+"_student").style.color = "#006400";
                    document.getElementById(student+"_student").style.fontWeight = 'bold';
                }
            }
        }
    overall();
}


var result = {}
var data = {}
var summary_results = ""
var missing_emails = ""

function summary(input) {
summary_results = input
}

function emails(input) {
missing_emails = input
}

function make_csv_data(input) {
csv_data = "student_id,email_id,feedback,score\n"
for (const [key, value] of Object.entries(input)) {
  email_id = key+"@stolaf.edu"
  csv_data += key+","+email_id+","+value[0]+","+value[1]+"\n"
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
              <i class="bx bxs-folder"></i> \
            </div> \
            <span class="link hide">'+ student +'</span> \
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
            content += "<h4> File Name: " + codes['header'][j] + "\n" + "</h4>"
        else
            content += "\n" + "<h4> " + codes['header'][j] + "\n" + "</h4>"

        for (let k = 0; k < codes['message'][j].length; k++)
        content +=  codes['message'][j][k] + "\n"
    }
    return content
   }

function gatherResults (form_id) {
    form = document.getElementById(form_id)
    var feedback = form.feedback.value;
    var score = form.score.value;
    result[form_id] = [feedback, score]
    localStorage['result'] = JSON.stringify(result)

    // change color to green
    document.getElementById(form_id+"_student").style.color = "#006400";
    document.getElementById(form_id+"_student").style.fontWeight = 'bold';
}

function get_feedback(i) {

    // feedback
    feedback_value = ""
    score_value = ""
    student = data['student_name'][i]
     if (result != null)
        if (result[student] != null)
            {
                feedback_value = result[student][0]
                score_value = result[student][1]
            }
     if (feedback_value == "")
        textarea = '<textarea class="form-control" name="feedback", type="text" placeholder="Please enter your feedback here" style="height: 10rem;" data-sb-validations="required"></textarea>'
     else
        textarea = '<textarea class="form-control" name="feedback", type="text" placeholder="Please enter your feedback here" style="height: 10rem;" data-sb-validations="required">'+feedback_value+'</textarea>'

     content = '<h4><b> Feedback : </b></h4> \
                <form id='+ student +' name='+ student +' action=""> \
                      <!-- Message input --> \
                      <div class="mb-3"> \
                      '+textarea+' \
                      </div> \
                      <div class="mb-3"> \
                        <input style="color: #f00;" class="form-control" type="number" name="score" value="'+score_value+'" placeholder="Your score here" data-sb-validations="required" /> \
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

    result = {}
    var stored = localStorage['result'];
    if (stored) result = JSON.parse(stored);
    else result = {};

    content = ""
    for (let i = 0; i < data['student_name'].length; i++) {
     student = data['student_name'][i]
     content += get_students(student, i)
     }

     i = data['student_name'].length + 1
     content +=
     '<li class="tooltip-element" data-tooltip="'+i+'"> \
          <a href="#", class="active" data-active="'+i+'"> \
            <div class="icon"> \
              <i class="bx bxs-folder"></i> \
            </div> \
            <span class="link hide">Download</span> \
          </a> \
     </li>'

    var node = document.getElementById('student')
    node.innerHTML += content

    overall();
}


// Import Pyodide
async function main(content){
    let pyodide = await loadPyodide();
    await pyodide.loadPackage("pandas");
    await pyodide.runPythonAsync(`
        from pyodide.http import pyfetch
        response = await pyfetch("http://localhost:63342/grading/website/python/grading.py")
        with open("grading.py", "wb") as f:
            f.write(await response.bytes())
    `)
    pkg = pyodide.pyimport("grading");

    let result_ = await pkg.show_results_clearly(content)
    result = JSON.parse(result_)
    // console.log(JSON.parse(result))
    load_students(result)

    let summ = await pkg.get_summary(result_)
    summary(summ)

    let email_missing = await pkg.get_missing(result_)
    emails(email_missing)
}

function getFile(event) {
	const input = event.target
  if ('files' in input && input.files.length > 0) {
	  placeFileContent(
      document.getElementById('content-target'),
      input.files[0])
  }
}

function placeFileContent(target, file) {
	readFileContent(file).then(content => {
	main(content)
	localStorage.clear();
    // load_students(data);

  }).catch(error => console.log(error))
}

function readFileContent(file) {
	const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.onload = event => resolve(event.target.result)
    reader.onerror = error => reject(error)
    reader.readAsText(file)
  })
}
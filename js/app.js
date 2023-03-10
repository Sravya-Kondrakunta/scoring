let activeIndex;

function overall()
{
const shrink_btn = document.querySelector(".shrink-btn");
const search = document.querySelector(".search");
const sidebar_links = document.querySelectorAll(".sidebar-links a");
const active_tab = document.querySelector(".active-tab");
const shortcuts = document.querySelector(".sidebar-links h4");
const tooltip_elements = document.querySelectorAll(".tooltip-element");

function moveActiveTab() {
  let topPosition = activeIndex * 58 + 2.5;
  active_tab.style.top = `${topPosition}px`;
}

function changeLink() {
  sidebar_links.forEach((sideLink) => sideLink.classList.remove("active"));
  this.classList.add("active");

  activeIndex = this.dataset.active;

  moveActiveTab();
  display_code(activeIndex)
  if (activeIndex != 0)
    hljs.highlightAll();
}

sidebar_links.forEach((link) => link.addEventListener("click", changeLink));

function showTooltip() {
  let tooltip = this.parentNode.lastElementChild;
  let spans = tooltip.children;
  let tooltipIndex = this.dataset.tooltip ;
}

tooltip_elements.forEach((elem) => {
  elem.addEventListener("mouseover", showTooltip);
});

}

overall();

// if cached use it to startup
var stored = localStorage['python_results'];
if (stored) {
    result__ = JSON.parse(stored)
    summ = localStorage.getItem('summ')
    email_missing = localStorage.getItem('email_missing')

    load_students(result__)
    summary(summ)
    emails(email_missing)
var stored = localStorage['result'];
if (stored)
    {
    result = JSON.parse(stored);
    for (const [key, value] of Object.entries(result)) {
        student = key + "_student"
        if (value[0] == "") {
            document.getElementById(student).click();
            break
            }
    }
    }
else
    document.getElementById(result__['student_name'][0] + "_student").click();

   }
else
{
document.getElementById('0').click();
}

alert("app.js loaded");

function generateGCode() {
    alert("Generate button works!");

    document.getElementById("output").value =
`%
G21
G90
G0 X0 Y0
M30
%`;
}

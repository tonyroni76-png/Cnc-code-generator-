function generateGCode() {

    const operation = document.getElementById("operation").value;
    const width = parseFloat(document.getElementById("width").value);
    const height = parseFloat(document.getElementById("height").value);
    const depth = parseFloat(document.getElementById("depth").value);
    const feed = parseFloat(document.getElementById("feed").value);
    const toolNumber = parseInt(document.getElementById("toolNumber").value);
    const spindleSpeed = parseInt(document.getElementById("spindleSpeed").value);
    const safeZ = parseFloat(document.getElementById("safeZ").value);
    const finalDepth = parseFloat(document.getElementById("finalDepth").value);
    const depthPerPass = parseFloat(document.getElementById("depthPerPass").value);

    let gcode = "";

gcode += "%\n";
gcode += "G20\n";          // Inches
gcode += "G17 G90 G40\n";
gcode += `T${toolNumber} M6\n`;
gcode += `S${spindleSpeed} M3\n`;
gcode += `G0 Z${safeZ.toFixed(3)}\n`;
    
let currentDepth = 0;

while (currentDepth > finalDepth) {

    currentDepth -= depthPerPass;

    if (currentDepth < finalDepth) {
        currentDepth = finalDepth;
    }

    gcode += `\n(Pass at Z${currentDepth.toFixed(3)})\n`;

    gcode += `G0 Z${safeZ.toFixed(3)}\n`;
    gcode += `G1 Z${currentDepth.toFixed(3)} F10\n`;

    // Existing rectangle toolpath goes here

    gcode += `G0 Z${safeZ.toFixed(3)}\n`;
}
    if (operation === "rectangle") {

        gcode += "(Rectangular Profile)\n";
        gcode += "G0 X0 Y0\n";
        gcode += `G1 Z-${depth.toFixed(3)} F${feed}\n`;
        gcode += `G1 X${width.toFixed(3)}\n`;
        gcode += `G1 Y${height.toFixed(3)}\n`;
        gcode += "G1 X0.000\n";
        gcode += "G1 Y0.000\n";

    } else {

        gcode += `(The ${operation} operation has not been programmed yet.)\n`;

    }

    gcode += "G0 Z5.000\n";
    gcode += "M30\n";
    gcode += "%";

    document.getElementById("output").value = gcode;
}

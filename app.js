function generateGCode() {

    const operation = document.getElementById("operation").value;
    const width = parseFloat(document.getElementById("width").value);
    const height = parseFloat(document.getElementById("height").value);
    const feed = parseFloat(document.getElementById("feed").value);

    const toolNumber = parseInt(document.getElementById("toolNumber").value);
    const spindleSpeed = parseInt(document.getElementById("spindleSpeed").value);
    const safeZ = parseFloat(document.getElementById("safeZ").value);
    const finalDepth = parseFloat(document.getElementById("finalDepth").value);
    const depthPerPass = parseFloat(document.getElementById("depthPerPass").value);

    let gcode = "";

    gcode += "%\n";
    gcode += "G20\n";                  // Inch mode
    gcode += "G17 G90 G40\n";          // XY plane, Absolute, Cancel cutter comp
    gcode += `T${toolNumber} M6\n`;    // Tool change
    gcode += `S${spindleSpeed} M3\n`;  // Spindle on clockwise
    gcode += `G0 Z${safeZ.toFixed(3)}\n`;

    let currentDepth = 0;

    if (operation === "rectangle") {

        gcode += "(Rectangular Profile)\n";

        while (currentDepth > finalDepth) {

            currentDepth -= depthPerPass;

            if (currentDepth < finalDepth) {
                currentDepth = finalDepth;
            }

            gcode += `\n(Pass at Z${currentDepth.toFixed(3)})\n`;

            // Rapid to start point
            gcode += "G0 X0.000 Y0.000\n";

            // Move to safe height
            gcode += `G0 Z${safeZ.toFixed(3)}\n`;

            // Plunge
            gcode += `G1 Z${currentDepth.toFixed(3)} F${feed}\n`;

            // Cut rectangle
            gcode += `G1 X${width.toFixed(3)} Y0.000 F${feed}\n`;
            gcode += `G1 X${width.toFixed(3)} Y${height.toFixed(3)}\n`;
            gcode += `G1 X0.000 Y${height.toFixed(3)}\n`;
            gcode += "G1 X0.000 Y0.000\n";

            // Retract
            gcode += `G0 Z${safeZ.toFixed(3)}\n`;
        }

    } else {

        gcode += `(The ${operation} operation has not been programmed yet.)\n`;

    }

    // End of program
    gcode += `G0 Z${safeZ.toFixed(3)}\n`;
    gcode += "M5\n";      // Spindle stop
    gcode += "M30\n";
    gcode += "%";

    document.getElementById("output").value = gcode;
}

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

    const toolLibrary = {
    "1": {
        number: 1,
        diameter: 0.0625,
        spindle: 18000,
        feed: 20,
        plunge: 8
    },

    "2": {
        number: 2,
        diameter: 0.125,
        spindle: 18000,
        feed: 40,
        plunge: 12
    },

    "3": {
        number: 3,
        diameter: 0.1875,
        spindle: 18000,
        feed: 60,
        plunge: 18
    },

    "4": {
        number: 4,
        diameter: 0.250,
        spindle: 18000,
        feed: 80,
        plunge: 24
    },

    "5": {
        number: 5,
        diameter: 0.375,
        spindle: 18000,
        feed: 120,
        plunge: 36
    },

    "6": {
        number: 6,
        diameter: 0.500,
        spindle: 18000,
        feed: 160,
        plunge: 48
    }
};

    document.getElementById("toolSelect").addEventListener("change", function () {

    const tool = toolLibrary[this.value];

    if (!tool) return;

    document.getElementById("toolNumber").value = tool.number;
    document.getElementById("toolDiameter").value = tool.diameter;
    document.getElementById("spindleSpeed").value = tool.spindle;
    document.getElementById("feed").value = tool.feed;
    document.getElementById("plungeFeed").value = tool.plunge;
});
    // ============================
    // Input Validation
    // ============================

    if (isNaN(width) || isNaN(height) || isNaN(feed)) {
        alert("Please enter Width, Height, and Feed Rate.");
        return;
    }

    if (width <= 0 || height <= 0) {
        alert("Width and Height must be greater than zero.");
        return;
    }

    if (feed <= 0) {
        alert("Feed Rate must be greater than zero.");
        return;
    }

    if (safeZ <= 0) {
        alert("Safe Z Height must be greater than zero.");
        return;
    }

    if (depthPerPass <= 0) {
        alert("Depth Per Pass must be greater than zero.");
        return;
    }

    if (finalDepth >= 0) {
        alert("Final Depth must be a negative number.");
        return;
    }

    if (Math.abs(depthPerPass) > Math.abs(finalDepth)) {
        alert("Depth Per Pass cannot be greater than the total cutting depth.");
        return;
    }

    // ============================
    // Start generating G-code
    // ============================

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

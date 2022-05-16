#!/usr/bin/env node

const readline = require("readline");
// const path = require("path");

// const filePoss = path.resolve(process.cwd(), process.argv[2])

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

let file = [""], curY = curX = 0;

render();

process.stdin.on('keypress', (ch, key) => {
    //  console.log(key)

    if (key.ctrl) {
        if (key.name === "s") {
            //TODO!
            return;
        } else if (key.name === "c")

            return process.exit(0);

        else return;

    }

    if (!file[curY + 1]) file[curY + 1] = "";

    // if (file[curY]===file[file.length-1]&&!file[curY])

    switch (key?.name) {

        // Arrow keys:
        case "up": if (curY) curY--; curX = file[curY].length; render(); break;

        case "down": curY++; curX = file[curY].length; render(); break;

        case "left": if (curX) curX--; render(); break;

        case "right": curX++; render(); break;

        // Enter Key:
        case "return":
            file.splice(curY + 1, 0, file[curY].slice(curX));
            file[curY] = file[curY].slice(0, curX);

            curX = file[curY+1].length; curY++; render(); break;

        // Delete Key:    
        case "delete":
            if (file[curY]) file[curY] = file[curY].substring(0, curX) + file[curY].substring(curX + 1);
            else file.splice(curY,1)
            render(); break;

        // Backspace Key:    
        case "backspace":
            if (curX) {
                file[curY] = file[curY].substring(0, curX - 1) + file[curY].substring(curX);

                curX--

            }
            else if (curY) {
                file = file.slice(0, -1)
                curY--;

            }

            render(); break;

        default:
            if (!ch) break;
            file[curY] = file[curY].substring(0, curX) + ch + file[curY].substring(curX);
            
            curX++; render(); break;

    }
})

function render() {
    console.clear();

    const write = [
        ...file.slice(0, curY + 1),
        " ".repeat(curX) + "^",
        ...file.slice(curY + 1)
    ];

    console.log("akf-code - not saved\n\n" + write.join("\n") + `\nCurrent pos: ${curY}:${curX}`);

}
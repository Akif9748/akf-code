#!/usr/bin/env node

const readline = require("readline");
// const path = require("path");

// const filePoss = path.resolve(process.cwd(), process.argv[2])


readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

let file = [""], curline = cur = 0;

render();

process.stdin.on('keypress', (ch, key) => {
    if (key.ctrl) {
        if (key.name === "s") {
            //TODO!
            return;
        } else if (key.name === "c")

            return process.exit(0);

        else return;

    }

    if (!file[curline + 1]) file[curline + 1] = "";

    // if (file[curline]===file[file.length-1]&&!file[curline])

    switch (key?.name) {
        case "up":

            if (curline) curline--;
            cur = file[curline].length
            render();
            break;

        case "down":
            curline++;
            cur = file[curline].length
            render();
            break;

        case "left":

            if (cur) cur--;
            render();

            break;
        case "right":
            cur++;
            render();

            break;
        case "return":
            curline++;
            cur = file[curline].length

            render();

            break;

        case "backspace":
            if (cur) {
                file[curline] = file[curline].substring(0, cur - 1) + file[curline].substring(cur);

                cur--

            } else
                file = file.slice(0, -1)

            render();
            break;
        default:
            if (!ch) break;
            file[curline] = file[curline].substring(0, cur) + ch + file[curline].substring(cur);
            cur++

            render();
            break;


    }
})

function render() {
    console.clear();
    console.log("akf-code - not saved\n\n" + file.join("\n") + " ".repeat(cur) + "^" + `\nCurrent pos: ${curline}:${cur}`);
}
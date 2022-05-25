const { resolve, extname } = require("path"),
    { spawn } = require("child_process"),
    fs = require("fs"),
    brackets = require("./brackets.json"),
    langs = require("./config.json"),
    table = str => `╔${"═".repeat(str.length + 2)}╗\n║ ${str} ║\n╚${"═".repeat(str.length + 2)}╝`

const fileName = process.argv[2] || "untitled.txt",
    dirName = resolve(process.cwd(), fileName),
    lang = langs[extname(fileName)] || null;

let file = fs.existsSync(dirName) ? fs.readFileSync(dirName, "utf8").split(/\r?\n/) : [""];

require("readline").emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

let curY = curX = 0, run;

render();

process.stdin.on('keypress', (ch, key) => {
    //  console.log(key)

    if (key.ctrl) {
        if (key.name === "s")
            return fs.writeFile(dirName, file.join("\n"), () => console.log("\nSaved! Path:", dirName))

        else if (key.name === "r" && lang?.run && !run) {
            run = true;
            const operation = spawn(lang?.run, [fileName])

            operation.stdout.on("data", d => console.log("stdout: ", d.toString()))
            operation.stderr.on("data", d => console.log("stderr: ", d.toString()))

            operation.on("close", c => {
                run = false
                console.log("Running is finished with code", c)
            })


        } else if (key.name === "c") {
            if (run)
                run = false
            else
                return process.exit(0);
        }
    } else if (!run) {

        if (!file[curY + 1]) file[curY + 1] = "";

        switch (key?.name) {

            // Arrow keys:
            case "up": if (curY) curY--; curX = file[curY].length; render(); break;

            case "down": curY++; curX = file[curY].length; render(); break;

            case "left": if (curX) curX--; else if (curY) curY--; render(); break;

            case "right": if (!file[curY][curX]) file[curY] += " "; curX++; render(); break;

            // Enter Key:
            case "return":
                file.splice(curY + 1, 0, file[curY].slice(curX));
                file[curY] = file[curY].slice(0, curX);

                curX = file[curY + 1].length; curY++; render(); break;

            // Delete Key:    
            case "delete":
                if (file[curY]) file[curY] = file[curY].substring(0, curX) + file[curY].substring(curX + 1);
                else file.splice(curY, 1)
                render(); break;

            // Backspace Key:    
            case "backspace":
                if (curX) {
                    file[curY] = file[curY].substring(0, curX - 1) + file[curY].substring(curX);
                    curX--;

                }
                else if (curY) {
                    file = file.slice(0, -1);
                    curY--;

                }

                render(); break;

            default:
                console.log(ch)
                if (!ch) break;

                file[curY] = file[curY].substring(0, curX) + ch + (lang?.bracket && brackets[ch] ? brackets[ch] : "") + file[curY].substring(curX);

                curX++; render(); break;

        }
    }
})

function render() {
    console.clear();

    const lines = file.map((l, i) => i + " ".repeat(Math.abs(String(i).length - 4)) + "│ " + l)

    console.log(`${table(`akf-code - ${dirName} | ${curY}:${curX}`)}\n${[
        ...lines.slice(0, curY + 1),
        "────┤ " + " ".repeat(curX) + "^",
        ...lines.slice(curY + 1)
    ].join("\n")}\nExit: CTRL + C | Save: CTRL + S | Run if supported: CTRL + R`);

}



/**
 * NaScene Engine v1.0
 * Javascript Runtime for interpreting and rendering .nascene files seamlessly.
 */

class NaSceneParser {
    static parseStringValue(str) {
        if (!str) return "";
        // Remove surrounding quotes if they exist
        if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
            return str.substring(1, str.length - 1);
        }
        return str;
    }

    static parseArgs(argsStr) {
        let args = {};
        let currentKey = "";
        let currentValue = "";
        let inString = false;
        let stringChar = "";
        let state = "KEY"; // KEY, VALUE

        for (let i = 0; i < argsStr.length; i++) {
            let char = argsStr[i];

            if (state === "KEY") {
                if (char === "=") {
                    state = "VALUE";
                } else if (char !== " " && char !== "\t") {
                    currentKey += char;
                }
            } else if (state === "VALUE") {
                if (!inString && (char === '"' || char === "'")) {
                    inString = true;
                    stringChar = char;
                    currentValue += char;
                } else if (inString && char === stringChar) {
                    inString = false;
                    currentValue += char;
                } else if (!inString && char === ",") {
                    args[currentKey.trim()] = this.parseStringValue(currentValue.trim());
                    currentKey = "";
                    currentValue = "";
                    state = "KEY";
                } else {
                    currentValue += char;
                }
            }
        }

        if (currentKey.trim() !== "") {
            args[currentKey.trim()] = this.parseStringValue(currentValue.trim());
        }

        return args;
    }

    static parse(text) {
        const scenes = {};
        let currentScene = null;
        const lines = text.split('\n');

        let buffer = "";
        let inCommand = false;
        let parenCount = 0;

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            let trimmed = line.trim();

            if (trimmed === "" || trimmed.startsWith("#")) continue;

            // Scene definition
            if (!inCommand && !line.startsWith(" ") && !line.startsWith("\t") && trimmed.endsWith(":")) {
                currentScene = trimmed.slice(0, -1);
                scenes[currentScene] = [];
                continue;
            }

            if (currentScene) {
                if (!inCommand) {
                    // Check if it's the start of a command
                    buffer = trimmed;
                } else {
                    buffer += " " + trimmed;
                }

                // Count parens to know when command ends
                for (let j = 0; j < trimmed.length; j++) {
                    if (trimmed[j] === '(') parenCount++;
                    if (trimmed[j] === ')') parenCount--;
                }

                if (parenCount > 0) {
                    inCommand = true;
                } else {
                    inCommand = false;
                    parenCount = 0;

                    // Parse finished buffered command
                    const match = buffer.match(/^([\w_]+)\((.*)\)$/s);
                    if (match) {
                        scenes[currentScene].push({
                            command: match[1],
                            args: this.parseArgs(match[2])
                        });
                    }
                    buffer = "";
                }
            }
        }
        return scenes;
    }
}

class NaSceneEngine {
    constructor(containerElement) {
        this.container = containerElement;
        this.manifestPath = this.container.getAttribute("data-scene_data");
        this.nasceneRoot = this.manifestPath ? this.manifestPath.substring(0, this.manifestPath.lastIndexOf('/')) : '';

        this.scenes = {};
        this.vars = {
            sys_aspect_ratio: this.container.clientWidth / (this.container.clientHeight || 1),
            sys_is_portrait: this.container.clientWidth < this.container.clientHeight,
            sys_is_landscape: this.container.clientWidth >= this.container.clientHeight
        };

        Object.defineProperty(this.vars, 'sys_language', {
            get: function () { return window.current_language || document.documentElement.lang || "en"; }
        });

        this.elements = {}; // id -> DOM element
        this.runId = 0;
        this.resolvePause = null;

        // Ensure container is absolute/relative to wrap absolute children
        if (window.getComputedStyle(this.container).position === "static") {
            this.container.style.position = "relative";
        }
        this.container.style.overflow = "hidden"; // Prevent VN elements from spilling

        // Setup resize listener to update sys variables
        window.addEventListener('resize', () => {
            this.vars.sys_aspect_ratio = this.container.clientWidth / (this.container.clientHeight || 1);
            this.vars.sys_is_portrait = this.container.clientWidth < this.container.clientHeight;
            this.vars.sys_is_landscape = this.container.clientWidth >= this.container.clientHeight;
        });

        this.init();
    }

    async init() {
        if (!this.manifestPath) return;

        try {
            const res = await fetch(this.manifestPath);
            const manifest = await res.json();

            if (manifest.landing_place) {
                // landing_place could be "nascene_root:/0_museum_entry/museum_entry.nascene:museum_entry"
                let target = manifest.landing_place;
                await this.jumpTo(target, false);
            }
        } catch (e) {
            console.error("Failed to load NaScene manifest:", e);
        }
    }

    resolvePath(pathStr) {
        if (pathStr.startsWith("nascene_root:/")) {
            return this.nasceneRoot + pathStr.substring("nascene_root:".length);
        }
        // Fallback for local
        if (pathStr.startsWith("local:/")) {
            return this.nasceneRoot + pathStr.substring("local:".length);
        }
        return pathStr;
    }

    getLangArg(args, baseName) {
        // Fallback sequence: baseName_LANG -> baseName_en -> baseName
        const langCode = this.vars.sys_language;
        if (args[baseName + "_" + langCode] !== undefined) {
            return args[baseName + "_" + langCode];
        }
        if (args[baseName + "_en"] !== undefined) {
            return args[baseName + "_en"];
        }
        return args[baseName];
    }

    async loadSceneFile(filePath) {
        try {
            const res = await fetch(filePath);
            const text = await res.text();
            const parsedScenes = NaSceneParser.parse(text);
            // Merge loaded scenes
            this.scenes = { ...this.scenes, ...parsedScenes };
        } catch (e) {
            console.error("Failed to load scene file:", filePath, e);
        }
    }

    async jumpTo(targetStr, isSequential = true) {
        // targetStr format: "nascene_root:/path/to/file.nascene:scene_id" or just "scene_id" for local scene jumps
        let sceneId = targetStr;

        if (targetStr.includes(":O_o:")) { // Temporary safe split
            // Actually, we split by ":" but path could have "nascene_root:/"
        }

        // Better split mechanism considering prefix
        let filePath = null;
        if (targetStr.includes(".nascene:")) {
            const parts = targetStr.split(".nascene:");
            filePath = this.resolvePath(parts[0] + ".nascene");
            sceneId = parts[1];
        }

        let currentRunId = ++this.runId;
        if (this.resolvePause) {
            this.resolvePause();
            this.resolvePause = null;
        }

        if (filePath) {
            await this.loadSceneFile(filePath);
        }

        if (!this.scenes[sceneId]) {
            console.error("Scene not found:", sceneId);
            return;
        }

        await this.playScene(sceneId, currentRunId);
        if (isSequential) {
            throw new Error("NaScene_Jump");
        }
    }

    // Replace $var_name in strings
    evaluateString(str) {
        if (typeof str !== 'string') return String(str);
        // Replace $var_name
        return str.replace(/\$(\w+)/g, (match, varName) => {
            if (this.vars[varName] !== undefined) {
                return this.vars[varName];
            }
            return match; // Unresolved variable
        });
    }

    // Geometry evaluation helper based on doc
    applyGeometry(el, args) {
        // Size
        if (args.size_x) {
            el.style.width = args.size_x;
        }
        if (args.size_y) {
            el.style.height = args.size_y;
        }

        // Position & Anchor
        const posX = args.pos_x !== undefined ? parseFloat(args.pos_x) : 0;
        const posY = args.pos_y !== undefined ? parseFloat(args.pos_y) : 0;
        const anchorX = args.anchor_x !== undefined ? parseFloat(args.anchor_x) : 0;
        const anchorY = args.anchor_y !== undefined ? parseFloat(args.anchor_y) : 0;

        el.style.position = "absolute";
        el.style.left = (posX * 100) + "%";
        el.style.top = (posY * 100) + "%";

        let transforms = [];
        transforms.push(`translate(-${anchorX * 100}%, -${anchorY * 100}%)`);

        if (args.scale_x !== undefined || args.scale_y !== undefined) {
            const sx = args.scale_x !== undefined ? args.scale_x : 1.0;
            const sy = args.scale_y !== undefined ? args.scale_y : 1.0;
            transforms.push(`scale(${sx}, ${sy})`);
        }
        if (args.rotation !== undefined) {
            transforms.push(`rotate(${args.rotation}deg)`);
        }

        el.style.transform = transforms.join(' ');

        if (args.opacity !== undefined) {
            el.style.opacity = args.opacity;
        }
    }

    async executeCommand(cmd) {
        const command = cmd.command;
        let args = { ...cmd.args }; // Shallow copy

        // Evaluate string variables for standard arguments (except those strictly evaluated like conditions)
        for (let key in args) {
            let val = args[key];
            if (typeof val === 'string' && val === "True") args[key] = true;
            if (typeof val === 'string' && val === "False") args[key] = false;
        }

        switch (command) {
            case "clear": {
                for (let id in this.elements) {
                    if (this.elements[id].parentNode) {
                        this.elements[id].parentNode.removeChild(this.elements[id]);
                    }
                }
                this.elements = {};
                break;
            }
            case "remove": {
                if (args.id && this.elements[args.id]) {
                    if (this.elements[args.id].parentNode) {
                        this.elements[args.id].parentNode.removeChild(this.elements[args.id]);
                    }
                    delete this.elements[args.id];
                }
                break;
            }
            case "add_image": {
                const el = document.createElement("img");
                const id = args.id;
                const src = this.resolvePath(this.evaluateString(args.src));
                el.src = src;

                if (args.object_fit) el.style.objectFit = args.object_fit;
                // Custom doc: museum_entry has "position_and_size=fullscreen"
                if (args.position_and_size === "fullscreen") {
                    args.size_x = "100%"; args.size_y = "100%";
                    args.pos_x = 0; args.pos_y = 0;
                    args.anchor_x = 0; args.anchor_y = 0;
                }
                this.applyGeometry(el, args);

                this.elements[id] = el;
                this.container.appendChild(el);
                break;
            }
            case "add_text": {
                const el = document.createElement("div");
                const id = args.id;

                el.className = "to_translate";
                ['en', 'fr'].forEach(lang => {
                    const txt = this.evaluateString(args["text_" + lang] || args["text"]);
                    if (txt) el.dataset["translation_" + lang] = txt;
                });
                el.innerHTML = this.evaluateString(this.getLangArg(args, "text"));

                if (args.color) el.style.color = args.color;
                if (args.font_size) el.style.fontSize = args.font_size + "px";
                if (args.align_h) el.style.textAlign = args.align_h === "center" ? "center" : (args.align_h === "right" ? "right" : "left");

                if (args.wrap !== undefined) {
                    el.style.whiteSpace = args.wrap === false ? "nowrap" : "normal";
                }

                this.applyGeometry(el, args);

                this.elements[id] = el;
                this.container.appendChild(el);
                break;
            }
            case "add_button": {
                const el = document.createElement("button");
                const id = args.id;

                el.className = "to_translate";
                ['en', 'fr'].forEach(lang => {
                    const txt = this.evaluateString(args["text_" + lang] || args["text"]);
                    if (txt) el.dataset["translation_" + lang] = txt;
                });
                el.innerHTML = this.evaluateString(this.getLangArg(args, "text"));

                el.style.backgroundColor = args.color || "rgba(255,255,255,0.2)";
                el.style.color = args.text_color || "white";
                el.style.padding = "10px 20px";
                el.style.border = "1px solid white";
                el.style.cursor = "pointer";
                el.style.borderRadius = "8px";
                el.style.pointerEvents = "auto";
                el.style.zIndex = "2000";

                if (args.font_size) el.style.fontSize = args.font_size + "px";

                this.applyGeometry(el, args);

                el.addEventListener("click", (e) => {
                    e.stopPropagation(); // prevent bubbling to the pause() click handler
                    if (args.action === "jump" && args.target) {
                        this.jumpTo(args.target, false).catch(console.error);
                    } else if (args.action === "clear_var" && args.var_name) {
                        window.localStorage.removeItem("nascene_" + args.var_name);
                        delete this.vars[args.var_name];
                        if (args.target) this.jumpTo(args.target, false).catch(console.error);
                    }
                });

                this.elements[id] = el;
                this.container.appendChild(el);
                break;
            }
            case "save_var":
                if (args.value !== undefined) {
                    this.vars[args.var_name] = args.value;
                }
                window.localStorage.setItem("nascene_" + args.var_name, this.vars[args.var_name]);
                break;
            case "clear_var":
                window.localStorage.removeItem("nascene_" + args.var_name);
                delete this.vars[args.var_name];
                break;
            case "load_var":
                let item = window.localStorage.getItem("nascene_" + args.var_name);
                if (item === null) {
                    this.vars[args.var_name] = args.default_value;
                } else {
                    if (args.type === "bool") this.vars[args.var_name] = (item === "true");
                    else if (args.type === "int") this.vars[args.var_name] = parseInt(item);
                    else if (args.type === "float") this.vars[args.var_name] = parseFloat(item);
                    else this.vars[args.var_name] = item;
                }
                break;
            case "if": {
                const cond = this.vars[args.cond_var_name];
                const sceneStr = cond ? args.true_scene_name : args.false_scene_name;
                if (sceneStr && sceneStr !== '""' && sceneStr !== '') {
                    await this.jumpTo(this.evaluateString(sceneStr));
                }
                break;
            }
            case "goto": {
                if (args.scene_name) {
                    await this.jumpTo(this.evaluateString(args.scene_name));
                }
                break;
            }
            case "pause": {
                return new Promise(resolve => {
                    this.resolvePause = resolve;
                    const clickHandler = () => {
                        this.container.removeEventListener('click', clickHandler);
                        this.resolvePause = null;
                        resolve();
                    };
                    this.container.addEventListener('click', clickHandler);
                });
            }
            case "end": {
                // Stop VM execution
                throw new Error("NaScene_End");
            }
            // Add Visual Novel Bar commands
            case "bar_show": {
                if (!this.vnBar) {
                    this.vnBar = document.createElement("div");
                    this.vnBar.className = "nascene-vn-bar";
                    this.vnBar.style.position = "absolute";
                    this.vnBar.style.bottom = "0";
                    this.vnBar.style.width = "100%";
                    this.vnBar.style.height = "25%";
                    this.vnBar.style.backgroundColor = "rgba(0,0,0,0.7)";
                    this.vnBar.style.color = "white";
                    this.vnBar.style.padding = "20px";
                    this.vnBar.style.boxSizing = "border-box";
                    this.vnBar.style.zIndex = "1000";
                    this.container.appendChild(this.vnBar);

                    this.vnBarText = document.createElement("div");
                    this.vnBarText.className = "nascene-vn-text";
                    this.vnBar.appendChild(this.vnBarText);
                }
                this.vnBar.style.display = "block";
                break;
            }
            case "bar_clear": {
                if (this.vnBarText) this.vnBarText.innerHTML = "";
                break;
            }
            case "bar_append_text": {
                if (this.vnBarText) {
                    const span = document.createElement("span");
                    span.className = "to_translate";
                    ['en', 'fr'].forEach(lang => {
                        const txt = this.evaluateString(args["text_" + lang] || args["text"]);
                        if (txt) span.dataset["translation_" + lang] = txt;
                    });
                    span.innerHTML = this.evaluateString(this.getLangArg(args, "text"));
                    this.vnBarText.appendChild(span);
                    this.vnBarText.appendChild(document.createElement("br"));
                }
                break;
            }
            // To be implemented: more commands...
        }
    }

    async playScene(sceneId, expectedRunId) {
        const sceneCommands = this.scenes[sceneId];
        if (!sceneCommands) return;

        for (let i = 0; i < sceneCommands.length; i++) {
            if (this.runId !== expectedRunId) break;
            try {
                await this.executeCommand(sceneCommands[i]);
            } catch (e) {
                if (e.message === "NaScene_End" || e.message === "NaScene_Jump") {
                    break;
                }
                console.error("Error executing command:", sceneCommands[i], e);
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const containers = document.querySelectorAll(".nascene-container");
    containers.forEach(container => {
        new NaSceneEngine(container);
    });
});

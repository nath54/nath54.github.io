/**
 * NaScene Engine for NaCode (WebJS)
 * Integrated with NApp Reactive Buffer and GS Services.
 */

class NaSceneEngine {
    constructor(container, options = {}) {
        this.container = container;
        this.app = window.NApp;

        // Data comes from the manifest or pre-loaded IR data
        this.scenes = options.scenes || {};
        this.manifest = options.manifest || {};

        // State variables are mirrored from NApp.buffer
        this.vars = this.app.buffer;

        // System variables
        this.sysVars = {
            get aspect_ratio() { return container.clientWidth / (container.clientHeight || 1); },
            get is_portrait() { return container.clientWidth < container.clientHeight; },
            get is_landscape() { return container.clientWidth >= container.clientHeight; }
        };

        this.elements = {}; // id -> DOM element
        this.runId = 0;
        this.resolvePause = null;

        this._setupContainer();
    }

    _setupContainer() {
        if (window.getComputedStyle(this.container).position === "static") {
            this.container.style.position = "relative";
        }
        this.container.style.overflow = "hidden";
        this.container.classList.add("nascene-runtime-active");
    }

    async start(sceneId) {
        let currentRunId = ++this.runId;
        await this.playScene(sceneId, currentRunId);
    }

    evaluateString(str) {
        if (typeof str !== 'string') return String(str);
        // Replace $var_name with values from this.vars (Reactive Buffer)
        return str.replace(/\$(\w+)/g, (match, varName) => {
            if (this.vars[varName] !== undefined) return this.vars[varName];
            if (this.sysVars[varName] !== undefined) return this.sysVars[varName];
            return match;
        });
    }

    async executeCommand(cmd) {
        const { command, args } = cmd;
        const self = this;

        // Pre-evaluate common geometry args
        const evalGeom = (name, def) => args[name] !== undefined ? args[name] : def;

        switch (command) {
            case "clear":
                this.container.innerHTML = "";
                this.elements = {};
                break;

            case "add_image": {
                const el = document.createElement("img");
                el.src = this.evaluateString(args.src);
                el.style.objectFit = args.object_fit || "cover";
                this._applyGeometry(el, args);
                this.container.appendChild(el);
                if (args.id) this.elements[args.id] = el;
                break;
            }

            case "add_text": {
                const el = document.createElement("div");
                el.innerHTML = this.evaluateString(args.text);
                if (args.color) el.style.color = args.color;
                if (args.font_size) el.style.fontSize = args.font_size + "px";
                this._applyGeometry(el, args);
                this.container.appendChild(el);
                if (args.id) this.elements[args.id] = el;
                break;
            }

            case "add_choice": {
                const el = document.createElement("button");
                el.innerHTML = this.evaluateString(args.text || "Choice");
                el.className = "nascene-choice-button";

                // Styling handled by base_styles.css or inline
                Object.assign(el.style, {
                    backgroundColor: "rgba(40, 40, 40, 0.8)",
                    color: "white",
                    border: "1px solid #777",
                    borderRadius: "4px",
                    padding: "8px",
                    cursor: "pointer"
                });

                el.onclick = () => {
                    this.start(args.target);
                };

                this._applyGeometry(el, args);
                this.container.appendChild(el);
                if (args.id) this.elements[args.id] = el;
                break;
            }

            case "set_var_int":
            case "set_var_str":
            case "set_var_bool":
            case "set_var_float":
                this.vars[args.var_name] = args.value;
                break;

            case "pause":
                return new Promise(resolve => {
                    const handler = () => {
                        this.container.removeEventListener("click", handler);
                        resolve();
                    };
                    this.container.addEventListener("click", handler);
                });

            case "jump":
                await this.start(args.target);
                throw new Error("NaScene_Interrupt");

            case "end":
                throw new Error("NaScene_End");
        }
    }

    _applyGeometry(el, args) {
        el.style.position = "absolute";
        el.style.width = args.size_x || "auto";
        el.style.height = args.size_y || "auto";
        el.style.left = (args.pos_x * 100) + "%";
        el.style.top = (args.pos_y * 100) + "%";

        const ax = args.anchor_x !== undefined ? args.anchor_x : 0;
        const ay = args.anchor_y !== undefined ? args.anchor_y : 0;
        const sx = args.scale_x !== undefined ? args.scale_x : 1;
        const sy = args.scale_y !== undefined ? args.scale_y : 1;
        const rot = args.rotation || 0;

        el.style.transform = `translate(-${ax * 100}%, -${ay * 100}%) scale(${sx}, ${sy}) rotate(${rot}deg)`;
        if (args.opacity !== undefined) el.style.opacity = args.opacity;
    }

    async playScene(sceneId, runId) {
        const cmds = this.scenes[sceneId];
        if (!cmds) return;

        for (const cmd of cmds) {
            if (this.runId !== runId) break;
            try {
                await this.executeCommand(cmd);
            } catch (e) {
                if (e.message === "NaScene_Interrupt" || e.message === "NaScene_End") break;
                console.error("NaScene Error:", e);
            }
        }
    }
}

window.NaSceneEngine = NaSceneEngine;

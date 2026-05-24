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
        this.baseData = options.baseData || (window.buffer ? window.buffer.data : {});

        // State variables are mirrored from NApp.buffer (Reactive Buffer)
        this.vars = window.buffer || {};

        // System variables
        this.sysVars = {
            get aspect_ratio() { return container.clientWidth / (container.clientHeight || 1); },
            get is_portrait() { return container.clientWidth < container.clientHeight; },
            get is_landscape() { return container.clientWidth >= container.clientHeight; }
        };

        this.elements = {}; // id -> DOM element
        this.runId = 0;
        this.resolvePause = null;
        this.bar = null;
        this.barText = null;

        this._setupContainer();
    }

    _setupContainer() {
        if (window.getComputedStyle(this.container).position === "static") {
            this.container.style.position = "relative";
        }
        this.container.style.overflow = "hidden";
        this.container.classList.add("nascene-container");
        this.container.classList.add("nascene-runtime-active");

        // Add click listener for pause/next
        this.container.addEventListener("click", () => {
            if (this.resolvePause) {
                const res = this.resolvePause;
                this.resolvePause = null;
                res();
            }
        });
    }

    async loadManifest() {
        if (this.manifest && this.manifest.landing_place) {
            // landing_place format: nascene_root:/path/to/file.nascene:scene_id
            const lastColon = this.manifest.landing_place.lastIndexOf(":");
            if (lastColon !== -1) {
                const fullPath = this.manifest.landing_place.substring(0, lastColon);
                const startScene = this.manifest.landing_place.substring(lastColon + 1);
                
                const rawPath = fullPath.replace("nascene_root:", "");
                // Resolve path to data key (e.g. /dir/file.nascene -> dir.file)
                const dataKey = rawPath.replace(".nascene", "").replace(/^\//, "").replace(/\//g, ".");

                // Navigate through baseData or window.buffer.data to find the scenes
                let current = this.baseData || window.buffer.data;
                const pathParts = dataKey.split(".");
                for (const p of pathParts) {
                    if (current[p]) {
                        current = current[p];
                    } else {
                        break;
                    }
                }

                this.scenes = current;
                await this.start(startScene);
            }
        }
    }

    async start(sceneId) {
        let currentRunId = ++this.runId;
        await this.playScene(sceneId, currentRunId);
    }

    evaluateString(str) {
        if (typeof str !== 'string') return String(str);

        // Handle bilingual objects or simple strings
        const currentLang = (this.app && this.app.state && this.app.state.language) || "en";

        // Replace $var_name with values from this.vars
        return str.replace(/\$(\w+)/g, (match, varName) => {
            // Check state/buffer
            if (window.buffer && window.buffer[varName] !== undefined) return window.buffer[varName];
            if (this.sysVars[varName] !== undefined) return this.sysVars[varName];
            return match;
        });
    }

    _ensureBar() {
        if (this.bar) return;
        this.bar = document.createElement("div");
        this.bar.className = "nascene-bar";
        this.barText = document.createElement("div");
        this.barText.className = "nascene-bar-text";
        this.bar.appendChild(this.barText);
        this.container.appendChild(this.bar);
    }

    async executeCommand(cmd) {
        const { command, args } = cmd;
        const currentLang = (window.buffer && window.buffer.language) || "en";

        switch (command) {
            case "clear":
                this.container.innerHTML = "";
                this.elements = {};
                this.bar = null;
                break;

            case "bar_show":
                this._ensureBar();
                this.bar.classList.remove("hidden");
                break;

            case "bar_hide":
                if (this.bar) this.bar.classList.add("hidden");
                break;

            case "bar_clear":
                if (this.barText) this.barText.innerHTML = "";
                break;

            case "bar_append_text": {
                this._ensureBar();
                const text = args[`text_${currentLang}`] || args.text || "";
                this.barText.innerHTML += this.evaluateString(text);
                break;
            }

            case "add_image": {
                const el = document.createElement("img");
                el.src = this.evaluateString(args.src);
                el.style.objectFit = args.object_fit || "cover";

                if (args.position_and_size === "fullscreen") {
                    Object.assign(el.style, {
                        position: "absolute",
                        top: 0, left: 0, width: "100%", height: "100%"
                    });
                } else {
                    this._applyGeometry(el, args);
                }

                this.container.appendChild(el);
                if (args.id) this.elements[args.id] = el;
                break;
            }

            case "add_text": {
                const el = document.createElement("div");
                const text = args[`text_${currentLang}`] || args.text || "";
                el.innerHTML = this.evaluateString(text);
                if (args.color) el.style.color = args.color;
                if (args.font_size) el.style.fontSize = args.font_size + "px";
                this._applyGeometry(el, args);
                this.container.appendChild(el);
                if (args.id) this.elements[args.id] = el;
                break;
            }

            case "add_choice":
            case "add_button": {
                const el = document.createElement("button");
                const text = args[`text_${currentLang}`] || args.text || "Choice";
                el.innerHTML = this.evaluateString(text);
                el.className = "nascene-button";

                el.onclick = (e) => {
                    e.stopPropagation();
                    const target = args.target || args.scene_name;
                    if (target) this.start(target);
                };

                this._applyGeometry(el, args);
                this.container.appendChild(el);
                if (args.id) this.elements[args.id] = el;
                break;
            }

            case "load_var":
                if (window.buffer[args.var_name] === undefined) {
                    window.buffer[args.var_name] = args.default_value;
                }
                break;

            case "save_var":
            case "set_var_int":
            case "set_var_str":
            case "set_var_bool":
                window.buffer[args.var_name] = args.value;
                break;

            case "clear_var":
                delete window.buffer[args.var_name];
                break;

            case "if": {
                const val = window.buffer[args.cond_var_name];
                const target = val ? args.true_scene_name : args.false_scene_name;
                if (target) {
                    await this.start(target);
                    throw new Error("NaScene_Interrupt");
                }
                break;
            }

            case "pause":
                return new Promise(resolve => {
                    this.resolvePause = resolve;
                });

            case "goto":
            case "jump":
                await this.start(args.target || args.scene_name);
                throw new Error("NaScene_Interrupt");

            case "end":
                throw new Error("NaScene_End");
        }
    }

    _applyGeometry(el, args) {
        el.style.position = "absolute";
        el.style.width = args.size_x || "auto";
        el.style.height = args.size_y || "auto";

        if (args.pos_x !== undefined) el.style.left = (args.pos_x * 100) + "%";
        if (args.pos_y !== undefined) el.style.top = (args.pos_y * 100) + "%";

        const ax = args.anchor_x !== undefined ? args.anchor_x : 0;
        const ay = args.anchor_y !== undefined ? args.anchor_y : 0;
        const sx = args.scale_x !== undefined ? args.scale_x : 1;
        const sy = args.scale_y !== undefined ? args.scale_y : 1;
        const rot = args.rotation || 0;

        el.style.transform = `translate(-${ax * 100}%, -${ay * 100}%) scale(${sx}, ${sy}) rotate(${rot}deg)`;
        if (args.opacity !== undefined) el.style.opacity = args.opacity;
    }

    async playScene(sceneId, runId) {
        const cmds = this.scenes && this.scenes[sceneId];
        if (!cmds) {
            console.error(`[NaScene] Scene not found: ${sceneId}`);
            return;
        }

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

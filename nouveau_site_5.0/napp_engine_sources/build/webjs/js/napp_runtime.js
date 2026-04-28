window.gs = window.gs || {};
window.NApp = {
    // Global Buffer (Persistent State) - data is stored here
    _data: {},

    // Reactive Buffer Proxy
    buffer: null,

    // UI Binding Map (property_path -> list of update functions)
    bindings: new Map(),

    /**
     * Initializes the GlobalBuffer with nested reactive capabilities.
     * config: { storage: { mode: 'local'|'immutable', id: 'napp_xxx' } }
     */
    init(initialState = {}, config = {}) {
        this.config = config;
        this._data = initialState;

        // Flatten 'state' into the root for legacy compatibility (Stage 6.1)
        if (initialState.state) {
            for (const key in initialState.state) {
                this._data[key] = initialState.state[key];
            }
        }

        // History Management
        this._history = [];
        this._redoStack = [];
        this._inHistoryMove = false;

        // Handle Persistence (Stage 6)
        if (config.storage && config.storage.mode === 'local') {
            this._loadLocal();
        }

        this.buffer = this._createReactive(this._data);
        // Expose buffer globally for NaCode logic
        window.buffer = this.buffer;

        // Expose state roots globally on window for transparent access
        for (const key in this._data) {
            Object.defineProperty(window, key, {
                get: () => this.buffer[key],
                set: (val) => { this.buffer[key] = val; },
                configurable: true
            });
        }
        console.log(`[NApp] Runtime Initialized (${config.storage?.mode || 'memory'})`);
        console.log(`[NApp] Initial data:`, this._data);
    },

    _loadLocal() {
        const key = this.config.storage.id;
        try {
            const saved = localStorage.getItem(key);
            if (saved) {
                const localData = JSON.parse(saved);
                // Non-destructive merge (Structural Grafting)
                // We keep local values but add new keys from seed
                this._merge(this._data, localData);
                console.log("[NApp] Persistent state loaded from localStorage");
            }
        } catch (e) {
            console.error("[NApp] Failed to load local storage:", e);
        }
    },

    _saveLocal() {
        if (this.config.storage && this.config.storage.mode === 'local') {
            const key = this.config.storage.id;
            localStorage.setItem(key, JSON.stringify(this._data));
        }
    },

    _merge(target, source) {
        for (const key in source) {
            if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                if (!target[key]) target[key] = {};
                this._merge(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
    },

    /**
     * Creates a recursive Proxy to handle nested property changes.
     */
    _createReactive(obj, path = []) {
        const self = this;
        return new Proxy(obj, {
            get(target, prop) {
                const val = target[prop];
                if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
                    return self._createReactive(val, [...path, prop]);
                }
                return val;
            },
            set(target, prop, value) {
                if (target[prop] === value) return true;

                // Mirror root properties to window for transparent global access (Stage 6.2)
                if (path.length === 0 && !(prop in window)) {
                    Object.defineProperty(window, prop, {
                        get: () => self.buffer[prop],
                        set: (val) => { self.buffer[prop] = val; },
                        configurable: true
                    });
                }

                const fullPath = [...path, prop].join('.');
                const oldVal = target[prop];

                target[prop] = value;

                // Record history (if not in undo/redo)
                if (!self._inHistoryMove) {
                    self._history.push({ path: fullPath, old: oldVal, new: value });
                    self._redoStack = [];
                }

                self._notify(fullPath, value);

                // Persistence Sync
                self._saveLocal();

                return true;
            }
        });
    },

    /**
     * Subscribes a callback to a buffer property change (e.g., 'user.name').
     */
    subscribe(propPath, callback) {
        if (!this.bindings.has(propPath)) {
            this.bindings.set(propPath, []);
        }
        this.bindings.get(propPath).push(callback);
    },

    _notify(propPath, value) {
        // Notify the exact path
        this._trigger(propPath, value);
        console.log(`[NApp] Property changed: ${propPath}`, value);

        // Notify parent paths (e.g., if 'user.name' changed, 'user' also changed)
        const parts = propPath.split('.');
        while (parts.length > 1) {
            parts.pop();
            const parentPath = parts.join('.');
            this._trigger(parentPath, this._getDeep(this._data, parentPath));
        }

        // Notify global subscribers (e.g., for conditionals without explicit deps)
        if (this._globalSubscribers) {
            this._globalSubscribers.forEach(cb => cb());
        }
    },

    navigate: (page) => {
        // Save current page to history before navigating
        try {
            const history = JSON.parse(sessionStorage.getItem('napp_history') || '[]');
            const currentPath = window.location.pathname;
            
            // Only push if it's a new page entry
            const lastEntry = history[history.length - 1];
            if (!lastEntry || lastEntry.page !== currentPath) {
                history.push({ type: 'page', page: currentPath, timestamp: Date.now() });
                if (history.length > 50) history.shift();
                sessionStorage.setItem('napp_history', JSON.stringify(history));
            }
        } catch (e) {
            console.warn("[NApp] History tracking failed:", e);
        }
        
        window.location.href = page;
    },

    recordAction: (label) => {
        try {
            const history = JSON.parse(sessionStorage.getItem('napp_history') || '[]');
            history.push({ type: 'action', label: label, timestamp: Date.now() });
            if (history.length > 50) history.shift();
            sessionStorage.setItem('napp_history', JSON.stringify(history));
            console.log(`[NApp] Action recorded: ${label}`);
        } catch (e) { }
    },

    back: () => {
        try {
            const history = JSON.parse(sessionStorage.getItem('napp_history') || '[]');
            if (history.length > 0) {
                const last = history.pop();
                sessionStorage.setItem('napp_history', JSON.stringify(history));
                
                if (last.type === 'page') {
                    const currentPath = window.location.pathname;
                    if (last.page === currentPath && history.length > 0) {
                        return window.NApp.back();
                    }
                    window.location.href = last.page;
                    return;
                } else if (last.type === 'action') {
                    return window.NApp.back();
                }
            }
        } catch (e) {
            console.warn("[NApp] Back navigation failed:", e);
        }
        
        // Final fallback: use relative path to index
        const currentPath = window.location.pathname;
        const segments = currentPath.split(/[\\\/]/);
        const pagesIdx = segments.indexOf('pages');
        if (pagesIdx !== -1) {
            const depth = segments.length - pagesIdx - 1;
            window.location.href = '../'.repeat(depth) + 'index.html';
        } else if (currentPath.endsWith('index.html') || currentPath.endsWith('/')) {
            // Already at index, nothing to do
        } else {
            window.location.href = 'index.html';
        }
    },

    /**
     * Toggles the visibility of an expandable node.
     * @param {HTMLElement} header - The header element that was clicked.
     */
    toggleExpandable: (header) => {
        const parent = header.parentElement;
        const isOpening = !parent.open;
        if (isOpening) {
            const title = header.textContent.trim();
            window.NApp.recordAction(`Expand: ${title}`);
        }
    },

    _trigger(path, value) {
        if (this.bindings.has(path)) {
            this.bindings.get(path).forEach(callback => {
                try {
                    callback(value);
                } catch (e) {
                    console.error(`[NApp] Update failed for ${path}:`, e);
                }
            });
        }
    },

    _getDeep(obj, path) {
        if (!path || path === 'null') return undefined;
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    },

    /**
     * Helper to bind an element's text content to a buffer property.
     */
    bindText(elementId, propPath) {
        const update = (value) => {
            const el = document.getElementById(elementId);
            if (el) el.innerHTML = value;
        };
        this.subscribe(propPath, update);
        // Initial value
        update(this._getDeep(this._data, propPath));
    },

    /**
     * Binds a collection to a container using a template function.
     */
    bindRepeat(containerId, collectionPath, templateFn) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const update = (list) => {
            if (!Array.isArray(list)) {
                console.warn(`[NApp] bindRepeat(${containerId}): data is not an array`, list);
                return;
            }
            console.log(`[NApp] bindRepeat(${containerId}) updating with ${list.length} items`);
            const html = list.map((item, index) => {
                const fragment = templateFn(item, index);
                console.log(`[NApp]   Item ${index} fragment length: ${fragment.length}`);
                return fragment;
            }).join('');
            container.innerHTML = html;
        };

        // Handle literal JSON lists (Stage 6 Static Unrolling)
        if (collectionPath && collectionPath.startsWith('[')) {
            try {
                const list = JSON.parse(collectionPath);
                update(list);
                return;
            } catch (e) {
                console.warn("[NApp] bindRepeat: invalid literal list:", e);
            }
        }

        this.subscribe(collectionPath, update);
        this.subscribe('state.language', update);
        this.subscribe('language', update); // Support both paths
        // Initial render
        update(this._getDeep(this._data, collectionPath));
    },

    /**
     * Helper to bind an element's text content to a dynamic template.
     * dependencies: array of property paths to watch
     * templateFn: function that returns the formatted string
     */
    bindTemplate(elementId, dependencies, templateFn) {
        const update = () => {
            const el = document.getElementById(elementId);
            if (el) el.innerHTML = templateFn();
        };

        dependencies.forEach(path => this.subscribe(path, update));
        this.subscribe('state.language', update);
        this.subscribe('language', update);
        // Initial render
        update();
    },

    /**
     * Helper to bind an element's visibility/content to a condition.
     */
    bindConditional(elementId, conditionFn, thenFn, elseFn) {
        const update = () => {
            const el = document.getElementById(elementId);
            if (!el) return;
            const res = conditionFn();
            const html = res ? thenFn() : (elseFn ? elseFn() : "");
            console.log(`[NApp] bindConditional(${elementId}) result: ${res}, HTML length: ${html.length}`);
            el.innerHTML = html;
        };

        // This is a bit complex as we don't know the dependencies of conditionFn.
        // For now, we subscribe to ALL changes, or the generator could pass them.
        // Stage 6 Improvement: Use a global observer or pass deps.
        // For now, we'll just subscribe to the whole state for simplicity if needed,
        // or rely on the fact that most conditions use observable properties.
        // Actually, we can just use a timer or hook into NApp._notify.

        // Better: The generator should analyze deps.
        // For now, we'll hook it into the global notify for any change.
        this._globalSubscribers = this._globalSubscribers || [];
        this._globalSubscribers.push(update);

        // Initial render
        update();
    },

    /**
     * Helper to bind an input element's value (two-way binding).
     */
    bindInput(elementId, propPath) {
        const el = document.getElementById(elementId);
        if (!el) return;

        // Forward: State -> Input
        const update = (value) => {
            if (el.value !== String(value)) {
                el.value = value;
            }
        };
        this.subscribe(propPath, update);

        // Initial value
        update(this._getDeep(this._data, propPath));

        // Reverse: Input -> State
        el.addEventListener('input', (e) => {
            // Split path and update recursively (via proxy)
            const parts = propPath.split('.');
            let target = this.buffer;
            for (let i = 0; i < parts.length - 1; i++) {
                target = target[parts[i]];
            }
            target[parts[parts.length - 1]] = e.target.value;
        });
    },

    /**
     * Initializes a random widget that fetches a manifest and displays a random item.
     */
    initRandomWidget(elementId, source, containerClass, templateHtml) {
        const container = document.getElementById(elementId);
        if (!container) return;

        const refresh = async () => {
            try {
                const response = await fetch(source);
                const data = await response.json();
                let items = Array.isArray(data) ? data : data.items;
                if (!items && typeof data === 'object') items = Object.values(data);

                if (items && items.length > 0) {
                    let item = items[Math.floor(Math.random() * items.length)];

                    // If the item is a string, assume it's a file path to the actual data list
                    if (typeof item === 'string') {
                        const sourceDir = source.substring(0, source.lastIndexOf('/') + 1);
                        const subUrl = sourceDir + item;
                        const subRes = await fetch(subUrl);
                        const subData = await subRes.json();
                        let subItems = Array.isArray(subData) ? subData : subData.items;
                        if (!subItems && typeof subData === 'object') subItems = Object.values(subData);

                        if (subItems && subItems.length > 0) {
                            item = subItems[Math.floor(Math.random() * subItems.length)];
                        } else {
                            throw new Error("Sub-manifest empty or invalid");
                        }
                    }

                    // Simple substitution in template
                    let html = templateHtml;
                    for (const key in item) {
                        const regex = new RegExp(`\\{${key}\\}`, 'g');
                        html = html.replace(regex, item[key]);
                    }
                    container.innerHTML = `<div class="${containerClass}">${html}</div>`;
                }
            } catch (e) {
                console.error("[NApp] Random widget failed:", e);
            }
        };

        refresh();
        // Expose refresh to gs
        if (!window.gs.refresh_target) window.gs.refresh_target = {};
        window.gs.refresh_target[elementId] = refresh;
    },

    undo() {
        if (this._history.length === 0) return;
        const last = this._history.pop();
        this._redoStack.push({ ...last, new: this._getDeep(this._data, last.path) });
        this._inHistoryMove = true;
        this._setDeep(this.buffer, last.path, last.old);
        this._inHistoryMove = false;
    },

    redo() {
        if (this._redoStack.length === 0) return;
        const last = this._redoStack.pop();
        this._history.push({ ...last, old: this._getDeep(this._data, last.path) });
        this._inHistoryMove = true;
        this._setDeep(this.buffer, last.path, last.new);
        this._inHistoryMove = false;
    },

    _setDeep(obj, path, value) {
        const parts = path.split('.');
        let curr = obj;
        for (let i = 0; i < parts.length - 1; i++) {
            curr = curr[parts[i]];
        }
        curr[parts[parts.length - 1]] = value;
    },

    terminal: {
        container: null,
        output: null,
        inputField: null,
        resolveInput: null,

        mount(containerId) {
            this.container = document.getElementById(containerId);
            if (!this.container) return;
            // Register this terminal instance globally
            window.NApp.terminals[containerId] = this;

            this.container.classList.add('napp-terminal-active');
            this.container.innerHTML = `
                <div class="terminal-output" style="flex: 1; overflow-y: auto; white-space: pre-wrap; font-family: 'JetBrains Mono', 'Consolas', monospace; padding: 20px; color: #e0e0e0; font-size: 14px; line-height: 1.5;"></div>
                <div class="terminal-input-line" style="display: flex; align-items: center; padding: 10px 20px; background: #1a1a1a; border-top: 1px solid #333;">
                    <span class="terminal-prompt" style="color: #50fa7b; margin-right: 10px; font-weight: bold;">&gt;</span>
                    <input type="text" class="terminal-input" style="flex: 1; background: transparent; border: none; color: #f8f8f2; outline: none; font-family: 'JetBrains Mono', 'Consolas', monospace; font-size: 14px;" autofocus>
                </div>
            `;
            this.output = this.container.querySelector('.terminal-output');
            this.inputField = this.container.querySelector('.terminal-input');

            this.inputField.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && this.resolveInput) {
                    const val = this.inputField.value;
                    this.print(val, 'terminal-user-input');
                    this.inputField.value = '';
                    const resolve = this.resolveInput;
                    this.resolveInput = null;
                    resolve(val);
                }
            });

            // Focus input on click anywhere in terminal
            this.container.addEventListener('click', () => this.inputField.focus());
        },

        print(text, className = '') {
            if (!this.output) return;
            const line = document.createElement('div');
            if (className) line.classList.add(className);
            line.textContent = String(text);

            // Basic support for color codes or style classes
            if (className === 'terminal-error') line.style.color = '#ff5555';
            if (className === 'terminal-user-input') line.style.color = '#8be9fd';

            this.output.appendChild(line);
            this.output.scrollTop = this.output.scrollHeight;
        },

        print_err(text) {
            this.print(text, 'terminal-error');
        },

        async input(prompt) {
            if (prompt) this.print(prompt);
            this.inputField.focus();
            return new Promise(resolve => {
                this.resolveInput = resolve;
            });
        },

        async input_int(prompt) {
            const val = await this.input(prompt);
            return parseInt(val) || 0;
        }
    },
    terminals: {}
};

/**
 * Global System (gs) Implementation
 */
window.gs = {
    _args: (args, ...keys) => {
        if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && !Array.isArray(args[0])) {
            const obj = args[0];
            // Check if it looks like named args (contains at least one expected key)
            if (keys.some(k => k in obj)) {
                return keys.map(k => obj[k]);
            }
        }
        return args;
    },

    log: (...args) => console.log("[NaCode]", ...args),
    canvases: {},
    terminals: {},
    refresh_target: {},

    refresh_widget: (...args) => {
        const [targetId] = window.gs._args(args, "target");
        if (window.gs.refresh_target[targetId]) {
            window.gs.refresh_target[targetId]();
        }
    },

    print: (...args) => {
        const [text, terminal_id] = window.gs._args(args, "text", "terminal_id");

        // Build final message from positional args and keyword 'text'
        let msg = args.filter(a => typeof a !== 'object' || a === null).map(String).join(' ');
        if (text !== undefined && text !== null) {
            msg = msg ? `${msg} ${text}` : String(text);
        }

        // ALWAYS log to browser console for debugging
        console.log(`[NaCode] ${msg}`);

        // Route to specific terminal or default
        if (terminal_id && window.NApp.terminals[terminal_id]) {
            window.NApp.terminals[terminal_id].print(msg);
        } else if (window.NApp.terminal && window.NApp.terminal.output) {
            window.NApp.terminal.print(msg);
        }
    },

    print_err: (text) => window.NApp.terminal.print_err(text),
    input: async (prompt) => await window.NApp.terminal.input(prompt),
    input_int: async (prompt) => await window.NApp.terminal.input_int(prompt),
    input_float: async (prompt) => {
        const val = await window.NApp.terminal.input(prompt);
        return parseFloat(val) || 0.0;
    },

    // --- Variable Manipulation ---

    var_decl: (...args) => {
        const [name, value] = window.gs._args(args, "name", "value");
        window.NApp._setDeep(window.NApp.buffer, name, value);
    },

    var_set: (...args) => {
        const [name, value] = window.gs._args(args, "name", "value");
        window.NApp._setDeep(window.NApp.buffer, name, value);
    },

    var_get: (...args) => {
        const [name, defaultValue] = window.gs._args(args, "name", "default_value");
        const val = window.NApp._getDeep(window.NApp._data, name);
        return val !== undefined && val !== null ? val : (defaultValue !== undefined ? defaultValue : null);
    },

    var_del: (...args) => {
        const [name] = window.gs._args(args, "name");
        window.NApp._setDeep(window.NApp.buffer, name, null);
    },

    // --- List Manipulation ---

    list_decl: (...args) => {
        const [name, value] = window.gs._args(args, "name", "value");
        window.gs.var_decl(name, [...value]);
    },

    list_set: (...args) => {
        const [name, value] = window.gs._args(args, "name", "value");
        window.gs.var_set(name, [...value]);
    },

    list_get: (...args) => {
        const [name, defaultValue] = window.gs._args(args, "name", "default_value");
        return window.gs.var_get(name, defaultValue || []);
    },

    list_len: (...args) => {
        const [name] = window.gs._args(args, "name");
        const lst = window.gs.list_get(name);
        return Array.isArray(lst) ? lst.length : 0;
    },

    list_append: (...args) => {
        const [name, value] = window.gs._args(args, "name", "value");
        const lst = [...window.gs.list_get(name)];
        lst.push(value);
        window.gs.list_set(name, lst);
    },

    list_pop: (...args) => {
        const [name, idx] = window.gs._args(args, "name", "idx");
        const actualIdx = (idx === undefined || idx === -1) ? -1 : idx;
        const lst = [...window.gs.list_get(name)];
        if (lst.length === 0) return null;
        const targetIdx = actualIdx === -1 ? lst.length - 1 : actualIdx;
        if (targetIdx >= 0 && targetIdx < lst.length) {
            const val = lst.splice(targetIdx, 1)[0];
            window.gs.list_set(name, lst);
            return val;
        }
        return null;
    },

    list_get_item: (...args) => {
        const [name, idx] = window.gs._args(args, "name", "idx");
        const lst = window.gs.list_get(name);
        return (idx >= 0 && idx < lst.length) ? lst[idx] : null;
    },

    list_insert: (...args) => {
        const [name, idx, value] = window.gs._args(args, "name", "idx", "value");
        const lst = [...window.gs.list_get(name)];
        lst.splice(idx, 0, value);
        window.gs.list_set(name, lst);
    },

    list_remove_by_idx: (...args) => {
        const [name, idx] = window.gs._args(args, "name", "idx");
        const lst = [...window.gs.list_get(name)];
        if (idx >= 0 && idx < lst.length) {
            lst.splice(idx, 1);
            window.gs.list_set(name, lst);
        }
    },

    list_clear: (...args) => {
        const [name] = window.gs._args(args, "name");
        window.gs.list_set(name, []);
    },

    // --- Dict Manipulation ---

    dict_decl: (...args) => {
        const [name, value] = window.gs._args(args, "name", "value");
        window.gs.var_decl(name, { ...value });
    },

    dict_set: (...args) => {
        const [name, value] = window.gs._args(args, "name", "value");
        window.gs.var_set(name, { ...value });
    },

    dict_get: (...args) => {
        const [name, defaultValue] = window.gs._args(args, "name", "default_value");
        return window.gs.var_get(name, defaultValue || {});
    },

    dict_set_item: (...args) => {
        const [name, key, value] = window.gs._args(args, "name", "key", "value");
        const dct = { ...window.gs.dict_get(name) };
        dct[key] = value;
        window.gs.dict_set(name, dct);
    },

    dict_get_item: (...args) => {
        const [name, key, defaultValue] = window.gs._args(args, "name", "key", "default_value");
        const dct = window.gs.dict_get(name);
        return dct.hasOwnProperty(key) ? dct[key] : (defaultValue !== undefined ? defaultValue : null);
    },

    dict_remove_item: (...args) => {
        const [name, key] = window.gs._args(args, "name", "key");
        const dct = { ...window.gs.dict_get(name) };
        if (dct.hasOwnProperty(key)) {
            delete dct[key];
            window.gs.dict_set(name, dct);
        }
    },

    dict_contains: (...args) => {
        const [name, key] = window.gs._args(args, "name", "key");
        return window.gs.dict_get(name).hasOwnProperty(key);
    },

    dict_len: (...args) => {
        const [name] = window.gs._args(args, "name");
        return Object.keys(window.gs.dict_get(name)).length;
    },

    dict_clear: (...args) => {
        const [name] = window.gs._args(args, "name");
        window.gs.dict_set(name, {});
    },

    navigate: (page) => {
        NApp.navigate(page);
    },

    shell: {
        open: (url) => window.open(url, '_blank')
    },

    io: {
        read_text: (key) => localStorage.getItem(key) || "",
        write_text: (key, content) => {
            try {
                localStorage.setItem(key, content);
                return true;
            } catch (e) {
                return false;
            }
        }
    },

    history: {
        undo: () => window.NApp.undo(),
        redo: () => window.NApp.redo()
    },

    canvas: (id) => {
        const c = window.NaCanvas.instances[id] || window.NaCanvas.get(id);
        if (!c) console.error(`[gs] Canvas "${id}" not found!`);
        return c;
    }
};

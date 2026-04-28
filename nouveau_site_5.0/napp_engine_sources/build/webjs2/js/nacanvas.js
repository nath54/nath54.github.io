/**
 * NaCanvas Engine for NaCode (WebJS)
 * Provides high-level 2D drawing and low-level WebGL triangle rendering.
 */

class NaCanvas2D {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    clear(color = "white") {
        if (typeof color === 'object' && color !== null) {
            color = color.color || "white";
        }
        console.log(`[NaCanvas2D] Clearing with ${color}`);
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw_polygon(points, color = "black", fill = true) {
        if (typeof points === 'object' && !Array.isArray(points) && points !== null) {
            const args = points;
            points = args.points;
            color = args.color || "black";
            fill = args.fill !== undefined ? args.fill : true;
        }
        if (!points || points.length < 2) return;
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x || points[0][0], points[0].y || points[0][1]);
        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x || points[i][0], points[i].y || points[i][1]);
        }
        this.ctx.closePath();
        if (fill) {
            this.ctx.fillStyle = color;
            this.ctx.fill();
        } else {
            this.ctx.strokeStyle = color;
            this.ctx.stroke();
        }
    }

    draw_ellipse(x, y, rx, ry, color = "black", fill = true) {
        if (typeof x === 'object' && x !== null) {
            const args = x;
            x = args.x;
            y = args.y;
            rx = args.rx;
            ry = args.ry;
            color = args.color || "black";
            fill = args.fill !== undefined ? args.fill : true;
        }
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, rx, ry, 0, 0, 2 * Math.PI);
        if (fill) {
            this.ctx.fillStyle = color;
            this.ctx.fill();
        } else {
            this.ctx.strokeStyle = color;
            this.ctx.stroke();
        }
    }

    draw_rounded_rect(x, y, w, h, r, color = "black", fill = true) {
        if (typeof x === 'object' && x !== null) {
            const args = x;
            x = args.x;
            y = args.y;
            w = args.w;
            h = args.h;
            r = args.r;
            color = args.color || "black";
            fill = args.fill !== undefined ? args.fill : true;
        }
        this.ctx.beginPath();
        this.ctx.roundRect(x, y, w, h, r);
        if (fill) {
            this.ctx.fillStyle = color;
            this.ctx.fill();
        } else {
            this.ctx.strokeStyle = color;
            this.ctx.stroke();
        }
    }

    draw_sprite(src, x, y, w, h) {
        if (typeof src === 'object' && src !== null) {
            const args = src;
            src = args.src;
            x = args.x;
            y = args.y;
            w = args.w;
            h = args.h;
        }
        const img = new Image();
        img.src = src;
        img.onload = () => {
            if (w && h) {
                this.ctx.drawImage(img, x, y, w, h);
            } else {
                this.ctx.drawImage(img, x, y);
            }
        };
    }
}

class NaCanvasWebGL {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!this.gl) {
            console.error("WebGL not supported");
            return;
        }

        this.programs = {};
        this.currentProgram = this._createDefaultProgram();
        this.gl.useProgram(this.currentProgram);

        // Position buffer
        this.positionBuffer = this.gl.createBuffer();
    }

    _createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error("Shader compile error:", this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    _createProgram(vsSource, fsSource) {
        const vs = this._createShader(this.gl.VERTEX_SHADER, vsSource);
        const fs = this._createShader(this.gl.FRAGMENT_SHADER, fsSource);
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vs);
        this.gl.attachShader(program, fs);
        this.gl.linkProgram(program);
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error("Program link error:", this.gl.getProgramInfoLog(program));
            return null;
        }
        return program;
    }

    _createDefaultProgram() {
        const vs = `
            attribute vec2 a_position;
            void main() {
                gl_Position = vec4(a_position, 0, 1);
            }
        `;
        const fs = `
            precision mediump float;
            uniform vec4 u_color;
            void main() {
                gl_FragColor = u_color;
            }
        `;
        return this._createProgram(vs, fs);
    }

    set_shader(vsSource, fsSource) {
        const program = this._createProgram(vsSource, fsSource);
        if (program) {
            this.currentProgram = program;
            this.gl.useProgram(program);
        }
    }

    clear(r = 1, g = 1, b = 1, a = 1) {
        this.gl.clearColor(r, g, b, a);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    draw_triangles(vertices, options = {}) {
        if (typeof vertices === 'object' && !Array.isArray(vertices) && vertices !== null) {
            const args = vertices;
            vertices = args.vertices;
            options = args; // Use the same object for options
        }
        console.log(`[NaCanvasWebGL] Drawing ${vertices.length / 2} triangles`);
        const gl = this.gl;
        gl.useProgram(this.currentProgram);

        // Bind vertices
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        const positionLoc = gl.getAttribLocation(this.currentProgram, "a_position");
        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

        // Set color uniform if it exists
        const colorLoc = gl.getUniformLocation(this.currentProgram, "u_color");
        if (colorLoc) {
            const c = options.color || [0, 0, 0, 1];
            gl.uniform4f(colorLoc, c[0], c[1], c[2], c[3] || 1);
        }

        gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
    }
}

window.NaCanvas = {
    instances: {},
    get(id, type) {
        if (this.instances[id]) return this.instances[id];
        const el = document.getElementById(id);
        if (!el || el.tagName !== 'CANVAS') return null;
        
        // Infer type from attribute if not provided
        const finalType = type || el.getAttribute('data-na-canvas-type') || '2d';
        
        const instance = finalType === 'webgl' ? new NaCanvasWebGL(el) : new NaCanvas2D(el);
        this.instances[id] = instance;
        return instance;
    }
};

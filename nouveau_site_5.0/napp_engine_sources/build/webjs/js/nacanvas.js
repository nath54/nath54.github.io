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

        // Enable depth testing for proper 3D rendering
        this.gl.enable(this.gl.DEPTH_TEST);

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
        if (typeof r === 'object' && r !== null) {
            const args = r;
            r = args.r !== undefined ? args.r : 1;
            g = args.g !== undefined ? args.g : 1;
            b = args.b !== undefined ? args.b : 1;
            a = args.a !== undefined ? args.a : 1;
        }
        this.gl.clearColor(r, g, b, a);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    draw_triangles(vertices, options = {}) {
        if (typeof vertices === 'object' && !Array.isArray(vertices) && vertices !== null) {
            const args = vertices;
            vertices = args.vertices;
            options = args; // Use the same object for options
        }
        const gl = this.gl;
        gl.useProgram(this.currentProgram);

        // Bind vertices
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        const pos3dLoc = gl.getAttribLocation(this.currentProgram, "a_pos");
        const color3dLoc = gl.getAttribLocation(this.currentProgram, "a_color");

        if (pos3dLoc !== -1) {
            // 3D interleaved mode: [x, y, z, r, g, b] (stride = 6 floats = 24 bytes)
            gl.enableVertexAttribArray(pos3dLoc);
            gl.vertexAttribPointer(pos3dLoc, 3, gl.FLOAT, false, 6 * 4, 0);

            if (color3dLoc !== -1) {
                gl.enableVertexAttribArray(color3dLoc);
                gl.vertexAttribPointer(color3dLoc, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
            }

            console.log(`[NaCanvasWebGL] Drawing ${vertices.length / 6} triangles (3D interleaved)`);
            gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 6);

            gl.disableVertexAttribArray(pos3dLoc);
            if (color3dLoc !== -1) {
                gl.disableVertexAttribArray(color3dLoc);
            }
        } else {
            // 2D mode: [x, y] (stride = 2 floats = 8 bytes)
            const pos2dLoc = gl.getAttribLocation(this.currentProgram, "a_position");
            if (pos2dLoc !== -1) {
                gl.enableVertexAttribArray(pos2dLoc);
                gl.vertexAttribPointer(pos2dLoc, 2, gl.FLOAT, false, 2 * 4, 0);
            }

            // Set color uniform if it exists
            const colorLoc = gl.getUniformLocation(this.currentProgram, "u_color");
            if (colorLoc) {
                const c = options.color || [0, 0, 0, 1];
                gl.uniform4f(colorLoc, c[0], c[1], c[2], c[3] || 1);
            }

            console.log(`[NaCanvasWebGL] Drawing ${vertices.length / 2} triangles (2D)`);
            gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);

            if (pos2dLoc !== -1) {
                gl.disableVertexAttribArray(pos2dLoc);
            }
        }
    }

    bind_accel_tensor(shader_input, accel_tensor_id, stride = 4, offset = 0) {
        if (typeof shader_input === 'object' && shader_input !== null) {
            const args = shader_input;
            shader_input = args.shader_input;
            accel_tensor_id = args.accel_tensor_id;
            stride = args.stride !== undefined ? args.stride : 4;
            offset = args.offset !== undefined ? args.offset : 0;
        }
        this._tensor_bindings = this._tensor_bindings || {};
        this._tensor_bindings[shader_input] = {
            tensor_id: accel_tensor_id,
            stride: stride,
            offset: offset
        };
    }

    set_uniform_mat4(name, matrix_data) {
        if (typeof name === 'object' && name !== null) {
            const args = name;
            name = args.name;
            matrix_data = args.matrix_data;
        }
        const gl = this.gl;
        gl.useProgram(this.currentProgram);
        const loc = gl.getUniformLocation(this.currentProgram, name);
        if (loc) {
            gl.uniformMatrix4fv(loc, false, new Float32Array(matrix_data));
        }
    }

    set_uniform_float(name, value) {
        if (typeof name === 'object' && name !== null) {
            const args = name;
            name = args.name;
            value = args.value;
        }
        const gl = this.gl;
        gl.useProgram(this.currentProgram);
        const loc = gl.getUniformLocation(this.currentProgram, name);
        if (loc) {
            gl.uniform1f(loc, Number(value));
        }
    }

    draw_points(vertex_count) {
        if (typeof vertex_count === 'object' && vertex_count !== null) {
            const args = vertex_count;
            vertex_count = args.vertex_count;
        }
        const gl = this.gl;
        gl.useProgram(this.currentProgram);

        this._tensor_bindings = this._tensor_bindings || {};
        const enabledAttribs = [];
        let cap_count = vertex_count;

        for (const [shader_input, binding] of Object.entries(this._tensor_bindings)) {
            const tensor_id = binding.tensor_id;
            const stride = binding.stride;
            const offset = binding.offset;
            const tensor_data = window.gs._tensors[tensor_id];
            if (!tensor_data) {
                console.warn(`[NaCanvasWebGL] Tensor "${tensor_id}" not found for binding "${shader_input}"`);
                continue;
            }

            const attr_loc = gl.getAttribLocation(this.currentProgram, shader_input);
            if (attr_loc === -1) continue;

            const local_cap = Math.min(vertex_count, Math.floor(tensor_data.length / stride), 5000);
            if (local_cap < cap_count) {
                cap_count = local_cap;
            }

            const slice_data = tensor_data.slice(0, local_cap * stride);

            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(slice_data), gl.DYNAMIC_DRAW);

            gl.enableVertexAttribArray(attr_loc);
            gl.vertexAttribPointer(
                attr_loc,
                stride, // components per attribute, e.g. 4
                gl.FLOAT,
                false,
                stride * 4,
                offset * 4
            );
            enabledAttribs.push(attr_loc);
        }

        if (cap_count > 0 && enabledAttribs.length > 0) {
            console.log(`[NaCanvasWebGL] Drawing ${cap_count} points (GL_POINTS)`);
            gl.drawArrays(gl.POINTS, 0, cap_count);
        }

        // Clean up
        for (const attr_loc of enabledAttribs) {
            gl.disableVertexAttribArray(attr_loc);
        }
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

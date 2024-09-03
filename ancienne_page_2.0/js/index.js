const agl_decal = 180;

const main_div = document.getElementById("main_div");
document.getElementById("above_div").addEventListener('click', (e) => {
    e.stopPropagation();
});

var focusedCircle = null;
var max_radius = 500;


class Circle {
    constructor(x, y, radius, speed, distance, content = '', angle_min, angle_max, parent = null, bg = null, action_on_click = null) {
        this.angle_min = angle_min;
        this.angle_max = angle_max;
        this.progress = Math.random() * 360;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.distance = distance;
        this.bg = bg;
        this.action_on_click = action_on_click;
        this.parent = parent;
        this.children = [];
        this.wrapperElement = this.createWrapperElement();
        this.angle = Math.random() * Math.PI * 2;
        this.element = this.createElement(content);
        this.lineElement = this.parent ? this.createLineElement() : null;
    }

    createWrapperElement() {
        const el = document.createElement('div');
        el.className = 'wrapper';
        main_div.appendChild(el);
        return el;
    }

    createElement(content) {
        const el = document.createElement('div');
        el.className = 'circle';
        if (this.bg != null) {
            el.style.background = "url(" + this.bg + "), rgba(255, 255, 255, 0.8)";
            el.style.backgroundSize = "90%";
            el.style.backgroundPosition = "center center";
            el.style.backgroundRepeat = "no-repeat";
        }
        el.style.width = `${this.radius * 2}px`;
        el.style.height = `${this.radius * 2}px`;
        el.style.top = `-${this.radius}px`;
        el.style.left = `-${this.radius}px`;
        el.innerHTML = content;
        el.addEventListener('click', (e) => {
            focusedCircle = this;
            e.stopPropagation();
            if (this.action_on_click != null) {
                var splited = this.action_on_click.split("|");
                if (splited.length == 2) {
                    if (splited[0] == "open_window") open_window(splited[1]);
                    else if (splited[0] == "link") {
                        window.location.href = splited[1];
                    }
                }
            }
        });
        this.wrapperElement.appendChild(el);
        return el;
    }

    createLineElement() {
        const el = document.createElement('div');
        el.className = 'line';
        el.addEventListener('click', () => {
            focusedCircle = this.parent;
        });
        main_div.insertBefore(el, main_div.firstChild);
        return el;
    }

    updateElement() {
        this.wrapperElement.style.left = `${this.x}px`;
        this.wrapperElement.style.top = `${this.y}px`;

        if (this.lineElement) {
            const dx = this.x - this.parent.x;
            const dy = this.y - this.parent.y;
            const angle = Math.atan2(dy, dx);
            const length = Math.sqrt(dx * dx + dy * dy);

            this.lineElement.style.width = `${length}px`;
            this.lineElement.style.left = `${this.parent.x+(length)/2}px`; // Changed from `-${this.parent.radius}px`
            this.lineElement.style.top = `${this.parent.y}px`; // Changed from `-${this.parent.radius}px`
            this.lineElement.style.transformOrigin = 'left'; // Ensures rotation is around the left edge of the line
            this.lineElement.style.transform = `translateX(-50%) rotate(${angle}rad)`;
        }

        if (focusedCircle === this) {
            var m = 5;
            var scale = max_radius / ((m * this.radius));
            main_div.style.transform = `translate(${(- this.x)*(max_radius/(m*this.radius))}px, ${(- this.y)*(max_radius/(m*this.radius))}px) scale(${scale})`;
        }
    }

    update() {
        if (this.parent) {
            this.progress += this.speed / (this.distance);
            var sinu = 1.0 + (Math.sin(this.progress) / 2.0);
            this.angle = -(this.angle_min + sinu * (this.angle_max - this.angle_min));

            this.x = this.parent.x + Math.cos(this.angle * Math.PI / 180.0) * this.distance;
            this.y = this.parent.y + Math.sin(this.angle * Math.PI / 180.0) * this.distance;
        }

        this.updateElement();

        for (let child of this.children) {
            child.update();
        }
    }

    addChild(child) {
        this.children.push(child);
        child.parent = this;
    }
}

function test_collision(agl, agls, range) {
    for (ac of agls) {
        if (Math.abs(ac - agl) < range) {
            return true;
        }
    }
    return false;
}

function createChildren(parent, count, radius, speed, distance) {
    var pa = 0;
    if (parent != null) {
        pa = parent.angle;
    }
    var range = Math.min(30, 360 / count);
    var angles_chosen = [];
    for (let i = 0; i < count; i++) {
        var a = pa + Math.random() * 180 - 90;
        var nb_essais = 0;
        while (test_collision(a, angles_chosen, range) && nb_essais < 100) {
            var a = Math.random() * 360;
            nb_essais += 1
        }
        if (nb_essais >= 100) {
            continue;
        }
        let child = new Circle(0, 0, radius, speed, distance, `Child ${i}`, a - range / 2, a + range / 2, parent);
        parent.addChild(child);
        createChildren(child, count - 2 + parseInt(Math.random() * 1.1), radius * 0.75, speed, distance * 1.5);
    }
}

function focus_parent() {
    if (focusedCircle != null) {
        focusedCircle = focusedCircle.parent;
    }
    if (focusedCircle == null) {
        focusedCircle = logo_circle;
    }
}


function createCircle(nom = "", parent = null, dist = 0, radius = 0, angle = 0, variation_angle = 0, speed = 0, bg = "", action = "", content = null) {
    if (parent != null) {
        var amin = angle - variation_angle / 2;
        var amax = angle + variation_angle / 2;
        var x = parent.x + dist * Math.cos(angle);
        var y = parent.y + dist * Math.sin(angle);
        var c = new Circle(x, y, radius, speed, dist, content, amin, amax, parent, bg, action);
        parent.addChild(c);
        return c;
    } else {
        console.error("Error parent is null!");
    }
}

var global_speed_mult = 0.2;

//LOGO CIRCLE
//x, y, radius, speed, distance, content = '', angle_min, angle_max, parent = null
var logo_circle = new Circle(window.innerWidth / 2, window.innerHeight / 2, max_radius, 0, 0, null, 0, 0, null, "res/icon_nath54.svg");

// Empty Circle
var c1 = createCircle(nom = "empty", parent = logo_circle, dist = max_radius * 2.3, radius = max_radius * 0.35, angle = 60, variation_angle = 15, speed = 10.3 * global_speed_mult, bg = "res/empty.svg");
var c2 = createCircle(nom = "plus", parent = logo_circle, dist = max_radius * 3, radius = max_radius * 0.15, angle = 110, variation_angle = 15, speed = 7.3 * global_speed_mult, bg = "res/empty.svg");
var c3 = createCircle(nom = "personal_infos", parent = logo_circle, dist = max_radius * 2.5, radius = max_radius * 0.5, angle = 300, variation_angle = 15, speed = 5.3 * global_speed_mult, bg = "res/icon_profile.svg", action = "open_window|infos_persos");
var c4 = createCircle(nom = "contact", parent = c3, dist = max_radius * 1.8, radius = max_radius * 0.25, angle = 220, variation_angle = 15, speed = 8.3 * global_speed_mult, bg = "res/icon_message.svg", action = "open_window|contact");
var c5 = createCircle(nom = "github", parent = c4, dist = max_radius * 1, radius = max_radius * 0.15, angle = 110, variation_angle = 15, speed = 14.15 * global_speed_mult, bg = "res/icon_github.svg", action = "link|https://github.com/nath54");
var c5 = createCircle(nom = "gallery", parent = c2, dist = max_radius * 1, radius = max_radius * 0.2, angle = 100, variation_angle = 15, speed = 12.15 * global_speed_mult, bg = "res/icon_gallery.svg", action = "open_window|gallery");
var c6 = createCircle(nom = "my games/apps", parent = c2, dist = max_radius * 1, radius = max_radius * 0.15, angle = 160, variation_angle = 15, speed = 8.15 * global_speed_mult, bg = "res/icon_apps.svg", action = "open_window|my_apps");

function animate() {
    logo_circle.update();
    requestAnimationFrame(animate);
}

animate();

function close_window() {
    document.getElementById("above_div").style.display = "none";
}

const win_list = ["infos_persos", "contact", "my_apps", "gallery"];

function open_window(w_name) {
    //
    for (w of win_list) {
        document.getElementById(w).style.display = "none";
    }
    //
    document.getElementById("above_div").style.display = "initial";
    //
    document.getElementById(w_name).style.display = "initial";
}

focus_parent();
const agl_decal = 180;

const main_div = document.getElementById("main_div");
document.getElementById("above_div").addEventListener('click', (e) => {
    e.stopPropagation();
});

var focusedCircle = null;
var max_radius = 100;


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
            var m = 0.75;
            main_div.style.transform = `translate(${(- this.x)*(max_radius/(m*this.radius))}px, ${(- this.y)*(max_radius/(m*this.radius))}px) scale(${max_radius/(m*this.radius)})`;
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


//x, y, radius, speed, distance, content = '', angle_min, angle_max, parent = null
var logo_circle = new Circle(window.innerWidth / 2, window.innerHeight / 2, max_radius, 0, 0, null, 0, 0, null, "res/icon_nath54.svg");
var d1 = max_radius * 2;
var x1 = logo_circle.x + d1 * Math.cos(290);
var y1 = logo_circle.y + d1 * Math.sin(290);
var d2 = max_radius * 2.3;
var x2 = logo_circle.x + d2 * Math.cos(50);
var y2 = logo_circle.y + d2 * Math.sin(50);
var d3 = max_radius * 3;
var x3 = logo_circle.x + d3 * Math.cos(100);
var y3 = logo_circle.y + d3 * Math.sin(100);

//               x,  y, radius,           speed,distance, content = '', angle_min, angle_max, parent = null
var c1 = new Circle(x1, y1, max_radius * 0.50, 0.2, d1, null, 290, 310, logo_circle, "res/icon_profile.svg", "open_window|infos_persos");
logo_circle.addChild(c1);
var c2 = new Circle(x2, y2, max_radius * 0.35, 0.2, d2, null, 50, 70, logo_circle);
logo_circle.addChild(c2);
var c3 = new Circle(x3, y3, max_radius * 0.15, 0.2, d3, null, 100, 120, logo_circle);
logo_circle.addChild(c3);

var d4 = max_radius * 5;
var x4 = c1.x + d4 * Math.cos(210);
var y4 = c1.y + d4 * Math.sin(210);
var c4 = new Circle(x4, y4, max_radius * 0.25, 0.2, max_radius * 2, null, 210, 230, c2, "res/icon_message.svg", "open_window|contact");
c1.addChild(c4);

var d5 = max_radius * 1;
var x5 = c4.x + d5 * Math.cos(100);
var y5 = c4.y + d5 * Math.sin(100);
var c5 = new Circle(x5, y5, max_radius * 0.15, 0.1, d5, null, 100, 120, c4, "res/icon_github.svg", "link|https://github.com/nath54");
c4.addChild(c5);

//createChildren(c3, 3, 50, 0.1, max_radius * 2);

function animate() {
    logo_circle.update();
    requestAnimationFrame(animate);
}

animate();

function close_window() {
    document.getElementById("above_div").style.display = "none";
}

const win_list = ["infos_persos", "contact"];

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
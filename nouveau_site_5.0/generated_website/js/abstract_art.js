// js/lib/abstract_art.js

window.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('.gazette-card-art-container');

    // Hash string to number for deterministic generation
    const hashStr = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    };

    // Abstract generative art
    const generateArt = (canvas, seed) => {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        const hash = Math.abs(hashStr(seed));

        // Custom palette options based around the primary design tokens
        const palettes = [
            ['#f3f4f6', '#d1d5db', '#9ca3af', '#6b7280', '#ecc94b', '#e53e3e', '#3182ce'],
            ['#eef2ff', '#c7d2fe', '#818cf8', '#4f46e5', '#312e81', '#fbcfe8', '#db2777'],
            ['#f0fdf4', '#bbf7d0', '#4ade80', '#16a34a', '#14532d', '#fef08a', '#eab308'],
            ['#fffbeb', '#fde68a', '#f59e0b', '#b45309', '#78350f', '#fb923c', '#ea580c'],
            ['#fdf4ff', '#f5d0fe', '#d946ef', '#a21caf', '#701a75', '#818cf8', '#4338ca']
        ];

        let currentSeed = hash;
        const random = () => {
            currentSeed = (currentSeed * 9301 + 49297) % 233280;
            return currentSeed / 233280;
        };

        const palette = palettes[hash % palettes.length];

        // Background
        ctx.fillStyle = palette[0];
        ctx.fillRect(0, 0, width, height);

        // Geometric shapes
        const shapeCount = 6 + Math.floor(random() * 8); // 6 to 13 shapes

        for (let i = 0; i < shapeCount; i++) {
            ctx.beginPath();
            ctx.fillStyle = palette[1 + Math.floor(random() * (palette.length - 1))];

            const shapeType = Math.floor(random() * 4);
            const x = random() * width;
            const y = random() * height;
            const size = 30 + random() * 100;

            ctx.globalAlpha = 0.5 + random() * 0.4;

            if (shapeType === 0) {
                // Circle
                ctx.arc(x, y, size, 0, Math.PI * 2);
            } else if (shapeType === 1) {
                // Rectangle
                ctx.rect(x - size / 2, y - size / 2, size * (1 + random()), size * (0.5 + random()));
            } else if (shapeType === 2) {
                // Triangle
                ctx.moveTo(x, y - size);
                ctx.lineTo(x + size, y + size);
                ctx.lineTo(x - size, y + size);
            } else {
                // Abstract curve
                ctx.moveTo(x - size, y);
                ctx.quadraticCurveTo(x, y - size * 2, x + size, y);
            }

            ctx.fill();

            // Add subtle stroke 50% of time
            if (random() > 0.5) {
                ctx.strokeStyle = palette[1 + Math.floor(random() * (palette.length - 1))];
                ctx.lineWidth = 1 + random() * 3;
                ctx.globalAlpha = 0.8;
                ctx.stroke();
            }
        }

        // Apply a grainy overlay effect using tiny rects
        ctx.globalAlpha = 0.05;
        ctx.fillStyle = '#000000';
        for (let i = 0; i < 500; i++) {
            ctx.fillRect(random() * width, random() * height, 2, 2);
        }
    };

    containers.forEach(container => {
        const imgSrc = container.getAttribute('src');
        // Handle un-resolved placeholder or empty string
        if (!imgSrc || imgSrc.includes('{') || imgSrc === 'None' || imgSrc === '../' || imgSrc === '../None') {
            const canvas = document.createElement('canvas');
            canvas.width = 600;
            canvas.height = 300;
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.objectFit = 'cover';
            container.appendChild(canvas);

            const seed = (container.dataset.title || "art") + (container.dataset.category || "");
            generateArt(canvas, seed);
        } else {
            // Setup real image with infinite fallback
            const img = document.createElement('img');
            img.src = imgSrc;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';

            img.onerror = () => {
                img.style.display = 'none';
                const canvas = document.createElement('canvas');
                canvas.width = 600;
                canvas.height = 300;
                canvas.style.width = '100%';
                canvas.style.height = '100%';
                canvas.style.objectFit = 'cover';
                container.appendChild(canvas);

                const seed = (container.dataset.title || "art") + "fallback";
                generateArt(canvas, seed);
            };

            container.appendChild(img);
        }
    });
});

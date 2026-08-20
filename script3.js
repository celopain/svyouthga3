
const canvas =
    document.getElementById("spaceCanvas");

const ctx =
    canvas.getContext("2d");

const card =
    document.getElementById("card");

const title =
    document.getElementById("title");

const subtitle =
    document.getElementById("subtitle");

const countdown =
    document.getElementById("countdown");

const countdownNumber =
    document.getElementById("countdownNumber");

const starArea =
    document.getElementById("starArea");

const starButton =
    document.getElementById("starButton");

const message =
    document.getElementById("message");

const particlesContainer =
    document.getElementById("particles");


/* =========================================================
   CONFIGURATION
   ========================================================= */

const CONFIG = {

    countdownTime: 3,

    backgroundStars: 160,

    particles: 55,

    shootingStarMin: 4500,

    shootingStarMax: 9000

};


/* =========================================================
   STATE
   ========================================================= */

let discovered = false;

let countdownValue =
    CONFIG.countdownTime;


/* =========================================================
   CANVAS
   ========================================================= */

let width = 0;
let height = 0;

let stars = [];

let animationFrame;


/* =========================================================
   CANVAS RESIZE
   ========================================================= */

function resizeCanvas() {

    width =
        window.innerWidth;

    height =
        window.innerHeight;

    const pixelRatio =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );

    canvas.width =
        Math.floor(
            width * pixelRatio
        );

    canvas.height =
        Math.floor(
            height * pixelRatio
        );

    canvas.style.width =
        width + "px";

    canvas.style.height =
        height + "px";

    ctx.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
    );

    createBackgroundStars();
}


/* =========================================================
   BACKGROUND STARS
   ========================================================= */

function createBackgroundStars() {

    stars = [];

    for (
        let i = 0;
        i < CONFIG.backgroundStars;
        i++
    ) {

        stars.push({

            x:
                Math.random() *
                width,

            y:
                Math.random() *
                height,

            radius:
                Math.random() *
                1.5 +
                0.2,

            alpha:
                Math.random() *
                0.7 +
                0.2,

            speed:
                Math.random() *
                0.15 +
                0.03,

            twinkle:
                Math.random() *
                0.03 +
                0.005,

            phase:
                Math.random() *
                Math.PI *
                2

        });
    }
}


/* =========================================================
   DRAW BACKGROUND
   ========================================================= */

function drawStars(time) {

    ctx.clearRect(
        0,
        0,
        width,
        height
    );

    for (const star of stars) {

        const twinkle =
            Math.sin(
                time *
                star.twinkle +
                star.phase
            ) * 0.25;

        const alpha =
            Math.max(
                0.05,
                star.alpha +
                twinkle
            );

        ctx.beginPath();

        ctx.arc(
            star.x,
            star.y,
            star.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(255,255,255,${alpha})`;

        ctx.fill();

        star.y -=
            star.speed;

        if (
            star.y < -5
        ) {

            star.y =
                height + 5;

            star.x =
                Math.random() *
                width;
        }
    }

    animationFrame =
        requestAnimationFrame(
            drawStars
        );
}


/* =========================================================
   INITIALIZE CANVAS
   ========================================================= */

resizeCanvas();

animationFrame =
    requestAnimationFrame(
        drawStars
    );


/* =========================================================
   RESIZE HANDLING
   ========================================================= */

let resizeTimer;

window.addEventListener(
    "resize",
    () => {

        clearTimeout(
            resizeTimer
        );

        resizeTimer =
            setTimeout(
                resizeCanvas,
                100
            );

    },
    {
        passive: true
    }
);


/* =========================================================
   COUNTDOWN
   ========================================================= */

function runCountdown() {

    countdownNumber.textContent =
        countdownValue;

    const interval =
        setInterval(
            () => {

                countdownValue--;

                if (
                    countdownValue > 0
                ) {

                    countdownNumber.textContent =
                        countdownValue;

                    return;
                }

                clearInterval(
                    interval
                );

                revealStar();

            },
            1000
        );
}

runCountdown();


/* =========================================================
   REVEAL STAR
   ========================================================= */

function revealStar() {

    countdown.classList.add(
        "hidden"
    );

    setTimeout(
        () => {

            starArea.classList.add(
                "revealed"
            );

            title.innerHTML =
                `A mysterious <span>star</span> has appeared...`;

            subtitle.textContent =
                "Something is calling you. Discover it.";

            createShootingStar();

        },
        400
    );
}


/* =========================================================
   STAR CLICK
   ========================================================= */

starButton.addEventListener(
    "click",
    discoverStar
);


function discoverStar() {

    if (discovered) {
        return;
    }

    discovered = true;


    /* Stretch corners */

    card.classList.add(
        "star-discovered"
    );


    /* Star burst */

    starArea.classList.add(
        "burst"
    );


    /* Particle explosion */

    createExplosion();


    /* Change text */

    subtitle.textContent =
        "The hidden star has chosen you.";

    title.innerHTML =
        `The <span>Hidden Star</span> is yours!`;


    /* Show clue */

    setTimeout(
        () => {

            message.classList.add(
                "show"
            );

            starArea.classList.remove(
                "burst"
            );

            /*
                Make sure the newly revealed
                content is visible on smaller
                screens and laptops.
            */

            if (
                window.innerWidth < 700
            ) {

                setTimeout(
                    () => {

                        message.scrollIntoView({
                            behavior: "smooth",
                            block: "nearest"
                        });

                    },
                    100
                );
            }

        },
        450
    );
}


/* =========================================================
   PARTICLE EXPLOSION
   ========================================================= */

function createExplosion() {

    const rect =
        starButton.getBoundingClientRect();

    const centerX =
        rect.left +
        rect.width / 2;

    const centerY =
        rect.top +
        rect.height / 2;


    for (
        let i = 0;
        i < CONFIG.particles;
        i++
    ) {

        const particle =
            document.createElement(
                "div"
            );

        particle.className =
            "particle";


        const angle =
            Math.random() *
            Math.PI *
            2;


        const distance =
            Math.random() *
            220 +
            50;


        const x =
            Math.cos(angle) *
            distance;

        const y =
            Math.sin(angle) *
            distance;


        const size =
            Math.random() *
            5 +
            2;


        particle.style.width =
            size + "px";

        particle.style.height =
            size + "px";


        particle.style.left =
            centerX + "px";

        particle.style.top =
            centerY + "px";


        particle.style.setProperty(
            "--x",
            `${x}px`
        );

        particle.style.setProperty(
            "--y",
            `${y}px`
        );


        particlesContainer.appendChild(
            particle
        );


        setTimeout(
            () => {
                particle.remove();
            },
            1100
        );
    }
}


/* =========================================================
   SHOOTING STARS
   ========================================================= */

function createShootingStar() {

    const shootingStar =
        document.createElement(
            "div"
        );

    shootingStar.className =
        "shooting-star";


    const startX =
        Math.random() *
        window.innerWidth;


    const startY =
        Math.random() *
        window.innerHeight *
        0.5;


    shootingStar.style.left =
        startX + "px";

    shootingStar.style.top =
        startY + "px";


    document.body.appendChild(
        shootingStar
    );


    setTimeout(
        () => {

            shootingStar.remove();

        },
        1500
    );


    scheduleShootingStar();
}


function scheduleShootingStar() {

    const delay =
        Math.random() *
        (
            CONFIG.shootingStarMax -
            CONFIG.shootingStarMin
        ) +
        CONFIG.shootingStarMin;


    setTimeout(
        createShootingStar,
        delay
    );
}


scheduleShootingStar();


/* =========================================================
   KEYBOARD ACCESSIBILITY
   ========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            (
                event.key === "Enter" ||
                event.key === " "
            ) &&
            document.activeElement === starButton
        ) {

            event.preventDefault();

            starButton.click();
        }
    }
);


/* =========================================================
   PREVENT ACCIDENTAL CANVAS OVERLOAD
   ========================================================= */

window.addEventListener(
    "pagehide",
    () => {

        if (animationFrame) {

            cancelAnimationFrame(
                animationFrame
            );
        }

    }
);


/* =========================================================
   DEBUG
   ========================================================= */

console.log(
    "%c⭐ QUEST FOR THE HIDDEN STAR",
    "color:#ffd84d;font-size:18px;font-weight:bold;"
);

console.log(
    "%cThe hidden star is waiting...",
    "color:#94a3b8;font-size:12px;"
);

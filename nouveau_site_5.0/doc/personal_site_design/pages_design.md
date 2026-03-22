# Website pages design

## Index home page

Path: `./index.html`

```xml

<main_container>

    <2_columns_container_1_on_mobile>

        <!-- Left Index Column (header, presentation and quick history) -->
        <left_column>

            <!-- Header section -->
            <row_head>

                <logo />

                <title_text>
                    Nathan's website
                </title_text>

            </row_head>

            <!-- Presentation section -->
            <section>

                <text>
                    Hi ! I'm Nathan, a computer science passionate.  <!-- TODO: write a better text -->
                </text>

            </section>

            <!-- Quick history section -->
            <section>

                <small_expandable_node>

                    <name>
                        2023 - 2026 : Engineering school (Télécom Physique Strasbourg).
                    </name>

                    <content>
                        In 2023, I started a 3-year engineering school (Télécom Physique Strasbourg). I am currently in the end of my last year, doing my 6-month internship in the IRIDIA lab of the Université Libre de Bruxelles.
                    </content>

                </small_expandable_node>

                <small_expandable_node>

                    <name>
                        2021 - 2023 : Preparatory class (Lycée Louis-le-Grand, Paris).
                    </name>

                    <content>
                        In 2021, I started a 2-year preparatory class (CPGE) in Paris (lycée Louis-le-Grand). I then passed the entrance exams for the French engineering schools (concours Mines-Télécom, Centrale-Supélec, X, ENS).
                    </content>

                </small_expandable_node>

                <small_expandable_node>

                    <name>
                        2015 - 2021 : Second part of my childhood and high school.
                    </name>

                    <content>
                        In 2015, we moved into Heillecourt, a city in the suburbs of Nancy. I went to the middle school there (collège Montaigu), and then to the high school in Nancy (lycée Henri Poincaré). I graduated in 2021 with a scientific baccalauréat (Maths, Computer Science and Physics options).
                    </content>

                </small_expandable_node>

                <small_expandable_node>

                    <name>
                        2003 - 2015 : First part of my childhood.
                    </name>

                    <content>
                        I was born in Nancy, France. I lived in Sivry, a small village of 200 inhabitants, in the countryside, 20 km in the north of Nancy.
                    </content>

                </small_expandable_node>

            </section>

        </left_column>

        <!-- Right Index Column (links to other pages) -->
        <right_column>

            <!-- Professional links -->
            <section>

                <title>
                    Professional links
                </title>

                <link_file icon="file" name="CV / resume (english)" url="res/cv_en.pdf" />
                <link_file icon="file" name="CV / resume (french)" url="res/cv_fr.pdf" />

                <link_url icon="github" name="Github" url="https://github.com/nath54" />
                <link_url icon="linkedin" name="Linkedin" url="https://www.linkedin.com/in/nathan-cerisara-8669331ba/" />

                <link_page icon="msg_bubble" name="Contact me" url="pages/contact_me.html" />

            </section>

            <!-- For my friends and family and those who want to know me -->
            <section>

                <title>
                    For my friends and family and those who want to know me
                </title>

                <link_page icon="person" name="About me" url="pages/about_me.html" />
                <link_page icon="projects" name="Projects" url="pages/projects.html" />
                <link_page icon="museum" name="Museum" url="pages/museum.html" />
                <link_page icon="blog" name="Blog" url="pages/blog.html" />

            </section>

        </right_column>

    </2_columns_container_1_on_mobile>

</main_container>

```

## Page - Contact me

Path: `./pages/contact_me.html`

```xml
<main_container>

    <single_column>

        <title_text>Contact Me</title_text>

        <section>
            <text>
                If you want to reach out for professional inquiries, for a collaboration, or just to say hi, here are the best ways of contacting me:
            </text>

            <subsection>
                <text>By sending an email to:</text>
                <code>cerisara.nathan@protonmail.com</code>
            </subsection>

            <subsection>
                <text>Or by sending a message on Linkedin:</text>
                <link_url icon="linkedin" name="Linkedin" url="https://www.linkedin.com/in/nathan-cerisara-8669331ba/" />
            </subsection>

        </section>

    </single_column>

</main_container>
```

## Page - About me

Path: `./pages/about_me.html`

```xml
<main_container>

    <single_column>

        <title_text>About Me</title_text>

        <text>If you want to know more about myself...</text>

        <!-- Section: My Hobbies -->
        <large_expandable_node title="My Hobbies">

            <!-- Board games and Game of Roles -->
            <medium_expandable_node>
                <name>Board games and Game of Roles</name>
                <content>
                    I like playing board games and game of roles with my friends and my family.

                    Example of board games I like:

                    - **Classic and Traditional Card Games**
                        Traditional trick-taking and betting games played with standard decks.
                        - Examples: Belote, Tarot, Poker.

                    - **Fast-Paced Deck and Hand Management**
                        Modern card games focused on card combinations, set collection, and hand clearing.
                        - Examples: Gang of 4, President, 7 Yokai.

                    - **Social Deduction and Communication**
                        Games centered on word association, hidden information, and collective interpretation.
                        - Examples: Codenames, Dixit, Blanc Manger Coco, Danny.

                    - **Tactical Engine Building**
                        Resource management games where players optimize actions to build an efficient scoring system.
                        - Examples: Azul, Splendor, Rebirth.

                    - **Tile-Laying and Territorial Expansion**
                        Strategic placement games focused on building landscapes and claiming space on a shared board.
                        - Examples: Carcassonne, Kingdomino.

                    - **Area Control and Strategy**
                        Macro-strategy games involving territorial dominance, resource competition, and conflict management.
                        - Examples: Risk, Scythe.

                    - **Cooperative and Puzzle Solving**
                        Team-based or logic-driven games centered on shared objectives and mechanical problem-solving.
                        - Examples: The Gang, Take Time.

                    - **Competitive Duel and Confrontation**
                        Strictly 1v1 formats featuring hidden movement, tactical positioning, or collectible deck building.
                        - Examples: Tag Team, Zenith, Stratego, Magic: The Gathering.


                </content>
            </medium_expandable_node>

            <!-- Sports -->
            <medium_expandable_node>
                <name>Sports</name>
                <content>
                    I love playing and watching some sports, especially:

                    - **Basket-ball**:
                        I practiced in club, and now regularly outdoor, and I like following the NBA.

                    - **Volley-ball**:
                        I practiced, especially when I was in CPGE.

                    - **Cycling**:
                        I like doing bike, and following the Tour de France, Paris-Nice, La Vuelta, Le Giro, Les classiques...
                </content>
            </medium_expandable_node>


            <!-- Computer Science and Development -->
            <medium_expandable_node>
                <name>Computer Science and Development</name>
                <content>
                    I started programming when I was very young, and started with Python and basic web development (HTML, CSS, JS).
                    I started trying to programming my own video-games, and created random websites, until I did more serious projects during my studies.
                </content>
            </medium_expandable_node>


            <!-- Creation and Art -->
            <medium_expandable_node>
                <name>Creation and Art</name>
                <content>
                    I like creating and making art. I like drawing, and I like making music (writing lyrics or composing music).
                    I also like writing stories, poems, and novels.
                    I also like making 3d renderings, pixel/voxel art, and other forms of digital art.
                </content>
            </medium_expandable_node>


            <!-- Listening Music -->
            <medium_expandable_node>
                <name>Listening Music</name>
                <content>
                    - **Modern Metalcore / Post-Hardcore**
                        High-production tracks featuring a contrast between heavy, rhythmic riffs and melodic, clean vocal layers.
                        - Key Artists: Imminence, Bad Omens, Bring Me The Horizon, I Prevail, Architects, Motionless In White.
                        - Example Tracks: Imminence - God Fearing Man, Bring Me The Horizon - Shadow Moses, Bad Omens - Glass Houses, I Prevail - Bad Things, Architects - Doomsday, Motionless In White - Another Life, ...

                    - **K-Pop**
                        Fast-paced production characterized by sudden genre transitions and dense, maximalist arrangements.
                        - Key Artists: NMIXX, (G)I-DLE, aespa, ITZY, NewJeans, LE SSERAFIM, Stray Kids, Dreamcatcher.
                        - Example Tracks: NMIXX - DASH, NMIXX - KNOW ABOUT ME, aespa - Whiplash, (G)I-DLE - Oh my god, ITZY - TUNNEL VISION, NewJeans - OMG, LE SSERAFIM - Eve, Psyche and The Bluebeard’s wife, Stray Kids - God's Menu, ZICO - SPOT! (feat. JENNIE), ...

                    - **Progressive Instrumental / Math Rock**
                        Technical guitar compositions focused on non-standard time signatures and intricate melodic execution.
                        - Key Artists: Polyphia, Plini, Animals As Leaders, Angel Vivaldi, Nobody.one, I built the sky, Lee McKinney, Sergey Golovin, ...
                        - Example Tracks: Polyphia - Playing God, Nobody.one - JB, I build the sky - Up into the ether, Lee McKinney - A clock without a craftsman, Plini - Selenium Forest, Animals As Leaders - Red Miso, Angel Vivaldi - A Martian Winter, Sergey Golovin - Satellite, ...

                    - **Cinematic Phonk / Drift**
                        Electronic music defined by distorted basslines, cowbell-driven melodies, and high-tempo energy.
                        - Key Artists: Dxrk ダーク, Hensonn, svlient, N1VALL, KAXCOTA, DOMILITANT, ...
                        - Example Tracks: Dxrk ダーク - RAVE, KAXCOTA - MORTALS FUNK, ...

                    - **Orchestral Hybrid / Epic Score**
                        A blend of traditional classical orchestration with heavy industrial, metal, or electronic textures.
                        - Key Artists: Samuel Kim, Rok Nardin, Hiroyuki Sawano, The Enigma TNG, ...
                        - Example Tracks: Rok Nardin - Amplituhedron, The Enigma TNG - Black, ...

                    - **Nu-Metal / Alt-Rock Revivals**
                        Rhythmic, groove-oriented rock featuring heavy distortion and vocal-driven emotional themes.
                        - Key Artists: Linkin Park, Three Days Grace, Flyleaf, Evanescence.
                        - Example Tracks: Linkin Park - From the Inside, Three Days Grace - Animal I Have Become, Flyleaf - I'm So Sick, ...

                    - **Technical Melodic Death Metal**
                        Heavy music featuring complex drum patterns, aggressive vocal delivery, and structured melodic riffs.
                        - Key Artists: Gojira, Trivium, In Flames, ...
                        - Example Tracks: Gojira - Flying Whales, Trivium - Until the World Goes Cold, ...

                    - **Psychedelic / Experimental Heritage**
                        Experimental rock from the mid-to-late 20th century, known for long-form soundscapes and progressive structures.
                        - Key Artists: Pink Floyd, Shaka Ponk, ...
                        - Example Tracks: Pink Floyd - Another Brick in the Wall, Shaka Ponk - Tout le monde danse, ...

                    - **Hardstyle / High-BPM Electronic**
                        Electronic dance music built around aggressive kick drums and high-energy synth leads.
                        - Key Artists: Dimitri Vegas and Like Mike, Timmy Trumpet, R3HAB, Martin Garrix, David Guetta, ...
                        - Example Tracks: Dimitri Vegas and Like Mike - The Hum, Martin Garrix - Animals, David Guetta - Kill me slow, ...

                    - **Dark Folk / Ethereal Pop**
                        Atmospheric music utilizing organic instrumentation, unique vocal timbres, and narrative-focused lyrics.
                        - Key Artists: AURORA, Wardruna, Kiki Rockwell, Nisli, ...
                        - Example Tracks: AURORA - Running With The Wolves, AURORA - Everything Matters, ...

                    - **Chillstep / Melodic Bass**
                        Spacious electronic production focused on low-end frequencies and slow-building atmospheric layers.
                        - Key Artists: INZO, Seven Lions, ODESZA, ...
                        - Example Tracks: INZO - Overthinker, ...

                    - **Cinematic Anime Soundtracks**
                        Compositions written for Japanese animation, ranging from orchestral battle themes to ambient character motifs.
                        - Key Artists: Hiroyuki Sawano, Yuki Kajiura, Shiro Sagisu, LiSA, Akeboshi, ...
                        - Example Tracks: Hiroyuki Sawano - aLIEz, ...

                    - **Video Game Soundtracks**
                        Adaptive music designed for environmental storytelling, often mixing folk, industrial, and symphonic elements.
                        - Key Artists: Keiichi Okabe, Borislav Slavov, Jesper Kyd, ...
                        - Example Tracks: Borislav Slavov - I Want to Live, ...

                    - **Neo-Classical / Contemporary Piano**
                        Solo piano works focused on technical precision and emotive, minimalist melodic structures.
                        - Key Artists: Gibran Alcocer, Erik Satie, Borislav Slavov, ...
                        - Example Tracks: Gibran Alcocer - Idea 10, ...

                    - **Classical and Symphonic**
                        Orchestral compositions from the 19th and early 20th centuries, prioritizing thematic development and grand scale.
                        - Key Artists: Antonín Dvořák, Pyotr Ilyich Tchaikovsky, Ludwig van Beethoven, ...
                        - Example Tracks: Antonín Dvořák - Symphony No. 9 "From the New World", ...

                    - **Anthemic Alt-Rock / Gaming Tie-ins**
                        Large-scale rock production often used for competitive gaming events or narrative trailers.
                        - Key Artists: Imagine Dragons, Against the Current, ...
                        - Example Tracks: Imagine Dragons - Enemy, ATC - Legends Never Die, ...

                    - **Narrative / Technical Hip-Hop**
                        Hip-hop focused on rapid-fire delivery, lyrical storytelling, and dark, cinematic backbeats.
                        - Key Artists: NF, Eminem, bbno$, ...
                        - Example Tracks: NF - The Search, Eminem - Lose Yourself, bbno$ - 1-800, ...

                    - **Modern Dark Pop / Electropop**
                        High-fidelity pop featuring moody synths, atmospheric production, and non-traditional vocal styles.
                        - Key Artists: Billie Eilish, Katy Perry, Lil Nas X, ...
                        - Example Tracks: Billie Eilish - CHIHIRO, Katy Perry - Dark Horse, Lil Nas X - STAR WALKIN', ...

                    - **Internet-Native / Virtual Circle**
                        Music born from digital subcultures, including fan-produced covers and virtual band projects.
                        - Key Artists: Will Stetson, Kessoku Band, YOASOBI, ADO, ...
                        - Example Tracks: Will Stetson - Writing on the Wall, ...

                    - **Genre-Bending Art Pop / Alt-RnB**
                        Experimental pop that incorporates elements of jazz, soul, and electronic music with a focus on mood and texture.
                        - Key Artists: DPR IAN, Halsey, Neoni, ...
                        - Example Tracks: DPR IAN - Don't Go Insane, Neoni - Machine, ...
                </content>
            </medium_expandable_node>

            <!-- Manga / Animes / Webtoons -->
            <medium_expandable_node>
                <name>Manga / Animes / Webtoons</name>
                <content>
                    I like reading manga and watching anime. I also like reading webtoons.

                    Here are some of my favorites:

                    - Classical shonen:
                        - Hunter X Hunter
                        - Dragon Ball

                    - Dark Fantasy / seinen:
                        - Vinland Saga
                        - Berserk
                        - Tokyo Ghoul
                        - Fate Series

                    - System Fantasy / Isekai:
                        - Solo Leveling
                        - Re:Zero
                        - The Beginning After the End
                        - The Rising of the Shield Hero

                    - Contemplative Fantasy:
                        - Frieren

                    - Strategic Thriller:
                        - Death Note
                        - Code Geass
                        - Psycho-Pass

                    - Psychological:
                        - Orb: On the Movements of the Earth
                        - To your eternity
                        - The Darwin Incident
                        - Lazarus
                        - Oshi No Ko
                        - Promised Neverland
                        - Parasyte
                        - Guilty Crown

                    - Music:
                        - Beck
                        - Bocchi the Rock!
                        - Nana
                        - Blue Orchestra
                        - Carole and Tuesday
                        - Your Lie in April
                        - KPop Demon Hunter

                    - Sport:
                        - Kuroko no basket
                        - Slam Dunk
                        - Haikyu!!
                        - Blue Lock

                    - Romance:
                        - Kaguya-sama: Love is War
                        - Golden Time
                        - Blue Box

                    - Sci-fi:
                        - Cyberpunk: Edgerunners

                </content>
            </medium_expandable_node>

            <!-- Reading Books -->
            <medium_expandable_node>
                <name>Reading Books</name>
                <content>
                    I like reading books.

                    Here are some of my favorites:
                        - Les Hauts-Conteurs - Olivier Peru and Patrick McSpare
                        - Blood song - Anthony Ryan
                        - The Witcher - Andrzej Sapkowski
                        - Fondation - Isaac Asimov
                        - Misery - Stephen King

                    I am currently reading:
                        - La guilde des ombres - Anna Triss
                        - L'assassin royal - Robin Hobb (The Farseer Trilogy)

                    My to-read pile is currently composed of:
                        - La tour sombre - Stephen King (ep1 - le pistolero)
                        - H2G2 - Douglas Adams
                </content>
            </medium_expandable_node>


            <!-- Watching Series / Movies -->
            <medium_expandable_node>
                <name>Watching Series / Movies</name>
                <content>
                    I like watching series and movies. Here are some of my favorites:

                    Series:
                        - The good place
                        - Mercredi (Wednesday)
                        - The walking dead
                        - Doctor Who
                        - Kaamelott
                        - Squid Game
                        - Hot Shot (籃球火) (2008)

                    C-dramas:
                        - Always Home
                        - When I fly towards you
                        - Our generation
                        - Summit of Youth

                    K-dramas:
                        - Doctors
                        - Resident Playbook
                        - I am not a robot

                    Movies:
                        - Matrix
                        - Men in black
                        - Interstellar
                        - Les fugitifs / La chèvre
                        - OSS 117
                        - La planète des singes
                        - Vertigo
                        - La vague
                        - Persepolis
                        - Les enfants loups
                        - Mon voisin totoro
                        - Kiki la petite sorcière
                        - Le chateau ambulant
                        - Your Name
                        - La traversée du temps
                </content>
            </medium_expandable_node>

        </large_expandable_node>

        <!-- Section: The schools I went to -->
        <large_expandable_node title="The schools I went to">

            <!-- Engineering school -->
            <small_expandable_node>
                <name>Engineering school (2023 - 2026)</name>
                <content>
                    I am currently in the end of my last year of engineering school (Télécom Physique Strasbourg).
                </content>
            </small_expandable_node>

            <!-- Preparatory class -->
            <small_expandable_node>
                <name>Preparatory class (2021 - 2023)</name>
                <content>
                    I did a 2-year preparatory class (CPGE) in Paris (lycée Louis-le-Grand).
                </content>
            </small_expandable_node>

            <!-- High school -->
            <small_expandable_node>
                <name>High school (2018 - 2021)</name>
                <content>
                    I did my high school in Nancy (lycée Henri Poincaré).
                </content>
            </small_expandable_node>

            <!-- Second part of my middle school -->
            <small_expandable_node>
                <name>Second part of my middle school (2015 - 2018)</name>
                <content>
                    I did the second part of my middle school in Heillecourt (collège Montaigu).
                </content>
            </small_expandable_node>

            <!-- First part of my middle school -->
            <small_expandable_node>
                <name>First part of my middle school (2014 - 2015)</name>
                <content>
                    I studied the first year of my middle school in Nomeny (collège Val de Seille).
                </content>
            </small_expandable_node>

            <!-- Second part of my primary school -->
            <small_expandable_node>
                <name>Second part of my primary school</name>
                <content>
                    I studied the second part of my primary school in Nomeny (école élémentaire de Nomeny).
                </content>
            </small_expandable_node>

            <!-- First part of my primary school -->
            <small_expandable_node>
                <name>First part of my primary school</name>
                <content>
                    I studied the first part of my primary school in Moivrons (école des côtes de Moivrons).
                </content>
            </small_expandable_node>

        </large_expandable_node>

        <!-- Section: The places where I have lived -->
        <large_expandable_node title="The places where I have lived">

            <!-- Bruxelles -->
            <small_expandable_node>
                <name>Bruxelles</name>
                <content>
                    I currently live in Bruxelles, Belgium, where I am doing my internship.
                </content>
            </small_expandable_node>

            <!-- Strasbourg -->
            <small_expandable_node>
                <name>Strasbourg</name>
                <content>
                    I lived in Strasbourg, France, from 2023 to 2026, where I was studying in engineering school.
                </content>
            </small_expandable_node>

            <!-- Paris -->
            <small_expandable_node>
                <name>Paris</name>
                <content>
                    I lived in Paris, France, from 2021 to 2023, where I was doing my preparatory class.
                </content>
            </small_expandable_node>

            <!-- Nancy / Heillecourt -->
            <small_expandable_node>
                <name>Nancy / Heillecourt</name>
                <content>
                    I lived in Nancy / Heillecourt, France, from 2015 to 2021, where I was doing the end of my middle school and my high school.
                </content>
            </small_expandable_node>

            <!-- Nancy / Sivry -->
            <small_expandable_node>
                <name>Nancy / Sivry</name>
                <content>
                    I lived in Nancy / Sivry, France, from 2003 to 2015, where I was doing my childhood and the beginning of my middle school.
                </content>
            </small_expandable_node>

        </large_expandable_node>

    </single_column>
</main_container>
```

## Page - Projects

Path: `./pages/projects.html`

```xml
<main_container>
    <single_column>

        <!-- TODO -->

    </single_column>
</main_container>
```

## Page - Museum

Path: `./pages/museum.html`

```xml
<main_container>
    <single_column>

        <title_text>The Museum (Media Gallery)</title_text>

        <!-- TODO -->
    </single_column>
</main_container>
```

## Page - Blog

Path: `./pages/blog.html`

```xml
<main_container>
    <single_column>

        <!-- TODO -->

    </single_column>
</main_container>
```

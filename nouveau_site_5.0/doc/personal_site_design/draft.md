# New website design

## Some brainstorming ideas

- Website base so people that have no js activated can still access to all the most important content of the website.
- Improved experience for people with js activated.
- We will keep the same translation method `data_translation_en` / `data_translation_fr` / ...
- We will keep the same theme method `data_theme_light` / `data_theme_dark` / ...
- But I don't want to force the size / zooming of the website like I did with the current previous version.
- In term of content, I would like to have at least:
  - Basic home page (but I don't know what to put in it)
  - I want my CV to be easily accessible from the home page, but I don't want to break the flow of the website.
  - I want a page with my personal story like in the current previous version.
  - I would like a "projects" page (with project I've done and finished, projects I'm working on, and projects I would like to do in the future), but I don't know how it should be organized and what it should look like.
  - I would like a "blog" page where I can write and drop anything I want in a not very organized way, but that don't ruin the integrity of the website.
  - I would like a "media" page where I can drop musics, lyrics, poems, novels, books, drawings, videos, 3d renderings, pixel/voxel art, ... (Maybe organize it like a virtual museum?)
  - I would like a "contact" page where I can explain to people that want to contact me how to do it a way that don't bother me and avoid spam.
  - A custom 404 page? (I don't know if github pages allows custom 404 pages)
  - I want also other more like showcase pages with specific experiments / topics / showcases (I don't know how to describe it better)

- I don't know if I still want to keep my current logo (a purple "N" with gradients) or not. But if I don't want to keep it, I don't have any ideas of what to replace it with.
- In term of style, I don't really know what I want. I know that I like the violet color, I like "modern" aesthetic, but I don't want a "cliché" website, but I still want people that are not familiar with computers / internet / website can still be able to navigate on it easily and I want them to have a good moment on my website, not a bad experience.
- I don't want a boring website, but I don't want a website that is too "busy" or "noisy" either. I want something that is clean, modern, and easy to navigate. I also want something that is responsive and works on all devices. I want something that is also accessible to people with disabilities.
- I want the website to be fast and efficient. I don't want to use any heavy libraries or frameworks. I want to use vanilla javascript and css as much as possible.
- I want to be able to quickly add new subpages, or new main pages / new experiences; or to modify something in the website easily.
- So I want a well organized code base, with a good documentation about what is where, what does what, how to modify it, how to add new pages, how to add new features, ... Directly inside the code base within smart placed comments.
- To add pages, I don't want to code in javascript, I would like to pass through a custom intermediate format easily editable, but also easily parsable from a custom python script that will generate the html pages at commit time with a custom github hook.
- So we will also need to design multiple custom intermediate formats for the different types of pages I want to have on my websites (project pages, blog pages, media elements, ...)

- I don't want to use jinja2 for the html generation, I will use my own custom python script to generate the html pages.
- I like the idea of having a custom "terminal" as an easter egg on my website. (Will only work with js activated).
- Additionally to the commit time html files generation, I think I would not like to be forced to manually write the intermediate format files from a text editor directly, but I am also thinking about a system I used for another project (<https://github.com/nath54/arteriae_aethereae_wiki/>), where the website add a "viewer" mode by default, but if the website detects a python websocket server running locally (localhost only / 127.0.0.1 only) it will add an "editor" mode that allow to edit some content of my website directly from the browser.
- I want at least a light and a dark mode (with automatic switching based on the system theme, but with a manual override), and I think I would like to add more themes later.
- My website will also be translated in multiple languages using my current "previous" website's translation system managed by javascript, and use the `data_translation_langcode` attribute to store the translation code for each html nodes.
- By default, the default language will be english for people without js activated, but if js activated and default system language is french, the website will be in french.

- I like the idea of having my website with a design similar as an "OS". But I want something responsive and that work on all devices.
- I think I would use the "fetch" of subpages to load directly in the main index.html file when js activated to be able to have a sort of "continuity" in the website, and to be able to have a single page application (SPA) experience, without blank loading screens when switching between pages, there can be some musics playing in the background without interruption when switching between pages for instance, or having frontground animations continuing to play. Or the terminal easter egg.
- For that, there will be a subpage container that will be populated with the result of the fetch request.
- But for the people without js activated, they will just have a normal basic website experience with separate html files for each page. So there will be specific navigation HTML node elements to navigate through the website, that will be enabled by default, but will be disabled when js is activated.
- Going back will work well for the non-js version, but I still want a proper "back" event management for the SPA version, so that the back button of the browser works as expected.

- I think about a full OS experience mode with fullscreen mode when the python websocket server is running, with custom user logging. There will be an "admin" user, and simple "users" that will have less permissions. There will be a "public" files and "server local" files system. The server local files system will be only accessible from the user with the python, but the "public" files will be pushed to the github pages, they can be publicly available from anyone, or only to specific users, or to no one, and so they can be stored as files that will be loaded directly with `fetch`. For the custom permissions files, I will add a password file access.

- All the dynamic user content will be stored in a specific folder part and I will be very careful about not going outside this folder from custom user actions. And so if there is an issue, I can easily backup this folder, then delete it.

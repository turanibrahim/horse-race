# Prompt List
This document contains a list of prompts used for various tasks. Prompt list will be on ascending order.

- Add tw4 to the project
- don't install next install vite latest tailwind
- We will continue to use v4 but not the next version @tailwindcss/vite install this
- Make tw4 theme with these colors

    /* CSS HEX */
    --tea-green: #cae7b9ff;
    --flax: #f3de8aff;
    --coral-pink: #eb9486ff;
    --cool-gray: #7e7f9aff;
    --cadet-gray: #97a7b3ff;

    /* CSS HSL */
    --tea-green: hsla(98, 49%, 82%, 1);
    --flax: hsla(48, 81%, 75%, 1);
    --coral-pink: hsla(8, 72%, 72%, 1);
    --cool-gray: hsla(238, 12%, 55%, 1);
    --cadet-gray: hsla(206, 16%, 65%, 1);

    /* SCSS HEX */
    $tea-green: #cae7b9ff;
    $flax: #f3de8aff;
    $coral-pink: #eb9486ff;
    $cool-gray: #7e7f9aff;
    $cadet-gray: #97a7b3ff;

    /* SCSS HSL */
    $tea-green: hsla(98, 49%, 82%, 1);
    $flax: hsla(48, 81%, 75%, 1);
    $coral-pink: hsla(8, 72%, 72%, 1);
    $cool-gray: hsla(238, 12%, 55%, 1);
    $cadet-gray: hsla(206, 16%, 65%, 1);

    /* SCSS RGB */
    $tea-green: rgba(202, 231, 185, 1);
    $flax: rgba(243, 222, 138, 1);
    $coral-pink: rgba(235, 148, 134, 1);
    $cool-gray: rgba(126, 127, 154, 1);
    $cadet-gray: rgba(151, 167, 179, 1);

    /* SCSS Gradient */
    $gradient-top: linear-gradient(0deg, #cae7b9ff, #f3de8aff, #eb9486ff, #7e7f9aff, #97a7b3ff);
    $gradient-right: linear-gradient(90deg, #cae7b9ff, #f3de8aff, #eb9486ff, #7e7f9aff, #97a7b3ff);
    $gradient-bottom: linear-gradient(180deg, #cae7b9ff, #f3de8aff, #eb9486ff, #7e7f9aff, #97a7b3ff);
    $gradient-left: linear-gradient(270deg, #cae7b9ff, #f3de8aff, #eb9486ff, #7e7f9aff, #97a7b3ff);
    $gradient-top-right: linear-gradient(45deg, #cae7b9ff, #f3de8aff, #eb9486ff, #7e7f9aff, #97a7b3ff);
    $gradient-bottom-right: linear-gradient(135deg, #cae7b9ff, #f3de8aff, #eb9486ff, #7e7f9aff, #97a7b3ff);
    $gradient-top-left: linear-gradient(225deg, #cae7b9ff, #f3de8aff, #eb9486ff, #7e7f9aff, #97a7b3ff);
    $gradient-bottom-left: linear-gradient(315deg, #cae7b9ff, #f3de8aff, #eb9486ff, #7e7f9aff, #97a7b3ff);
    $gradient-radial: radial-gradient(#cae7b9ff, #f3de8aff, #eb9486ff, #7e7f9aff, #97a7b3ff);
- add headless ui vue into the project
- create atoms folder under components and generate VButton component based on headless-ui button component
  - make variantClass section more lean and maintainable
  - don't split tailwind classes
- add pinia to project
  - update the store based on the prompt file
  - just init the stores and make config don't create any store or types yet
- Generate horse store, horse store will have horse list. Horse list will have 20 horses. Create generator function for horses. Every horse will have unique name, color and condition score. Condition score will be 1 to 100.
  - I see 20 names but 10 colors. Colors should be hex code.
  - don't use any comment code should explain itself
  - create generateHorse function and create horse inside of it
  - use arrow functions
- update files names inside project based on prompt
- Create race store. We will have 6 session of races. Every race will have 10 random horses. Every race have different lengths.

  ○ Round 1: 1200 meters
  ○ Round 2: 1400 meters
  ○ Round 3: 1600 meters
  ○ Round 4: 1800 meters
  ○ Round 5: 2000 meters
  ○ Round 6: 2200 meters

  I will have list of result for every race. You will have function that runs every race and horses compete each other on this function.
  - uses horses we generated inside horse store. Don't create new horses on here
  - Horse store have 20 horses you need to choose 10 random horses among them
  - delete comments code should explain itself update code based on that
- Replace all relative imports with alias import
- add vue router to project
  - add pages folder into src
  - create theme page under pages folder.
  - move everything under app to that theme page
  - pages will have [page-name].page.vue convention
- Generate v-table component under atoms folder
- add eslint to the project. It should cover vue recommended best proactices and airbnb ts
  - i want to use latest eslint version do config based on that
  - run lit and fix all the issues
  - Make theme page theme-preview.page.vue instead
- add start/pause ability to races. User will be able pause races
- Generate v-drawer component under atoms folder
- create a page named racing-dashboard under pages. It will ba maing page
  - update router config racing-dashboard will be main page theme will be under theme route
- add header to racing dashboard page. This header will have 3 buttons one one the left named Horse List, two button on the right named Generate Program and Start Pause Race
  - use v-button and tailwind classes on the header component
- add header to racing dashboard page. This header will have 3 buttons one one the left named Horse List, two button on the right named Generate Program and Start Pause Race
  - use v-button and tailwind classes on the header component
  - 
    ```
    - create drawer includes horses table. Horse name will be same color with horse. Add condition as a column
    - Use drawer inside the dasboard
    - When user click `handleHorseList` show drawer
    ```
  - emit convention will be [modifier]:[event-name] like update:model-value, click:item
  - 
    ```
    - use condition score as a number
    - put drawer on the left of the screen
    ```
- Create select component under atoms, use headless ui
- when user click generate program button it should generate all necessary sessions on the race store. We will have session list on the dashboard page. Use select to choose session. Put session horse list and condition score table under of it. When I choose session on the select box it should show that session on the table
  - With session I mean races, update the logic based on that. Currently we create races on init but we need to that on user click
- when user click generate program button it should generate all necessary sessions on the race store. We will have session list on the dashboard page. Use select to choose session. Put session horse list and condition score table under of it. When I choose session on the select box it should show that session on the table
- I want to see actual race on the dashboard when user click to start/pause race button race should happen on the dashboard
- Horse positions on the track component changes during the race it shouldn't happen fix that
  - Sessions are too long shorten them little bit
- I want to have real horse animation on the track
  - Find horse svg on the internet animate that
  - use this [horse.svg]
  - horse size should be little bit small
  - little bit more small
- horse list table and session horses table should be identical. Make it horse-table and use it both
  - horse table should be molecule instead of organism
  - session results and racing-dashboard-header also molecule
- 
  ```
    - race track will always show active running race
    - when use change session with select it should only change result and session horses table
    - when user start race all the races should run sequencally.
    - user should able to see results on the bottom and able change sessions with select
  ```
  - Put warning for user that says you should start race to see race track
- everything on the project should be tw 4 class don't use style section
- race finish time should fixed to 2 digits
- we don't need to do it here we can do this on the dashboard
- constants will be under src/constants/ folder. Scan all the constants and move them there
- refactor race store. Use dry, encapsulation, function composition. I want to understand file easyly when read to to bottom
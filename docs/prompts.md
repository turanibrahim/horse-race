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
- 
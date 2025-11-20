HOW TO ADD NEW TECHNOLOGY ICONS
===============================

1. Download the SVG icon (e.g. from devicon.dev) and save it to:
   assets/icons/tech/

   Make sure the filename is lowercase and simple (e.g., `python.svg`).

2. Run the sprite generation script from the project root:
   python3 generate_sprite.py

3. The script will regenerate `assets/icons/tech-sprite.svg` including your new icon.

4. Use the icon in your HTML:
   <svg class="tech-icon" width="40" height="40">
     <use href="assets/icons/tech-sprite.svg#icon-python"/>
   </svg>

   (Replace `icon-python` with `icon-yourfilename` based on the filename you saved in step 1)


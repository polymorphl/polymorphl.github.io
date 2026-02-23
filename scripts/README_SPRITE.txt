HOW TO ADD NEW TECHNOLOGY ICONS
===============================

To add a new technology icon to the sprite:

1. Download the SVG icon (e.g. from devicon.dev) and save it to:
   public/assets/icons/

   Make sure the filename is lowercase and simple (e.g., `python.svg`).

2. Run the sprite generation script from the project root:
   python3 scripts/generate_sprite.py

3. The script will regenerate `public/assets/icons/sprite.svg` including your new icon.

4. Use the icon in your HTML:
   <svg class="tech-icon" width="40" height="40">
     <use href="assets/icons/sprite.svg#python"/>
   </svg>

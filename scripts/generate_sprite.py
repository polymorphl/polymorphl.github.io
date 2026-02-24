import os
import re

def create_sprite():
    # Get the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Project root is one level up
    project_root = os.path.dirname(script_dir)
    
    icons_dir = os.path.join(project_root, 'public', 'assets', 'icons')
    output_file = os.path.join(project_root, 'public', 'assets', 'icons', 'sprite.svg')
    
    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_file), exist_ok=True)

    if not os.path.exists(icons_dir):
        print(f"Directory {icons_dir} does not exist. Please create it and add .svg files.")
        return
    
    sprite_content = ['<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">']
    
    # Get all SVG files except the sprite.svg itself
    files = [f for f in os.listdir(icons_dir) if f.endswith('.svg') and f != 'sprite.svg']
    files.sort() # Sort for deterministic output

    if not files:
        print(f"No SVG files found in {icons_dir}")
        return

    for filename in files:
        file_path = os.path.join(icons_dir, filename)
        icon_id = os.path.splitext(filename)[0]
        
        with open(file_path, 'r') as f:
            content = f.read()
            
        # Extract viewBox
        viewbox_match = re.search(r'viewBox="([^"]+)"', content)
        viewbox = viewbox_match.group(1) if viewbox_match else '0 0 128 128'
        
        # Extract content inside svg tag
        # Find the opening <svg> tag
        svg_start_match = re.search(r'<svg[^>]*>', content)
        if svg_start_match:
            start_pos = svg_start_match.end()
            # Find the last </svg> tag (in case there are nested svgs)
            end_pos = content.rfind('</svg>')
            if end_pos > start_pos:
                content = content[start_pos:end_pos].strip()
            else:
                # Fallback: simple regex
                content = re.sub(r'<svg[^>]*>', '', content, count=1)
                content = re.sub(r'</svg>', '', content, count=1)
        else:
            # No svg tag found, use content as-is
            pass
        
        symbol = f'<symbol id="{icon_id}" viewBox="{viewbox}">{content}</symbol>'
        sprite_content.append(symbol)
    
    sprite_content.append('</svg>')
    
    with open(output_file, 'w') as f:
        f.write('\n'.join(sprite_content))
        
    print(f"Sprite created at {output_file}")

if __name__ == '__main__':
    create_sprite()

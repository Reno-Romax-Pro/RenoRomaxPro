import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

# We'll hunt for both variations of the old logo link.
old_logo_pattern = re.compile(r'https://res\.cloudinary\.com/dg27n9d1b/image/upload/v1771568816/2_jrvdpm\.png')
old_logo_postimg_pattern = re.compile(r'https://i\.postimg\.cc/jjm6Z2RL/logo\.png')

# Cloudinary logo 2 (About Us section specific)
old_logo_about_pattern = re.compile(r'https://res\.cloudinary\.com/dg27n9d1b/image/upload/v1773095008/%D0%94%D0%BB%D1%8F_%D1%81%D0%B0%D0%B9%D1%82%D0%B0._kg5nll\.jpg')

# Find missing <img class="logo-img" /> where <a href="#home" class="logo"> exists and no img tag is inside.
# (This happens in headers where maybe the text was used instead of image).
# Let's also check catalog.html line 545 for logo-text vs logo-img

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace specific known logo links
    content = old_logo_pattern.sub('logo.jpg', content)
    content = old_logo_postimg_pattern.sub('logo.jpg', content)
    
    # We will NOT replace the about section image per user request "установи во всех местах в шапке. В подвале. Где не хватает логотипа"
    # Wait, the user said "в местах, где он должен быть сейчас там. Отсутствует логотип, проверь и установи во всех местах в шапке. В подвале. Где не хватает логотипа"

    # Some headers might have missing image entirely.
    # In catalog.html:
    # <a href="index.html" class="logo">
    #   <span class="logo-text">Reno-Romax-Pro</span>
    # </a>
    
    # Let's replace the <span class="logo-text"> with the image tag in *.html files
    logo_text_pattern = re.compile(r'<a href="index\.html" class="logo">\s*<span class="logo-text">Reno-Romax-Pro</span>\s*</a>', re.DOTALL)
    replacement = '<a href="index.html" class="logo">\n        <img src="logo.jpg" alt="Reno-Romax-Pro Logo" class="logo-img" />\n      </a>'
    content = logo_text_pattern.sub(replacement, content)

    # In privacy.html, there's no header/footer explicitly found using grep, but if there's any text based logo, let's catch it.
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Update complete for {len(html_files)} HTML files.")

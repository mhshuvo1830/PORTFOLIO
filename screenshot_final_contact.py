from pathlib import Path
from playwright.sync_api import sync_playwright
import re
root=Path('/mnt/data/contact_no_photo_final')
html=(root/'contact.html').read_text()
css=(root/'styles.css').read_text()
js=(root/'script.js').read_text()
html=re.sub(r'<link[^>]+href="styles\.css\?[^\"]+"[^>]*>', '', html)
html=html.replace('<script defer="" src="script.js"></script>','')
html=html.replace('</head>','<style>'+css+'</style></head>')
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [1440,390]:
  page=browser.new_page(viewport={'width':w,'height':900},device_scale_factor=1)
  page.set_content(html,wait_until='load')
  page.add_script_tag(content=js)
  page.evaluate('document.querySelector(".contact-feature").classList.remove("waiting")')
  page.locator('.contact-feature').screenshot(path=str(root/'docs'/'final-contact-previews'/f'form-only-{w}.png'),animations='disabled')
  page.close()
 browser.close()

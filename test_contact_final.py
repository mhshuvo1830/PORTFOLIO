from pathlib import Path
import threading
from playwright.sync_api import sync_playwright
import json
root=Path('/mnt/data/contact_no_photo_final')
out=root/'docs'/'final-contact-previews';out.mkdir(parents=True,exist_ok=True)
css=(root/'styles.css').read_text()
js=(root/'script.js').read_text()
def load_page(page,filename):
    html=(root/filename).read_text()
    import re
    html=re.sub(r'<link[^>]+href="styles\.css\?[^"]+"[^>]*>', '', html)
    html=re.sub(r'<script defer="" src="script\.js"></script>', '', html)
    html=html.replace('</head>', '<style>'+css+'</style></head>')
    page.set_content(html,wait_until='load',timeout=30000)
    page.add_script_tag(content=js)
results=[]; errors=[]
def ck(name, cond):
 results.append({'check':name,'passed':bool(cond)})
 if not cond: errors.append(name)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,label in [(1440,'desktop'),(768,'tablet'),(390,'mobile')]:
  page=browser.new_page(viewport={'width':width,'height':900},device_scale_factor=1)
  page.on('pageerror',lambda e:errors.append('JS error: '+str(e)))
  load_page(page,'contact.html')
  page.screenshot(path=str(out/f'contact-{label}.png'),full_page=False,animations='disabled')
  ck(f'{label}: contact portrait absent',page.locator('.contact-portrait').count()==0)
  ck(f'{label}: form present',page.locator('#contact-form').count()==1)
  ck(f'{label}: contact information cards present',page.locator('.contact-card').count()==3)
  ck(f'{label}: stylesheet loads',page.evaluate('getComputedStyle(document.body).backgroundColor')=='rgb(255, 252, 236)')
  ck(f'{label}: no horizontal overflow',page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'))
  ck(f'{label}: single column effective',page.locator('.contact-feature').evaluate("e=>getComputedStyle(e).display")=='block')
  # verify form invalid and valid
  page.locator('#contact-form button[type=submit]').click()
  ck(f'{label}: missing required fields rejected', 'Please complete' in page.locator('#form-status').inner_text())
  page.locator('#name').fill('Example Buyer')
  page.locator('#email').fill('buyer@example.com')
  page.locator('input[name="reason"][value="Collaboration"]').check()
  page.locator('#topic').select_option(label='Front-end development')
  page.locator('#message').fill('Hello, I would like to discuss a web project.')
  page.locator('#contact-form button[type=submit]').click()
  ck(f'{label}: email draft generated',not page.locator('#draft-actions').is_hidden())
  ck(f'{label}: no fake sent claim','No message has been sent.' in page.locator('#form-status').inner_text())
  if width==390:
   page.locator('.menu-toggle').click()
   ck('mobile navigation opens',page.locator('#nav').evaluate("e=>e.classList.contains('open')"))
  page.close()
 # sanity other pages and asset exist, no source broken links
 page=browser.new_page()
 for name in ['index','about','skills','projects','research','contact']:
  load_page(page,name+'.html')
  ck('page exists: '+name,page.locator('title').count()==1)
 ck('original photo retained', (root/'assets/original-photo.jpg').stat().st_size>100000)
 ck('CV retained', (root/'resume.pdf').stat().st_size>1000)
 browser.close()

(out/'test-results.json').write_text(json.dumps({'results':results,'errors':errors},indent=2))
print('Passed',sum(x['passed'] for x in results),'/',len(results))
print('Errors',errors)

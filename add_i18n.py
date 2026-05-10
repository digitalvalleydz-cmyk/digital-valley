import sys
import re

def process_login():
    with open('login.html', 'r', encoding='utf-8') as f:
        content = f.read()

    replacements = {
        '<title>Login': '<title data-i18n=\"title_login\">Login',
        '<label class=\"form-label\" for=\"email\">Email</label>': '<label class=\"form-label\" for=\"email\" data-i18n=\"label_email\">Email</label>',
        'placeholder=\"you@example.com\"': 'placeholder=\"you@example.com\" data-i18n=\"ph_email\"',
        '<label class=\"form-label\" for=\"password\">Password</label>': '<label class=\"form-label\" for=\"password\" data-i18n=\"label_password\">Password</label>',
        'placeholder=\"••••••••\"': 'placeholder=\"••••••••\" data-i18n=\"ph_password\"',
        ' Remember me</label>': ' <span data-i18n=\"remember_me\">Remember me</span></label>',
        '<a href=\"#\" class=\"text-primary hover:underline\">Forgot password?</a>': '<a href=\"#\" class=\"text-primary hover:underline\" data-i18n=\"forgot_password\">Forgot password?</a>',
        '<button type=\"submit\" class=\"btn-primary w-full py-3\">Sign In</button>': '<button type=\"submit\" class=\"btn-primary w-full py-3\" data-i18n=\"btn_signin\">Sign In</button>',
        'Don\'t have an account? <a href=\"register.html\"': '<span data-i18n=\"no_account\">Don\'t have an account?</span> <a href=\"register.html\"',
        '<span class=\"text-sm text-[var(--text-secondary)]\">or</span>': '<span class=\"text-sm text-[var(--text-secondary)]\" data-i18n=\"text_or\">or</span>',
        'Google</button>': '<span data-i18n=\"btn_google\">Google</span></button>',
        'GitHub</button>': '<span data-i18n=\"btn_github\">GitHub</span></button>'
    }

    for k, v in replacements.items():
        content = content.replace(k, v)

    with open('login.html', 'w', encoding='utf-8') as f:
        f.write(content)

def process_register():
    with open('register.html', 'r', encoding='utf-8') as f:
        content = f.read()

    replacements = {
        '<title>Register': '<title data-i18n=\"title_register\">Register',
        '<label class=\"form-label\" for=\"fname\">First Name</label>': '<label class=\"form-label\" for=\"fname\" data-i18n=\"label_fname\">First Name</label>',
        'placeholder=\"John\"': 'placeholder=\"John\" data-i18n=\"ph_fname\"',
        '<label class=\"form-label\" for=\"lname\">Last Name</label>': '<label class=\"form-label\" for=\"lname\" data-i18n=\"label_lname\">Last Name</label>',
        'placeholder=\"Doe\"': 'placeholder=\"Doe\" data-i18n=\"ph_lname\"',
        '<label class=\"form-label\" for=\"username\">Username</label>': '<label class=\"form-label\" for=\"username\" data-i18n=\"label_username\">Username</label>',
        'placeholder=\"johndoe\"': 'placeholder=\"johndoe\" data-i18n=\"ph_username\"',
        'placeholder=\"Min 8 characters\"': 'placeholder=\"Min 8 characters\" data-i18n=\"ph_password_min\"',
        '<label class=\"form-label\" for=\"confirm-password\">Confirm Password</label>': '<label class=\"form-label\" for=\"confirm-password\" data-i18n=\"label_confirm_password\">Confirm Password</label>',
        'placeholder=\"Re-enter password\"': 'placeholder=\"Re-enter password\" data-i18n=\"ph_confirm_password\"',
        '<label class=\"form-label\">Account Type</label>': '<label class=\"form-label\" data-i18n=\"label_account_type\">Account Type</label>',
        '<span class=\"text-sm font-medium\">Buyer</span>': '<span class=\"text-sm font-medium\" data-i18n=\"type_buyer\">Buyer</span>',
        '<span class=\"text-sm font-medium\">Seller</span>': '<span class=\"text-sm font-medium\" data-i18n=\"type_seller\">Seller</span>',
        ' I agree to the <a href=\"#\" class=\"text-primary hover:underline\">Terms</a> & <a': ' <span data-i18n=\"agree_terms\">I agree to the </span><a href=\"#\" class=\"text-primary hover:underline\" data-i18n=\"link_terms\">Terms</a><span data-i18n=\"agree_and\"> & </span><a',
        'Already have an account? <a href=\"login.html\"': '<span data-i18n=\"has_account\">Already have an account?</span> <a href=\"login.html\"',
        '<a href=\"login.html\" class=\"text-primary font-semibold hover:underline\">Sign In</a>': '<a href=\"login.html\" class=\"text-primary font-semibold hover:underline\" data-i18n=\"btn_signin\">Sign In</a>',
        '<label class=\"form-label\" for=\"email\">Email</label>': '<label class=\"form-label\" for=\"email\" data-i18n=\"label_email\">Email</label>',
        'placeholder=\"you@example.com\"': 'placeholder=\"you@example.com\" data-i18n=\"ph_email\"',
        '<label class=\"form-label\" for=\"password\">Password</label>': '<label class=\"form-label\" for=\"password\" data-i18n=\"label_password\">Password</label>'
    }

    for k, v in replacements.items():
        content = content.replace(k, v)

    with open('register.html', 'w', encoding='utf-8') as f:
        f.write(content)

def process_index():
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()

    replacements = {
        '<title>Home': '<title data-i18n=\"title_home\">Home',
        '<span class=\"badge badge-purple mb-2\">UI Kit</span>': '<span class=\"badge badge-purple mb-2\" data-i18n=\"badge_ui_kit\">UI Kit</span>',
        '<span class=\"badge badge-blue mb-2\">Template</span>': '<span class=\"badge badge-blue mb-2\" data-i18n=\"badge_template\">Template</span>',
        '<span class=\"badge badge-green mb-2\">eBook</span>': '<span class=\"badge badge-green mb-2\" data-i18n=\"badge_ebook\">eBook</span>',
        '<span class=\"badge badge-orange mb-2\">Audio</span>': '<span class=\"badge badge-orange mb-2\" data-i18n=\"badge_audio\">Audio</span>',
        
        '<h3 class=\"font-bold mb-1\">Premium Dashboard UI Kit</h3>': '<h3 class=\"font-bold mb-1\" data-i18n=\"prod_1_title\">Premium Dashboard UI Kit</h3>',
        'alt=\"\">Chris D.': 'alt=\"\"><span data-i18n=\"prod_1_author\">Chris D.</span>',
        
        '<h3 class=\"font-bold mb-1\">React Admin Template</h3>': '<h3 class=\"font-bold mb-1\" data-i18n=\"prod_2_title\">React Admin Template</h3>',
        'alt=\"\">Dev Studio': 'alt=\"\"><span data-i18n=\"prod_2_author\">Dev Studio</span>',
        
        '<h3 class=\"font-bold mb-1\">Marketing Mastery Guide</h3>': '<h3 class=\"font-bold mb-1\" data-i18n=\"prod_3_title\">Marketing Mastery Guide</h3>',
        'alt=\"\">Lisa M.': 'alt=\"\"><span data-i18n=\"prod_3_author\">Lisa M.</span>',
        
        '<h3 class=\"font-bold mb-1\">Lo-Fi Music Pack (50 Tracks)</h3>': '<h3 class=\"font-bold mb-1\" data-i18n=\"prod_4_title\">Lo-Fi Music Pack (50 Tracks)</h3>',
        'alt=\"\">BeatMaker': 'alt=\"\"><span data-i18n=\"prod_4_author\">BeatMaker</span>',
        
        '<h3 class=\"font-bold mb-1\">Professional Logo Design</h3>': '<h3 class=\"font-bold mb-1\" data-i18n=\"svc_1_title\">Professional Logo Design</h3>',
        'alt=\"\">Alex K.': 'alt=\"\"><span data-i18n=\"svc_1_author\">Alex K.</span>',
        
        '<h3 class=\"font-bold mb-1\">WordPress Website Setup</h3>': '<h3 class=\"font-bold mb-1\" data-i18n=\"svc_2_title\">WordPress Website Setup</h3>',
        'alt=\"\">Maria S.': 'alt=\"\"><span data-i18n=\"svc_2_author\">Maria S.</span>',
        
        '<h3 class=\"font-bold mb-1\">SEO Blog Articles (5 Pack)</h3>': '<h3 class=\"font-bold mb-1\" data-i18n=\"svc_3_title\">SEO Blog Articles (5 Pack)</h3>',
        'alt=\"\">James W.': 'alt=\"\"><span data-i18n=\"svc_3_author\">James W.</span>',
        
        '<h3 class=\"font-bold mb-1\">Social Media Management</h3>': '<h3 class=\"font-bold mb-1\" data-i18n=\"svc_4_title\">Social Media Management</h3>',
        'alt=\"\">Sara L.': 'alt=\"\"><span data-i18n=\"svc_4_author\">Sara L.</span>',
        
        '\"DigitalValley transformed my freelance career. I\\'ve earned over $50K selling design assets here!\"': '<span data-i18n=\"testimonial_1_desc\">\"DigitalValley transformed my freelance career. I\\'ve earned over $50K selling design assets here!\"</span>',
        '<div class=\"font-bold\">Emma R.</div>': '<div class=\"font-bold\" data-i18n=\"testimonial_1_author\">Emma R.</div>',
        '<div class=\"text-sm text-[var(--text-secondary)]\">Graphic Designer</div>': '<div class=\"text-sm text-[var(--text-secondary)]\" data-i18n=\"testimonial_1_role\">Graphic Designer</div>',
        
        '\"Best platform for buying quality code templates. The review system helps find top sellers.\"': '<span data-i18n=\"testimonial_2_desc\">\"Best platform for buying quality code templates. The review system helps find top sellers.\"</span>',
        '<div class=\"font-bold\">Marcus T.</div>': '<div class=\"font-bold\" data-i18n=\"testimonial_2_author\">Marcus T.</div>',
        '<div class=\"text-sm text-[var(--text-secondary)]\">Startup Founder</div>': '<div class=\"text-sm text-[var(--text-secondary)]\" data-i18n=\"testimonial_2_role\">Startup Founder</div>',
        
        '\"I love how easy it is to set up a shop and start selling. Great support team too!\"': '<span data-i18n=\"testimonial_3_desc\">\"I love how easy it is to set up a shop and start selling. Great support team too!\"</span>',
        '<div class=\"font-bold\">Priya K.</div>': '<div class=\"font-bold\" data-i18n=\"testimonial_3_author\">Priya K.</div>',
        '<div class=\"text-sm text-[var(--text-secondary)]\">Content Creator</div>': '<div class=\"text-sm text-[var(--text-secondary)]\" data-i18n=\"testimonial_3_role\">Content Creator</div>'
    }

    for k, v in replacements.items():
        content = content.replace(k, v)

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)

try:
    process_login()
    process_register()
    process_index()
    print('SUCCESS')
except Exception as e:
    print('ERROR:', e)

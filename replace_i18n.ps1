$content = Get-Content index.html -Raw -Encoding UTF8
$replacements = [ordered]@{
    '<title>Home' = '<title data-i18n="title_home">Home'
    '<span class="badge badge-purple mb-2">UI Kit</span>' = '<span class="badge badge-purple mb-2" data-i18n="badge_ui_kit">UI Kit</span>'
    '<span class="badge badge-blue mb-2">Template</span>' = '<span class="badge badge-blue mb-2" data-i18n="badge_template">Template</span>'
    '<span class="badge badge-green mb-2">eBook</span>' = '<span class="badge badge-green mb-2" data-i18n="badge_ebook">eBook</span>'
    '<span class="badge badge-orange mb-2">Audio</span>' = '<span class="badge badge-orange mb-2" data-i18n="badge_audio">Audio</span>'
    '<h3 class="font-bold mb-1">Premium Dashboard UI Kit</h3>' = '<h3 class="font-bold mb-1" data-i18n="prod_1_title">Premium Dashboard UI Kit</h3>'
    'alt="">Chris D.' = 'alt=""><span data-i18n="prod_1_author">Chris D.</span>'
    '<h3 class="font-bold mb-1">React Admin Template</h3>' = '<h3 class="font-bold mb-1" data-i18n="prod_2_title">React Admin Template</h3>'
    'alt="">Dev Studio' = 'alt=""><span data-i18n="prod_2_author">Dev Studio</span>'
    '<h3 class="font-bold mb-1">Marketing Mastery Guide</h3>' = '<h3 class="font-bold mb-1" data-i18n="prod_3_title">Marketing Mastery Guide</h3>'
    'alt="">Lisa M.' = 'alt=""><span data-i18n="prod_3_author">Lisa M.</span>'
    '<h3 class="font-bold mb-1">Lo-Fi Music Pack \(50 Tracks\)</h3>' = '<h3 class="font-bold mb-1" data-i18n="prod_4_title">Lo-Fi Music Pack (50 Tracks)</h3>'
    'alt="">BeatMaker' = 'alt=""><span data-i18n="prod_4_author">BeatMaker</span>'
    '<h3 class="font-bold mb-1">Professional Logo Design</h3>' = '<h3 class="font-bold mb-1" data-i18n="svc_1_title">Professional Logo Design</h3>'
    'alt="">Alex K.' = 'alt=""><span data-i18n="svc_1_author">Alex K.</span>'
    '<h3 class="font-bold mb-1">WordPress Website Setup</h3>' = '<h3 class="font-bold mb-1" data-i18n="svc_2_title">WordPress Website Setup</h3>'
    'alt="">Maria S.' = 'alt=""><span data-i18n="svc_2_author">Maria S.</span>'
    '<h3 class="font-bold mb-1">SEO Blog Articles \(5 Pack\)</h3>' = '<h3 class="font-bold mb-1" data-i18n="svc_3_title">SEO Blog Articles (5 Pack)</h3>'
    'alt="">James W.' = 'alt=""><span data-i18n="svc_3_author">James W.</span>'
    '<h3 class="font-bold mb-1">Social Media Management</h3>' = '<h3 class="font-bold mb-1" data-i18n="svc_4_title">Social Media Management</h3>'
    'alt="">Sara L.' = 'alt=""><span data-i18n="svc_4_author">Sara L.</span>'
    '"DigitalValley transformed my freelance career\. I''ve earned over \$50K selling design assets here!"' = '<span data-i18n="testimonial_1_desc">"DigitalValley transformed my freelance career. I''ve earned over $50K selling design assets here!"</span>'
    '<div class="font-bold">Emma R\.</div>' = '<div class="font-bold" data-i18n="testimonial_1_author">Emma R.</div>'
    '<div class="text-sm text-\[var\(--text-secondary\)\]">Graphic Designer</div>' = '<div class="text-sm text-[var(--text-secondary)]" data-i18n="testimonial_1_role">Graphic Designer</div>'
    '"Best platform for buying quality code templates\. The review system helps find top sellers\."' = '<span data-i18n="testimonial_2_desc">"Best platform for buying quality code templates. The review system helps find top sellers."</span>'
    '<div class="font-bold">Marcus T\.</div>' = '<div class="font-bold" data-i18n="testimonial_2_author">Marcus T.</div>'
    '<div class="text-sm text-\[var\(--text-secondary\)\]">Startup Founder</div>' = '<div class="text-sm text-[var(--text-secondary)]" data-i18n="testimonial_2_role">Startup Founder</div>'
    '"I love how easy it is to set up a shop and start selling\. Great support team too!"' = '<span data-i18n="testimonial_3_desc">"I love how easy it is to set up a shop and start selling. Great support team too!"</span>'
    '<div class="font-bold">Priya K\.</div>' = '<div class="font-bold" data-i18n="testimonial_3_author">Priya K.</div>'
    '<div class="text-sm text-\[var\(--text-secondary\)\]">Content Creator</div>' = '<div class="text-sm text-[var(--text-secondary)]" data-i18n="testimonial_3_role">Content Creator</div>'
}

foreach ($key in $replacements.Keys) {
    $content = $content -replace $key, $replacements[$key]
}

Set-Content index.html $content -Encoding UTF8

$contentLogin = Get-Content login.html -Raw -Encoding UTF8
$contentLogin = $contentLogin -replace '<title>Login', '<title data-i18n="title_login">Login'
Set-Content login.html $contentLogin -Encoding UTF8

$contentRegister = Get-Content register.html -Raw -Encoding UTF8
$contentRegister = $contentRegister -replace '<title>Register', '<title data-i18n="title_register">Register'
Set-Content register.html $contentRegister -Encoding UTF8

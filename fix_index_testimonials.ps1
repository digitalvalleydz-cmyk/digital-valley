$content = Get-Content index.html -Raw -Encoding UTF8

$repl1 = '<p class="text-\[var\(--text-secondary\)\] mb-4">"DigitalValley transformed my freelance career\.\s*I''ve earned over \$50K selling design assets here!"</p>'
$target1 = '<p class="text-[var(--text-secondary)] mb-4" data-i18n="testimonial_1_desc">"DigitalValley transformed my freelance career. I''ve earned over $50K selling design assets here!"</p>'
$content = [regex]::Replace($content, $repl1, $target1, "Singleline")

$repl2 = '<p class="text-\[var\(--text-secondary\)\] mb-4">"Best platform for buying quality code templates\.\s*The review system helps find top sellers\."</p>'
$target2 = '<p class="text-[var(--text-secondary)] mb-4" data-i18n="testimonial_2_desc">"Best platform for buying quality code templates. The review system helps find top sellers."</p>'
$content = [regex]::Replace($content, $repl2, $target2, "Singleline")

$repl3 = '<p class="text-\[var\(--text-secondary\)\] mb-4">"I love how easy it is to set up a shop and start\s*selling\. Great support team too!"</p>'
$target3 = '<p class="text-[var(--text-secondary)] mb-4" data-i18n="testimonial_3_desc">"I love how easy it is to set up a shop and start selling. Great support team too!"</p>'
$content = [regex]::Replace($content, $repl3, $target3, "Singleline")

Set-Content index.html $content -Encoding UTF8

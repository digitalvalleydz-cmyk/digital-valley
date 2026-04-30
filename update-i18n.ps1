$dir = "d:\AI\digital-marketplace"
$files = Get-ChildItem -Path $dir -Filter "*.html"

$i18nMapping = @{
  '>Home<' = ' data-i18n="nav_home">Home<'
  '>Marketplace<' = ' data-i18n="nav_marketplace">Marketplace<'
  '>Sell<' = ' data-i18n="nav_sell">Sell<'
  '>Dashboard<' = ' data-i18n="nav_dashboard">Dashboard<'
  '>Login<' = ' data-i18n="nav_login">Login<'
  '>Register<' = ' data-i18n="nav_register">Register<'
  'placeholder="Search products & services..."' = 'placeholder="Search products & services..." data-i18n="search_placeholder"'
  'placeholder="Search products..."' = 'placeholder="Search products..." data-i18n="search_placeholder"'
  '>Buy &amp; Sell Digital<br>Products &amp; Services<' = ' data-i18n="hero_title">Buy &amp; Sell Digital<br>Products &amp; Services<'
  '>Buy & Sell Digital<br>Products & Services<' = ' data-i18n="hero_title">Buy & Sell Digital<br>Products & Services<'
  '>Join thousands of creators and entrepreneurs on the premier marketplace for digital goods and freelance services.<' = ' data-i18n="hero_subtitle">Join thousands of creators and entrepreneurs on the premier marketplace for digital goods and freelance services.<'
  '>Browse Marketplace <' = ' data-i18n="hero_browse">Browse Marketplace <'
  '>Browse Marketplace<' = ' data-i18n="hero_browse">Browse Marketplace<'
  '>Start Selling<' = ' data-i18n="hero_start">Start Selling<'
  '>Trusted by 12,000+ creators worldwide<' = ' data-i18n="trusted_creators">Trusted by 12,000+ creators worldwide<'
  '>Active Sellers<' = ' data-i18n="stats_sellers">Active Sellers<'
  '>Digital Products<' = ' data-i18n="stats_products">Digital Products<'
  '>Transactions<' = ' data-i18n="stats_transactions">Transactions<'
  '>Browse Categories<' = ' data-i18n="categories_title">Browse Categories<'
  '>Find exactly what you need across our curated categories<' = ' data-i18n="categories_subtitle">Find exactly what you need across our curated categories<'
  '>Design<' = ' data-i18n="cat_design">Design<'
  '>Development<' = ' data-i18n="cat_development">Development<'
  '>Writing<' = ' data-i18n="cat_writing">Writing<'
  '>Marketing<' = ' data-i18n="cat_marketing">Marketing<'
  '>Music<' = ' data-i18n="cat_music">Music<'
  '>Video<' = ' data-i18n="cat_video">Video<'
  '>Featured Services<' = ' data-i18n="featured_services">Featured Services<'
  '>Featured Products<' = ' data-i18n="featured_products">Featured Products<'
  '>View All <' = ' data-i18n="view_all">View All <'
  '>View All<' = ' data-i18n="view_all">View All<'
  '>Add to Cart<' = ' data-i18n="add_to_cart">Add to Cart<'
  '>How It Works<' = ' data-i18n="how_it_works">How It Works<'
  '>1. Register<' = ' data-i18n="how_1_title">1. Register<'
  '>Create your free account in seconds and set up your profile.<' = ' data-i18n="how_1_desc">Create your free account in seconds and set up your profile.<'
  '>2. List or Browse<' = ' data-i18n="how_2_title">2. List or Browse<'
  '>List your digital products or browse thousands of offerings.<' = ' data-i18n="how_2_desc">List your digital products or browse thousands of offerings.<'
  '>3. Buy or Sell<' = ' data-i18n="how_3_title">3. Buy or Sell<'
  '>Secure transactions with instant digital delivery.<' = ' data-i18n="how_3_desc">Secure transactions with instant digital delivery.<'
  '>What Our Users Say<' = ' data-i18n="testimonials_title">What Our Users Say<'
  '>Ready to Start?<' = ' data-i18n="cta_title">Ready to Start?<'
  '>Join our community of creators and start earning today.<' = ' data-i18n="cta_desc">Join our community of creators and start earning today.<'
  '>Create Free Account<' = ' data-i18n="cta_btn">Create Free Account<'
  '>The premier marketplace for digital products and freelance services.<' = ' data-i18n="footer_desc">The premier marketplace for digital products and freelance services.<'
  '>Company<' = ' data-i18n="footer_company">Company<'
  '>About<' = ' data-i18n="footer_about">About<'
  '>Contact<' = ' data-i18n="footer_contact">Contact<'
  '>Careers<' = ' data-i18n="footer_careers">Careers<'
  '>Legal<' = ' data-i18n="footer_legal">Legal<'
  '>Privacy Policy<' = ' data-i18n="footer_privacy">Privacy Policy<'
  '>Terms of Service<' = ' data-i18n="footer_terms">Terms of Service<'
  '>Cookie Policy<' = ' data-i18n="footer_cookie">Cookie Policy<'
  '>Follow Us<' = ' data-i18n="footer_follow">Follow Us<'
  '>© 2026 DigitalValley. All rights reserved.<' = ' data-i18n="footer_rights">© 2026 DigitalValley. All rights reserved.<'
  '>Your cart is empty<' = ' data-i18n="cart_empty">Your cart is empty<'
  '>Browse our marketplace to find amazing products<' = ' data-i18n="cart_empty_desc">Browse our marketplace to find amazing products<'
  '>Welcome Back<' = ' data-i18n="login_welcome">Welcome Back<'
  '>Sign in to your account<' = ' data-i18n="login_desc">Sign in to your account<'
  '>Create Account<' = ' data-i18n="register_title">Create Account<'
  '>Join the DigitalValley community<' = ' data-i18n="register_desc">Join the DigitalValley community<'
}

$switcherHtml = @"
<div class="flex items-center gap-2 border-r border-[var(--border)] pr-3 mr-1 rtl:border-r-0 rtl:border-l rtl:pr-0 rtl:pl-3 rtl:mr-0 rtl:ml-1">
<a href="#" class="lang-btn text-sm font-bold text-primary" data-lang="en">EN</a>
<a href="#" class="lang-btn text-sm text-[var(--text-secondary)]" data-lang="fr">FR</a>
<a href="#" class="lang-btn text-sm text-[var(--text-secondary)]" data-lang="ar">AR</a>
</div>
"@

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw

    if (-not $content.Contains('i18n.js')) {
        $content = $content.Replace('<script src="js/main.js"></script>', "<script src=`"js/i18n.js`"></script>`n<script src=`"js/main.js`"></script>")
    }

    if (-not $content.Contains('data-lang="en"')) {
        $content = $content -replace '<button class="dark-toggle', ($switcherHtml + "`n<button class=`"dark-toggle")
    }

    foreach ($key in $i18nMapping.Keys) {
        $val = $i18nMapping[$key]
        $content = $content.Replace($key, $val)
    }

    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
}

Write-Output "Update complete."

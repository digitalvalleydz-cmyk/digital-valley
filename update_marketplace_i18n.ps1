$content = Get-Content marketplace.html -Raw -Encoding UTF8
$replacements = [ordered]@{
    '<title>Marketplace' = '<title data-i18n="nav_marketplace">Marketplace'
    '<p class="text-\[var\(--text-secondary\)\] mb-6">Discover thousands of digital products and services</p>' = '<p class="text-[var(--text-secondary)] mb-6" data-i18n="mkt_marketplace_desc">Discover thousands of digital products and services</p>'
    '<button class="tab-btn active" data-tab="tab-services">Services</button>' = '<button class="tab-btn active" data-tab="tab-services" data-i18n="mkt_services_tab">Services</button>'
    'Category</label>' = '<span data-i18n="mkt_category">Category</span></label>'
    '<option>All Categories</option>' = '<option data-i18n="mkt_all_categories">All Categories</option>'
    'Price Range</label>' = '<span data-i18n="mkt_price_range">Price Range</span></label>'
    'Up to' = '<span data-i18n="mkt_up_to">Up to</span>'
    'Sort By</label>' = '<span data-i18n="mkt_sort_by">Sort By</span></label>'
    '<option>Newest</option>' = '<option data-i18n="mkt_sort_newest">Newest</option>'
    '<option>Most Popular</option>' = '<option data-i18n="mkt_sort_popular">Most Popular</option>'
    '<option>Lowest Price</option>' = '<option data-i18n="mkt_sort_low_high">Lowest Price</option>'
    '<option>Highest Rated</option>' = '<option data-i18n="mkt_sort_high_low">Highest Rated</option>'
    '<button class="btn-primary w-full text-sm">Apply Filters</button>' = '<button class="btn-primary w-full text-sm" data-i18n="mkt_apply">Apply Filters</button>'
    
    '<h3 class="card-title font-bold mb-1">Custom Logo & Brand Identity</h3>' = '<h3 class="card-title font-bold mb-1" data-i18n="mkt_prod_1_title">Custom Logo & Brand Identity</h3>'
    'alt="">Anna B.' = 'alt=""><span data-i18n="mkt_prod_1_author">Anna B.</span>'
    
    '<h3 class="card-title font-bold mb-1">Full-Stack Web App Development</h3>' = '<h3 class="card-title font-bold mb-1" data-i18n="mkt_prod_2_title">Full-Stack Web App Development</h3>'
    'alt="">David K.' = 'alt=""><span data-i18n="mkt_prod_2_author">David K.</span>'
    
    '<h3 class="card-title font-bold mb-1">Professional Copywriting Service</h3>' = '<h3 class="card-title font-bold mb-1" data-i18n="mkt_prod_3_title">Professional Copywriting Service</h3>'
    'alt="">Rachel M.' = 'alt=""><span data-i18n="mkt_prod_3_author">Rachel M.</span>'
    
    '<h3 class="card-title font-bold mb-1">Social Media Strategy Plan</h3>' = '<h3 class="card-title font-bold mb-1" data-i18n="mkt_prod_4_title">Social Media Strategy Plan</h3>'
    'alt="">Tom H.' = 'alt=""><span data-i18n="mkt_prod_4_author">Tom H.</span>'
    
    '<h3 class="card-title font-bold mb-1">UI/UX Mobile App Design</h3>' = '<h3 class="card-title font-bold mb-1" data-i18n="mkt_prod_5_title">UI/UX Mobile App Design</h3>'
    'alt="">Nina P.' = 'alt=""><span data-i18n="mkt_prod_5_author">Nina P.</span>'
    
    '<h3 class="card-title font-bold mb-1">Explainer Video Production</h3>' = '<h3 class="card-title font-bold mb-1" data-i18n="mkt_prod_6_title">Explainer Video Production</h3>'
    'alt="">Studio X' = 'alt=""><span data-i18n="mkt_prod_6_author">Studio X</span>'
    
    '<h3 class="card-title font-bold mb-1">Starter Dashboard UI Kit</h3>' = '<h3 class="card-title font-bold mb-1" data-i18n="mkt_prod_7_title">Starter Dashboard UI Kit</h3>'
    'alt="">PixelCraft' = 'alt=""><span data-i18n="mkt_prod_7_author">PixelCraft</span>'
    
    '<h3 class="card-title font-bold mb-1">JavaScript Mastery Course</h3>' = '<h3 class="card-title font-bold mb-1" data-i18n="mkt_prod_8_title">JavaScript Mastery Course</h3>'
    'alt="">CodePro' = 'alt=""><span data-i18n="mkt_prod_8_author">CodePro</span>'
    
    '<h3 class="card-title font-bold mb-1">Cinematic Sound FX Bundle</h3>' = '<h3 class="card-title font-bold mb-1" data-i18n="mkt_prod_9_title">Cinematic Sound FX Bundle</h3>'
    'alt="">SoundLab' = 'alt=""><span data-i18n="mkt_prod_9_author">SoundLab</span>'
    
    '<a href="product-detail.html" class="btn-outline w-full text-sm text-center block">View Details</a>' = '<a href="product-detail.html" class="btn-outline w-full text-sm text-center block" data-i18n="mkt_view_details">View Details</a>'
}

foreach ($key in $replacements.Keys) {
    $content = $content -replace $key, $replacements[$key]
}

Set-Content marketplace.html $content -Encoding UTF8

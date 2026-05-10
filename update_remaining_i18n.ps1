# sell.html
$content = Get-Content sell.html -Raw -Encoding UTF8
$replacements = [ordered]@{
    '<title>Sell' = '<title data-i18n="nav_sell">Sell'
    '<h1 class="text-3xl font-800 mb-2">Create New Listing</h1>' = '<h1 class="text-3xl font-800 mb-2" data-i18n="sell_title">Create New Listing</h1>'
    '<p class="text-\[var\(--text-secondary\)\] mb-8">Fill in the details to list your digital product or service</p>' = '<p class="text-[var(--text-secondary)] mb-8" data-i18n="sell_desc">Fill in the details to list your digital product or service</p>'
    'Listing Type</label>' = '<span data-i18n="sell_type">Listing Type</span></label>'
    'Service</div>' = '<span data-i18n="sell_type_service">Service</span></div>'
    'Offer your skills</div>' = '<span data-i18n="sell_type_service_desc">Offer your skills</span></div>'
    'Digital Product</div>' = '<span data-i18n="sell_type_product">Digital Product</span></div>'
    'Sell a downloadable</div>' = '<span data-i18n="sell_type_product_desc">Sell a downloadable</span></div>'
    'Title</label>' = '<span data-i18n="sell_label_title">Title</span></label>'
    'placeholder="E\.g\., Professional Logo Design"' = 'placeholder="E.g., Professional Logo Design" data-i18n="sell_ph_title"'
    'Category</label>' = '<span data-i18n="sell_label_category">Category</span></label>'
    '<option value="">Select category</option>' = '<option value="" data-i18n="sell_ph_category">Select category</option>'
    'Description</label>' = '<span data-i18n="sell_label_description">Description</span></label>'
    'placeholder="Describe your product or service in detail\.\.\."' = 'placeholder="Describe your product or service in detail..." data-i18n="sell_ph_description"'
    'Price \(\$\)</label>' = '<span data-i18n="sell_label_price">Price ($)</span></label>'
    'placeholder="49\.99"' = 'placeholder="49.99" data-i18n="sell_ph_price"'
    'Delivery Time</label>' = '<span data-i18n="sell_label_delivery">Delivery Time</span></label>'
    '<option>1-3 days</option>' = '<option data-i18n="sell_delivery_1_3">1-3 days</option>'
    '<option>3-5 days</option>' = '<option data-i18n="sell_delivery_3_5">3-5 days</option>'
    '<option>1 week</option>' = '<option data-i18n="sell_delivery_1w">1 week</option>'
    '<option>2 weeks</option>' = '<option data-i18n="sell_delivery_2w">2 weeks</option>'
    '<option>Instant \(digital download\)</option>' = '<option data-i18n="sell_delivery_instant">Instant (digital download)</option>'
    'Thumbnail Image</label>' = '<span data-i18n="sell_label_thumbnail">Thumbnail Image</span></label>'
    'Drag & drop or click to upload</p>' = '<span data-i18n="sell_upload_desc">Drag & drop or click to upload</span></p>'
    'PNG, JPG up to 5MB</p>' = '<span data-i18n="sell_upload_limit">PNG, JPG up to 5MB</span></p>'
    'Tags</label>' = '<span data-i18n="sell_label_tags">Tags</span></label>'
    'placeholder="logo, branding, design \(comma separated\)"' = 'placeholder="logo, branding, design (comma separated)" data-i18n="sell_ph_tags"'
    '<button type="submit" class="btn-primary flex-1 py-3"><i class="fas fa-rocket mr-2"></i>Publish Listing</button>' = '<button type="submit" class="btn-primary flex-1 py-3"><i class="fas fa-rocket mr-2"></i><span data-i18n="sell_btn_publish">Publish Listing</span></button>'
    '<button type="button" class="btn-outline flex-1 py-3">Save as Draft</button>' = '<button type="button" class="btn-outline flex-1 py-3" data-i18n="sell_btn_draft">Save as Draft</button>'
}
foreach ($key in $replacements.Keys) { $content = $content -replace $key, $replacements[$key] }
Set-Content sell.html $content -Encoding UTF8

# dashboard.html
$content = Get-Content dashboard.html -Raw -Encoding UTF8
$replacements = [ordered]@{
    '<title>Dashboard' = '<title data-i18n="nav_dashboard">Dashboard'
    'Welcome back, Anna!' = '<span data-i18n="dash_welcome">Welcome back, Anna! 👋</span>'
    'Here''s an overview of your store performance' = '<span data-i18n="dash_overview">Here''s an overview of your store performance</span>'
    'Add New Listing</a>' = '<span data-i18n="dash_add_listing">Add New Listing</span></a>'
    'View Profile</a>' = '<span data-i18n="dash_view_profile">View Profile</span></a>'
    'Total Sales</div>' = '<div class="text-sm text-[var(--text-secondary)]" data-i18n="dash_total_sales">Total Sales</div>'
    'Total Earnings</div>' = '<div class="text-sm text-[var(--text-secondary)]" data-i18n="dash_total_earnings">Total Earnings</div>'
    'Active Listings</div>' = '<div class="text-sm text-[var(--text-secondary)]" data-i18n="dash_active_listings">Active Listings</div>'
    'Pending Orders</div>' = '<div class="text-sm text-[var(--text-secondary)]" data-i18n="dash_pending_orders">Pending Orders</div>'
    'Withdraw Earnings</button>' = '<i class="fas fa-wallet mr-2"></i><span data-i18n="dash_withdraw">Withdraw Earnings</span></button>'
    'View Analytics</button>' = '<i class="fas fa-chart-bar mr-2"></i><span data-i18n="dash_view_analytics">View Analytics</span></button>'
    'Settings</button>' = '<i class="fas fa-cog mr-2"></i><span data-i18n="dash_settings">Settings</span></button>'
    'Recent Orders</h2>' = '<span data-i18n="dash_recent_orders">Recent Orders</span></h2>'
    '<th>Order ID</th>' = '<th data-i18n="dash_th_order_id">Order ID</th>'
    '<th>Product</th>' = '<th data-i18n="dash_th_product">Product</th>'
    '<th>Buyer</th>' = '<th data-i18n="dash_th_buyer">Buyer</th>'
    '<th>Amount</th>' = '<th data-i18n="dash_th_amount">Amount</th>'
    '<th>Status</th>' = '<th data-i18n="dash_th_status">Status</th>'
    '<th>Date</th>' = '<th data-i18n="dash_th_date">Date</th>'
    'Completed</span>' = '<span data-i18n="dash_status_completed">Completed</span>'
    'In Progress</span>' = '<span data-i18n="dash_status_progress">In Progress</span>'
    'Pending</span>' = '<span data-i18n="dash_status_pending">Pending</span>'
    'My Listings</h2>' = '<span data-i18n="dash_my_listings">My Listings</span></h2>'
    'Edit</button>' = '<span data-i18n="dash_btn_edit">Edit</span></button>'
    'Delete</button>' = '<span data-i18n="dash_btn_delete">Delete</span></button>'
}
foreach ($key in $replacements.Keys) { $content = $content -replace $key, $replacements[$key] }
Set-Content dashboard.html $content -Encoding UTF8

# cart.html
$content = Get-Content cart.html -Raw -Encoding UTF8
$replacements = [ordered]@{
    '<title>Cart' = '<title data-i18n="nav_cart">Cart'
    '<h1 class="text-3xl font-800 mb-2">Shopping Cart</h1>' = '<h1 class="text-3xl font-800 mb-2" data-i18n="cart_title">Shopping Cart</h1>'
    '<p class="text-\[var\(--text-secondary\)\] mb-8">Review your items and proceed to checkout</p>' = '<p class="text-[var(--text-secondary)] mb-8" data-i18n="cart_desc">Review your items and proceed to checkout</p>'
    '<h2 class="text-lg font-800 mb-4">Order Summary</h2>' = '<h2 class="text-lg font-800 mb-4" data-i18n="cart_order_summary">Order Summary</h2>'
    'Subtotal</span>' = '<span class="text-[var(--text-secondary)]" data-i18n="cart_subtotal">Subtotal</span>'
    'Platform Fee</span>' = '<span class="text-[var(--text-secondary)]" data-i18n="cart_fee">Platform Fee</span>'
    'Tax</span>' = '<span class="text-[var(--text-secondary)]" data-i18n="cart_tax">Tax</span>'
    'Total</span>' = '<span class="font-800" data-i18n="cart_total">Total</span>'
    'placeholder="Promo code"' = 'placeholder="Promo code" data-i18n="cart_ph_promo"'
    'Apply</button>' = '<span data-i18n="cart_btn_apply">Apply</span></button>'
    '<h3 class="font-bold mb-3 text-sm">Payment Method</h3>' = '<h3 class="font-bold mb-3 text-sm" data-i18n="cart_payment_method">Payment Method</h3>'
    'Credit Card</span>' = '<span class="text-sm font-medium" data-i18n="cart_method_card">Credit Card</span>'
    'PayPal</span>' = '<span class="text-sm font-medium" data-i18n="cart_method_paypal">PayPal</span>'
    'Crypto</span>' = '<span class="text-sm font-medium" data-i18n="cart_method_crypto">Crypto</span>'
    'Checkout</button>' = '<span data-i18n="cart_btn_checkout">Checkout</span></button>'
    'Secured with SSL encryption' = '<span data-i18n="cart_secured">Secured with SSL encryption</span>'
}
foreach ($key in $replacements.Keys) { $content = $content -replace $key, $replacements[$key] }
Set-Content cart.html $content -Encoding UTF8

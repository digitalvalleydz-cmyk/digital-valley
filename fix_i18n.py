import os

def fix_file(filename, replacements):
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        for k, v in replacements.items():
            content = content.replace(k, v)
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {filename}")
    except Exception as e:
        print(f"Error fixing {filename}: {e}")

# dashboard.html fixes
fix_file('dashboard.html', {
    '<title>Dashboard': '<title data-i18n="nav_dashboard">Dashboard',
    'Welcome back, Anna!': '<span data-i18n="dash_welcome">Welcome back, Anna! 👋</span>',
    'Withdraw Earnings': '<span data-i18n="dash_withdraw">Withdraw Earnings</span>',
    'View Analytics': '<span data-i18n="dash_view_analytics">View Analytics</span>',
    'Settings</button>': '<span data-i18n="dash_settings">Settings</span></button>'
})

# sell.html fixes (title only, buttons already done or failed)
fix_file('sell.html', {
    '<title>Sell': '<title data-i18n="nav_sell">Sell',
})

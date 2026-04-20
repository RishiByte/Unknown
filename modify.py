import re

with open('index.html', 'r') as f:
    content = f.read()

# 1. Update overall styles for dark mode
content = content.replace('background-color: #f5f1e8;', 'background-color: #151515;')
content = content.replace('color: #1a1a1a;', 'color: #f5f1e8;')
content = content.replace('background: white;', 'background: #2a2a2a;')
content = re.sub(r'bg-\[\#fbf9f6\]', 'bg-[#151515]', content)
content = content.replace('text-charcoal', 'text-white')
content = content.replace('bg-white', 'bg-charcoal-light')
content = content.replace('bg-gray-50', 'bg-[#222]')
content = content.replace('border-gray-100', 'border-gray-700')
content = content.replace('border-gray-200', 'border-gray-700')
content = content.replace('border-gray-300', 'border-gray-600')
content = content.replace('text-gray-700', 'text-gray-300')
content = content.replace('text-gray-600', 'text-gray-400')
content = content.replace('text-gray-500', 'text-gray-400')
content = content.replace('bg-cream', 'bg-[#333]')

with open('index_dark.html', 'w') as f:
    f.write(content)

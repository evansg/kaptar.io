
target_file = r'c:/Users/carlos/kaptar.io/assets/images/Logotipo-Kaptar-Base-blanca.svg'

with open(target_file, 'r') as f:
    content = f.read()

# Replace ViewBox
old_viewbox = 'width="9449.000000pt" height="9449.000000pt" viewBox="0 0 9449.000000 9449.000000"'
new_viewbox = 'width="7626.000000pt" height="3107.000000pt" viewBox="1087 2213 7627 3108"'

if old_viewbox in content:
    content = content.replace(old_viewbox, new_viewbox)
    print("Fixed ViewBox")
else:
    print("ViewBox string not found exactly, trying partial match or manual check advised.")

# Replace Fill
# The original file has fill="#000000"
old_fill = 'fill="#000000"'
new_fill = 'fill="#0D9488"'

if old_fill in content:
    content = content.replace(old_fill, new_fill)
    print("Fixed Fill Color")
else:
    print("Fill string not found")

with open(target_file, 'w') as f:
    f.write(content)

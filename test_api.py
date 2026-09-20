import requests
import json

url = 'https://apollo-seven-sage.vercel.app/api/analyze'
files = [
    ('images', ('b.jpeg', open('g:/projects/sih/b.jpeg', 'rb'), 'image/jpeg')),
    ('images', ('f.jpeg', open('g:/projects/sih/f.jpeg', 'rb'), 'image/jpeg'))
]

response = requests.post(url, files=files)
with open('g:/projects/sih/output.json', 'w', encoding='utf-8') as f:
    f.write(response.text)

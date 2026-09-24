import os
import subprocess
import shutil

# Paths
base_dir = os.path.dirname(os.path.abspath(__file__))
html_path = os.path.join(base_dir, 'docs', 'fase7_relatorio.html')
pdf_docs_path = os.path.join(base_dir, 'docs', 'Fase_7_Mensageria_IA.pdf')
pdf_desktop_path = os.path.expanduser(r'~\Desktop\Fase_7_Mensageria_IA.pdf')

# Setup Edge Headless
msedge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(msedge_path):
    msedge_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

# Execute
html_uri = f'file:///{html_path.replace(chr(92), "/")}'
cmd = [
    msedge_path,
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    f'--print-to-pdf={pdf_docs_path}',
    html_uri
]

print("Gerando PDF via Edge Headless...")
subprocess.run(cmd, check=True)

# Copy to Desktop
shutil.copy2(pdf_docs_path, pdf_desktop_path)
print(f"PDF gerado com sucesso!")
print(f"-> {pdf_docs_path}")
print(f"-> {pdf_desktop_path}")

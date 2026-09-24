import http.server
import socketserver
import subprocess
import threading
import time
import os
import shutil

PORT = 8081
DIRECTORY = r"C:\Users\marcos.teixeira\.gemini\antigravity\scratch\estudo_arquitetura_sistemas_pycoder\docs"
HTML_FILE = "fase6_relatorio.html"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

httpd = socketserver.TCPServer(("", PORT), Handler)

def serve():
    httpd.serve_forever()

thread = threading.Thread(target=serve)
thread.daemon = True
thread.start()

time.sleep(1) # wait for server to start

pdf_path_docs = os.path.join(DIRECTORY, "Fase_6_Core_Web_e_Persistencia.pdf")
pdf_path_desktop = os.path.join(os.path.expanduser("~"), "Desktop", "Fase_6_Core_Web_e_Persistencia.pdf")

# Standard paths for Edge on Windows
edge_paths = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"
]

msedge_path = None
for p in edge_paths:
    if os.path.exists(p):
        msedge_path = p
        break

if not msedge_path:
    print("ERRO: Microsoft Edge não encontrado.")
    os._exit(1)

url = f"http://localhost:{PORT}/{HTML_FILE}"
print(f"Gerando PDF de {url}...")

subprocess.run([
    msedge_path,
    "--headless",
    "--disable-gpu",
    "--run-all-compositor-stages-before-draw",
    f"--print-to-pdf={pdf_path_docs}",
    url
], check=True)

httpd.shutdown()

shutil.copy2(pdf_path_docs, pdf_path_desktop)
print("PDF gerado com sucesso!")
print(f"-> {pdf_path_docs}")
print(f"-> {pdf_path_desktop}")

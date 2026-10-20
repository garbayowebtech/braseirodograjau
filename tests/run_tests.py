import sys, os, json, re
from pathlib import Path
if sys.platform == "win32":
    try: sys.stdout.reconfigure(encoding="utf-8", errors="replace"); sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception: pass
ROOT_DIR = Path(__file__).resolve().parent.parent
passed_tests, failed_tests = 0, 0
def test_pass(d): global passed_tests; passed_tests += 1; print(f"  ✅ PASSED: {d}")
def test_fail(d, e=None): global failed_tests; failed_tests += 1; print(f"  ❌ FAILED: {d}"); (print(f"     └── {e}") if e else None)

print("\n⚡ 1. Validação de Arquivos JavaScript (js/)")
js_dir = ROOT_DIR / "js"
for jf in js_dir.glob("*.js"):
    try:
        lines = jf.read_text(encoding="utf-8").split('\n')
        test_pass(f"Sintaxe JS íntegra: js/{jf.name} ({len(lines)} linhas)")
    except Exception as e: test_fail(f"Erro em js/{jf.name}", e)

print("\n⚡ 2. Validação de Arquivos JSON")
for jt in [ROOT_DIR / "package.json", ROOT_DIR / "site.webmanifest"]:
    try:
        json.load(open(jt, encoding="utf-8"))
        test_pass(f"JSON válido: {jt.name}")
    except Exception as e: test_fail(f"Erro em {jt.name}", e)

print("\n⚡ 3. Integridade de Recursos e Links de Mídia")
html = (ROOT_DIR / "index.html").read_text(encoding="utf-8")
missing = 0
for ref in re.findall(r'(?:src|href)=["\']((?:assets|css|js)/[^"\']+)["\']', html):
    clean = ref.split("?")[0].split("#")[0]
    if not (ROOT_DIR / clean).exists():
        test_fail(f"Recurso ausente em index.html: {clean}"); missing += 1
if missing == 0: test_pass("Todos os recursos referenciados em index.html existem no disco")

print("\n⚡ 4. Validação de Headers de Segurança (_headers)")
h = (ROOT_DIR / "_headers").read_text(encoding="utf-8")
for hdr in ["X-Frame-Options", "X-Content-Type-Options", "Referrer-Policy"]:
    (test_pass(f"Header {hdr} configurado") if hdr in h else test_fail(f"Header {hdr} ausente"))

print("\n⚡ 5. Validação de Diretrizes IA (.agents/ & AGENTS.md)")
for af in [ROOT_DIR / "AGENTS.md", ROOT_DIR / ".agents/rules/git-workflow.md", ROOT_DIR / ".agents/rules/workflow.md", ROOT_DIR / ".agents/rules/checklist_arquivos.md", ROOT_DIR / "llms.txt"]:
    (test_pass(f"Diretriz presente: {af.relative_to(ROOT_DIR)}") if af.exists() and af.stat().st_size > 50 else test_fail(f"Ausente: {af.name}"))

print(f"\n{'═'*60}\n📊 RESUMO (braseiro_do_grajau): ✅ Aprovados: {passed_tests} | ❌ Falhas: {failed_tests}\n{'═'*60}\n")
sys.exit(1 if failed_tests > 0 else 0)

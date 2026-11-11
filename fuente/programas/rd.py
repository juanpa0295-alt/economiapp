import glob,docx,re,sys
def it(d):
    for el in d.element.body.iter():
        if el.tag.endswith('}p'):
            x="".join(n.text or "" for n in el.iter() if n.tag.endswith('}t'))
            if x.strip(): yield x.strip()
for f in sorted(glob.glob("plan/*/*/*.docx")):
    if sys.argv[1] not in f: continue
    L=list(dict.fromkeys(it(docx.Document(f))));print(" | ".join(L))

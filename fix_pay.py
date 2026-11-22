p='tests/integration/payments.spec.ts'
s=open(p,encoding='utf-8').read()
s=s.replace(".post('/payments')\n      .send(", ".post('/payments')\n      .set(auth())\n      .send(")
open(p,'w',encoding='utf-8').write(s)
print('done')
"
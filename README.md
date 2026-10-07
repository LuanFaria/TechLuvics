# TechLuvics — Site institucional

Site estático responsivo da **TechLuvics**, pronto para hospedar no **GitHub Pages**.

## Estrutura

```
techluvics-site/
├── index.html
├── css/styles.css
├── js/script.js
├── assets/          ← coloque GIFs/vídeos aqui depois
└── README.md
```

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub (ex.: `techluvics` ou `seu-usuario.github.io`).
2. Envie a pasta `techluvics-site` (ou só o conteúdo dela) para a branch `main`.
3. Em **Settings → Pages**:
   - Source: Deploy from a branch
   - Branch: `main` / root (ou `/docs` se preferir)
4. Aguarde 1–2 minutos. O site ficará em:
   - `https://seu-usuario.github.io/techluvics/`  
   - ou `https://seu-usuario.github.io/` se o repo for `seu-usuario.github.io`

## Personalizações futuras

- **Logo**: substitua o texto `.logo` no HTML por uma `<img>`.
- **Vídeos dos 3 produtos principais**:  
  Em cada `.media-placeholder`, troque pelo código:
  ```html
  <video autoplay muted loop playsinline>
    <source src="assets/demo-sites.mp4" type="video/mp4">
  </video>
  ```
  ou use um GIF: `<img src="assets/demo-crediluvics.gif" alt="Demo CrediLuvics">`
- **Slogan / textos**: edite direto no `index.html`.
- **Números de WhatsApp**: já estão configurados nos links `wa.me`.

## Cores e design

Paleta tecnológica escura com acentos em ciano, esmeralda e violeta.  
Cards e botões têm hover suave (elevação + brilho).  
100% responsivo (mobile-first).

---

Feito para a TechLuvics · 2026

# Web Scraper Automático com Puppeteer

Este é um projeto de web scraping desenvolvido em **Node.js** utilizando **Puppeteer** e **pdfkit**. O script realiza buscas automáticas na web, coleta informações sobre um tema específico fornecido pelo usuário e gera relatórios detalhados em **PDF** com os resultados coletados (títulos, links e descrições).

## Funcionalidades

- **Busca automatizada:** Realiza pesquisas na web com base em um tema fornecido.
- **Geração de Relatórios em PDF:** Gera um relatório em PDF com os títulos, links e descrições dos resultados encontrados.
- **Suporte a idioma:** Prioriza resultados em português, mas aceita outros idiomas como alternativa.
- **Simulação de navegador real:** Usa cabeçalhos e `user-agent` para evitar bloqueios.
- **Configuração personalizável:** Permite ajustar o tempo de espera e o comportamento do navegador.

## Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Puppeteer](https://pptr.dev/)
- [pdfkit](https://github.com/foliojs/pdfkit)
- [fs-extra](https://github.com/jprichardson/node-fs-extra)

## Requisitos

- Node.js (v14 ou superior)
- NPM ou Yarn

## Instalação

1. Clone este repositório:
   ```bash
   git clone https://github.com/Midress-ui/web-scraper.git
   ```

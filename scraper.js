const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const PDFDocument = require('pdfkit');
const path = require('path');

async function scrapeData(topic) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Configura idioma e simula um navegador real
    await page.setExtraHTTPHeaders({
        'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
    });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    console.log(`Buscando informações sobre: ${topic}...`);

    const query = topic.replace(/\s+/g, '+');
    try {
        // Aumenta o timeout para 60 segundos
        await page.goto(`https://www.bing.com/search?q=${query}`, {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        // Coleta os dados
        const results = await page.evaluate(() => {
            const items = [];
            document.querySelectorAll('li.b_algo').forEach(result => {
                const title = result.querySelector('h2 a')?.innerText;
                const link = result.querySelector('h2 a')?.href;
                const snippet = result.querySelector('.b_caption p')?.innerText;

                if (title && link) {
                    items.push({ title, link, snippet });
                }
            });
            return items;
        });

        // Gerar relatório PDF
        const pdfFileName = path.join(__dirname, `report_${topic.replace(/\s+/g, '_')}.pdf`);
        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(pdfFileName));

        // Título do relatório
        doc.fontSize(18).text(`Relatório de Pesquisa: ${topic}`, { align: 'center' });
        doc.moveDown();

        // Adiciona os resultados ao PDF
        results.forEach((item, index) => {
            doc.fontSize(12).text(`${index + 1}. ${item.title}`, { bold: true });
            doc.fontSize(10).text(item.link);
            doc.fontSize(10).text(item.snippet || 'Sem descrição disponível.');
            doc.moveDown();
        });

        // Finaliza o documento PDF
        doc.end();

        console.log(`Relatório gerado: ${pdfFileName}`);
        console.log(`Dados coletados com sucesso: ${results.length} resultados.`);

        await browser.close();
        return results;
    } catch (error) {
        console.error(`Erro ao navegar para o Bing: ${error.message}`);
        await browser.close();
    }
}

// Uso do script
(async () => {
    const topic = process.argv[2];
    if (!topic) {
        console.error('Por favor, forneça um tema para pesquisar.');
        process.exit(1);
    }

    try {
        const data = await scrapeData(topic);
        if (data) {
            console.log(`Foram encontrados ${data.length} resultados para "${topic}".`);
        }
    } catch (error) {
        console.error('Erro durante o scraping:', error);
    }
})();

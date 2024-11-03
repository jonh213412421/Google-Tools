function onOpen() {
  DocumentApp.getUi()
      .createMenu('Script')
      .addItem('Run', 'verificarfuncs')
      .addToUi();
}

function verificarfuncs() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const Prompt = body.getParagraphs()[0].getText();
  const comando = Prompt.trim().split(' ')[0];
  const args = Prompt.trim().split(' ').slice(1);


  if (comando === "-h") {
    body.appendParagraph(' ')
    body.appendParagraph('Comandos disponíveis:\nmath -> avalia uma expressão digitada\nurl -> retorna o html da url digitada\ndownload -> faz o download do arquivo para o drive e retorna com o link')
  }

  //comando limpar -> limpa inputs
  if (comando === "limpar") {
    // Adiciona uma nova linha com "olá"
    body.clear();
  }
  

  // comando math -> resolve equações
  if (comando === "math") {
    const resultado = eval(args.join(' '));
    body.appendParagraph(' ');
    body.appendParagraph("resultado: " + resultado);
  }


  //comando "url" -> para navegar
  if (comando === "url") {
    //extrai página
    const url = args.join(' ');
    //acessa página e retorna texto
    const resposta = UrlFetchApp.fetch(url);
    const conteudo = resposta.getContentText();
    const blob = resposta.getBlob();
    const file = DriveApp.createFile(blob);
    const fileUrl = file.getUrl();
    body.appendParagraph('link para versão simplificada da página:');
    body.appendParagraph(' ');
    body.appendParagraph(fileUrl);
    body.appendParagraph(' ');
    body.appendParagraph(conteudo);
        // Usando Cheerio para fazer parsing do HTML
    const links = [];
    const regex = /<a\s+(?:[^>]*?\s+)?href="http:([^"]*)"/g; // Captura conteúdo de <td>
    let match;

    while ((match = regex.exec(conteudo)) !== null) {
      // Procura por links dentro do conteúdo do <td>
      links.push(match[1]); // Adiciona o link à lista
      }

    // Adiciona todos os links encontrados ao documento
    links.forEach(link => {
      body.appendParagraph(link);
    });
  }


  // Comando "download" - > para baixar arquivos
  if (comando === "download") {
  const url = args.join(' ');

  try {
    // Faz o download do conteúdo
    const resposta = UrlFetchApp.fetch(url);
    const blob = resposta.getBlob(); // Obtém o conteúdo como Blob

    // Armazena o arquivo temporariamente no Google Drive
    const file = DriveApp.createFile(blob);
    const fileId = file.getId();
    const fileUrl = file.getUrl();
    body.appendParagraph(' ')
    body.appendParagraph("link: " + fileUrl);

  } catch (e) {
    Logger.log('Erro ao buscar URL: ' + e.message);
    body.appendParagraph('Erro ao buscar URL: ' + e.message);
  }
  }

//converte para hexadecimal. Usar depois??
function toHex(bytes) {
  return Array.from(new Uint8Array(bytes))
    .map(byte => ('0' + (byte & 0xFF).toString(16)).slice(-2))
    .join('');
}
}

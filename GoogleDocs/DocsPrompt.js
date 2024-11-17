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


  // envia comandos de ajuda
  if (comando === "-h") {
    body.appendParagraph(' ')
    body.appendParagraph('Comandos disponíveis:\n\nmath (expressão) -> avalia uma expressão digitada\n\nurl (link) -> retorna o html da url digitada\n\ndownload (link) -> faz o download do arquivo para o drive e retorna com o link\n\ntamanho (link) - retorna o tamanho do arquivo\n\ndownload_p (link) (início) (fim) - baixa os bytes de início a fim\n\ndownloadt (link) - baixa o arquivo e codifica em base64\n\nconverter_msg (url do arquivo) - converte arquivo .txt de base64 para string\n\nconverter (url do arquivo) (extensão) - converte arquivo de base64 para a extensão desejada\n\njuntar (id arquivo 1) (id arquivo 2) (extensão) - junta partes de arquivos que estão no drive.\n')
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


  //comando "url" -> navega para a página desejada
  if (comando === "url") {
    //extrai página
    const url = args.join(' ');
    //acessa página e retorna texto
    const resposta = UrlFetchApp.fetch(url);
    const conteudo = resposta.getContentText();
    const file = DriveApp.createFile("pagina.html", conteudo);
    body.appendParagraph('link para versão simplificada da página:');
    body.appendParagraph(' ');
    body.appendParagraph(file.getUrl());
    body.appendParagraph(' ');
    body.appendParagraph(conteudo);
  }


  // Comando "tamanho" - > pega tamanho do arquivo (url)
  if (comando === "tamanho") {
  url = args.join(' ');

  try {
    const options = {
      method: "GET",
      headers: {
        Range: "bytes=0-0",
      },
    };
    const resposta = UrlFetchApp.fetch(url, options);
    const size = resposta.getHeaders()['Content-Range'].slice(10);
    body.appendParagraph("tamanho do arquivo: " + size + " bytes");   
  } catch (e) {
    Logger.log('Erro: ' + e.message);
  }
  }


  // Comando "download" - > para baixar arquivos inteiros -> limite: 10mb
  if (comando === "download") {
  const url = args.join(' ');

  try {
    // Faz o download do conteúdo
    const resposta = UrlFetchApp.fetch(url);
    const blob = resposta.getBlob(); // Obtém o conteúdo como Blob
    // Armazena o arquivo temporariamente no Google Drive
    const file = DriveApp.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT);
    const fileUrl = file.getUrl();
    body.appendParagraph(' ')
    body.appendParagraph("link: " + fileUrl);
  } catch (e) {
    Logger.log('Erro ao buscar URL: ' + e.message);
    body.appendParagraph('Erro ao buscar URL: ' + e.message);
  }
  }


  // Comando "download" - > para baixar partes de arquivos
  if (comando === "download_p") {
  let argumentos = args.join(' ');
  const url = argumentos.split(' ')[0];
  inicio = parseInt(argumentos.split(' ')[1]);
  fim = parseInt(argumentos.split(' ')[2]);
  const ext =  argumentos.split(' ')[3];
  body.appendParagraph(inicio);
  body.appendParagraph(fim);

  try {
    // Faz uma requisição HTTP para obter a parte desejada
    const headers = { 'Range': 'bytes=' + inicio + '-' + fim }; // Baixar do byte 0 até 2MB (primeiros 3MB)
    const options = { 'headers': headers };
    // Faz o fetch do arquivo com os cabeçalhos de Range
    const resposta = UrlFetchApp.fetch(url, options);
    size = resposta.getHeaders()['Content-Length'];
    body.appendParagraph("tamanho do arquivo: " + size);   
    // Verifica se a resposta foi bem-sucedida (código HTTP 206 para parcial)
    const blob = resposta.getBlob(); // Obter o conteúdo do arquivo
    const file = DriveApp.createFile(blob); // Salva no Google Drive
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); // Torna o arquivo acessível
  } catch (e) {
    Logger.log('Erro: ' + e.message);
  }
  }


  if (comando === "juntar") {
  let argumentos = args.join(' ');
  const arquivo_1_id = argumentos.split(' ')[0];
  const arquivo_2_id = argumentos.split(' ')[1];
  const ext = argumentos.split(' ')[2];
  // Pega os arquivos do drive
  let file1 = DriveApp.getFileById(arquivo_1_id).getBlob().getBytes();
  let file2 = DriveApp.getFileById(arquivo_2_id).getBlob().getBytes();
  // Cria um novo array com espaço para armazenar os dois arquivos
  let combinedBytes = new Uint8Array(file1.length + file2.length);
  // Copia os bytes para os arquvios
  combinedBytes.set(new Uint8Array(file1), 0);
  combinedBytes.set(new Uint8Array(file2), file1.length);
  let combinedBlob = Utilities.newBlob(combinedBytes, 'application/octet-stream', "juntado." + ext);
  // Salva o arquivo com nome de juntado. + extensão
  let arquivo_final = DriveApp.createFile(combinedBlob);
  body.appendParagraph('link para o arquivo: ' + arquivo_final.getUrl());
  }


  //converte para texto -> decodifica de base64 para texto
  if (comando === "converter_msg") {
  const url = args.join(' ').toString();
  const doc = DocumentApp.openByUrl(url);
  const texto = doc.getBody().getText();
  const texto_decoded = Utilities.base64Decode(texto);
  let texto_final = '';
  for (i = 0; i<texto_decoded.length; i++) {
    texto_final += String.fromCharCode(texto_decoded[i]);
  }
  file = DriveApp.createFile("msg_convertida.txt", texto_final, MimeType.PLAIN_TEXT);
  body.appendParagraph('Arquivo convertido');
  body.appendParagraph(file.getUrl());
  }


  //converte de base64 para a extensão desejada
  if (comando === "converter") {
  const argumentos = args.join(' ').toString();
  const url = argumentos.split(' ')[0];
  const ext = argumentos.split(' ')[1];
  const doc = DocumentApp.openByUrl(url);
  const texto = doc.getBody().getText();
  const texto_decoded = Utilities.base64Decode(texto);
  file = DriveApp.createFile("converted." + ext, texto_decoded);
  body.appendParagraph('Arquivo convertido');
  body.appendParagraph(file.getUrl());
  }
}

// cria opção de "run" no documento
function onOpen() {
  DocumentApp.getUi()
      .createMenu('Script')
      .addItem('Limpar', 'limpar')
      .addItem('Ajuda', 'ajuda')
      .addItem('Calcular', 'math')
      .addItem('Get URL', 'url')
      .addItem('Calcular tamanho', 'tamanho')
      .addItem('Converter Mensagem', 'converter_mgs')
      .addItem('Converter', 'converter')
      .addItem('Download Arquivo Longo', 'download_longo')
      .addItem('Download Arquivo Curto', 'download_curto')
      .addItem('Limpar cache de download', 'comecar_novo_download')
      .addItem('Debug', 'debug')
      .addToUi();
}

function debug() {
  var propriedades = PropertiesService.getScriptProperties();
  let aux = propriedades.getProperty('pointer');
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  body.appendParagraph("ponteiro: " + aux);
}

function comecar_novo_download() {
  const chunk = 10000000; //bytes
  var propriedades = PropertiesService.getScriptProperties();
  propriedades.setProperty('pointer', 0);
  let inicio_num_var = 0;
  let fim_num_var = chunk;
  propriedades.setProperty('inicio', inicio_num_var);
  propriedades.setProperty('fim', fim_num_var);
}

function download_longo() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  //pega prompt
  const url = body.getParagraphs()[0].getText();
  //variáveis
  const chunk = 10000000;
  var propriedades = PropertiesService.getScriptProperties();

  //pega tamanho do arquivo e coloca em size
    const options = {
      method: "GET",
      headers: {
        Range: "bytes=0-0",
      },
    };
  const resposta = UrlFetchApp.fetch(url, options);
  const tamanho = resposta.getHeaders()['Content-Range'].slice(10);
  propriedades.setProperty('size', tamanho);
  let size_aux = parseInt(propriedades.getProperty('size'));

  //calcula número de partes e armazena em num_parts
  const num_partes = propriedades.getProperty('size') / chunk;
  propriedades.setProperty('num_parts', num_partes);

  //chama dw
  download_partes(url)

  function download_partes(url) {
  //debug
  //Logger.log(size.getProperty('size'));
  //Logger.log(size.getProperty('inicio'));
  //Logger.log(size.getProperty('fim'));

  //baixa parte
  let num_parts_aux = Math.ceil(propriedades.getProperty('num_parts'));
  body.appendParagraph("partes: " + num_parts_aux);
  let aux = parseInt(propriedades.getProperty('pointer'));
  for (aux; aux < num_parts_aux; propriedades.setProperty('pointer', aux++)) {
    propriedades.setProperty('pointer', aux);
    body.appendParagraph("i: " + aux);
    //Logger.log("ponteiro: " + propriedades.getProperty('pointer'));
    let inicio_num_var = chunk * aux;
    let fim_num_var = chunk * (aux + 1);
    propriedades.setProperty('inicio', inicio_num_var);
    propriedades.setProperty('fim', fim_num_var);
    body.appendParagraph("inicio_num_var: " + inicio_num_var);
    body.appendParagraph("fim_num_var: " + fim_num_var);

    //adiciona 1 ao bit das partes que serão baixadas subsequentemente
    if (inicio_num_var > 0) {
      inicio_num_var += 1;
    }

    //ajusta parte final
    if (fim_num_var > size_aux) {
      let dif = fim_num_var - size_aux;
      fim_num_var = fim_num_var - dif;
      body.appendParagraph("Download concluído.")
      body.appendParagraph("fim_num_var com ajuste: " + fim_num_var);
    }
    const headers = { 'Range': 'bytes=' + inicio_num_var + '-' + fim_num_var};
    //Logger.log(headers);
    const options2 = { 'headers': headers };
    resposta2 = UrlFetchApp.fetch(url, options2);
    const blob = resposta2.getBlob();
    const file = DriveApp.createFile(blob).setName(aux);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT);
    //Logger.log(blob.length);

    //reseta variáveis ao final do download
    if (num_parts_aux - 1 == aux) {
      comecar_novo_download()
      body.appendParagraph("pointeiro final (tem que ser igual a 0): " + propriedades.getProperty('pointer'));
      body.appendParagraph("Download concluído com sucesso");
      }
    
    //imprime id das partes
    propriedades.setProperty(aux, file.getId());
    body.appendParagraph("ID's das partes: ");
    for (i = 0; i < num_parts_aux; i ++) {
      body.appendParagraph(propriedades.getProperty(i));
      }
    }
  }
}

// baixa o arquivo inteiro de uma vez
function download_curto() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const url = body.getParagraphs()[0].getText();
  let nome_arquivo = url.split('/');
  let nome_lenght = nome_arquivo.length;
  nome_arquivo = nome_arquivo[nome_lenght - 1];
  body.appendParagraph(nome_arquivo);
  let resposta = UrlFetchApp.fetch(url);
  let blob = resposta.getBlob();
  file = DriveApp.createFile(blob).setName(nome_arquivo);
}

// envia comandos de ajuda
function ajuda() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  body.appendParagraph(' ');
  body.appendParagraph('Comandos disponíveis:\n\nmath (expressão) -> avalia uma expressão digitada\n\nurl (link) -> retorna o html da url digitada\n\ndownload (link) -> faz o download do arquivo para o drive e retorna com o link\n\ntamanho (link) - retorna o tamanho do arquivo\ndownloadt (link) - baixa o arquivo e codifica em base64\n\nconverter_msg (url do arquivo) - converte arquivo .txt de base64 para string\n\nconverter (url do arquivo) (extensão) - converte arquivo de base64 para a extensão desejada\n\njuntar (id arquivo 1) (id arquivo 2) (extensão) - junta partes de arquivos que estão no drive.\ncopy /b (0.pdf + 1.pdf + 2.pdf...) (arquivo out) - junta partes em um novo pdf');
  }

//comando limpar -> limpa documento
function limpar() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  body.clear();
}

function math() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();  
  const resultado = eval(body.getParagraphs()[0].getText());
  body.appendParagraph(' ');
  body.appendParagraph("resultado: " + resultado);
}

// Comando "tamanho" - > pega tamanho do arquivo (url) CASO NÃO DÊ CERTO, INSISTA
function url() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const url = body.getParagraphs()[0].getText();
  let resposta = UrlFetchApp.fetch(url);
  let conteudo = resposta.getContentText();
  const file = DriveApp.createFile("pagina.html", conteudo);
  body.appendParagraph("código de resposta: " + resposta.getResponseCode());
  body.appendParagraph(' ');
  body.appendParagraph('link para versão simplificada da página:');
  body.appendParagraph(' ');
  body.appendParagraph(file.getUrl());
  body.appendParagraph(' ');
  body.appendParagraph(' ');
  body.appendParagraph(conteudo);
}

// Comando "tamanho" - > pega tamanho do arquivo (url) CASO NÃO DÊ CERTO, INSISTA
function tamanho() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const url = body.getParagraphs()[0].getText();
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
    body.appendParagraph('Erro: ' + e.message.text);
  }
}

// junta partes de arquivos baixados
function juntar() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const Prompt = body.getParagraphs()[0].getText();
  const args = Prompt.trim().split(' ').slice(1);
  let aux = [];
  let totalBytes = 0;
  const ext = args[args.length -1];
  const nome_arquivo = args[args.length -2];
  body.appendParagraph(ext);
  // Pega os arquivos do drive -> último argumento é a extensão
  for (let i = 0; i < args.length - 2; i++) {
    let file = DriveApp.getFileById(args[i]).getBlob();
    aux.push(file.getBytes());
    totalBytes += file.getBytes().length;
  }
  // Cria um array Uint8Array grande o suficiente para armazenar todos os bytes dos arquivos
  let combinedBytes = new Uint8Array(totalBytes);
  let offset = 0;
    // Preenche o array com os bytes dos arquivos
  for (let i = 0; i < aux.length; i++) {
    combinedBytes.set(new Uint8Array(aux[i]), offset);
    offset += aux[i].length;
  }
  // Cria um novo blob com o conteúdo combinado e adiciona a extensão
  let combinedBlob = Utilities.newBlob(combinedBytes, 'application/octet-stream', nome_arquivo + '.' + ext);
  // Cria o arquivo final no Google Drive
  let arquivoFinal = DriveApp.createFile(combinedBlob);
  // Exibe o link para o arquivo
  body.appendParagraph('Sucesso!');
  body.appendParagraph('Link para o arquivo: ' + arquivoFinal.getUrl());
}

//converte para texto -> decodifica de base64 para texto
function converter_mgs() {  
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const Prompt = body.getParagraphs()[0].getText();
  const args = Prompt.trim().split(' ').slice(1);
  const url = args.join(' ').toString();
  const doc2 = DocumentApp.openByUrl(url);
  const texto = doc2.getBody().getText();
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
function converter() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const Prompt = body.getParagraphs()[0].getText();
  const args = Prompt.trim().split(' ').slice(1);
  const argumentos = args.join(' ').toString();
  const url = argumentos.split(' ')[0];
  const ext = argumentos.split(' ')[1];
  const doc2 = DocumentApp.openByUrl(url);
  const texto = doc2.getBody().getText();
  const texto_decoded = Utilities.base64Decode(texto);
  file = DriveApp.createFile("converted." + ext, texto_decoded);
  body.appendParagraph('Arquivo convertido');
  body.appendParagraph(file.getUrl());
}

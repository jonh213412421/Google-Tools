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
      .addItem('Downloads Ativos', 'downloads_ativos')
      .addItem('Limpar cache de download', 'comecar_novo_download')
      .addItem('Debug', 'debug')
      .addToUi();
}

function storeVector() {
    var propriedades = PropertiesService.getScriptProperties();
    var myArray = [];  // Example vector (array)
    myArray.push("oi");
    // Convert the array to a JSON string
    var jsonString = JSON.stringify(myArray);

    // Store the array as a property
    propriedades.setProperty('myArrayKey', jsonString);
    vetor = propriedades.getProperty('myArrayKey');
    vetor0 = JSON.parse(vetor)[0]
    console.log(vetor0);
}

function storeVector2() {
  var propriedades = PropertiesService.getScriptProperties();
  if (propriedades.getProperty('download_num') == null) {
    propriedades.setProperty('download_num', 0);
  }
  console.log(propriedades.getProperty('download_num'));
}

function teste() {
  var propriedades = PropertiesService.getScriptProperties();
  const metadados = ["https://www.python.org/ftp/python/3.12.8/Python-3.12.8.tgz", 213123, 21, 3, "https://www.python.org/ftp/python/3.12.8/Python-4.12.8.tgz"]
  propriedades.setProperty("downloads", JSON.stringify(metadados));
  console.log("valores no vetor: " + propriedades.getProperty("downloads"));
}

//[d0][size, num_partes inicio, fim, pointer]
// retorna propriedades
function debug() {
  var propriedades = PropertiesService.getScriptProperties();
  let aux = propriedades.getProperty('pointer');
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  body.appendParagraph("ponteiro: " + aux);
}

function downloads_ativos() {
  var propriedades = PropertiesService.getScriptProperties();
  let aux = propriedades.getProperty('downloads');
  aux = JSON.parse(aux);
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  body.appendParagraph("downloads ativos:\n");
  for (let i = 0; i < aux.length; i++)
    body.appendParagraph(aux[i]);
}

function limpar_cache() {
  let propriedades = PropertiesService.getScriptProperties();
  propriedades.deleteProperty('downloads');
}

// zera propriedades
//valores a serem armazenados: [url, tamanho, numero de partes, parte atual]
function download_longo() {
  //tamanho do chunk
  const chunk = 15000000;
  //vetor que armazena metadados da download
  let arquivo = "https://www.python.org/ftp/python/3.12.8/Python-4.12.8.tgz" // será a url
  let metadados = [];
  //metadados.push(arquivo); //retirar depois
  let propriedades = PropertiesService.getScriptProperties();
  //IF-ELSE -> se já tiver arquivos na pilha, pegue-os. Caso contrário, carregue apenas a url solicitada

  if (propriedades.getProperty('downloads') == null) {
    metadados.push(arquivo);
    console.log("na propriedade downloads: " + propriedades.getProperty('downloads'));
  } else {
    let aux = JSON.parse(propriedades.getProperty('downloads'));
    console.log(aux);
    //verifica se valor é único
    let j = 0;
    let k = 0;
    //pega todos os itens da pilha e coloca no vetor metadados. Isso é feito para poder acrescentar uma nova url no topo, eventualmente
    for (let i = 0; i < aux.length; i ++) {
      console.log("aux no loop de identificação: " + aux[i]);
      if (aux[i] == arquivo) {
        //pega índice do arquivo
        j += 1;
        k = i;
        console.log("j: " + j);
        console.log("k: " + k);
        console.log("aux no loop de identificação: " + aux[i]);
      }
      metadados.push(aux[i]);
      console.log("pushed: " + aux[i]);
    }
    
    //se já está na pilha. Continua o download
    if (j > 0) {
      console.log("metadados_download_salvo: " + JSON.stringify(metadados));
      console.log("nome_download_salvo: " + metadados[k]);
      let tamanho = metadados[k + 1];
      console.log("tamanho_download_salvo: " + tamanho);
      let num_partes = metadados[k + 2];
      console.log("num_partes_download_salvo: " + num_partes);
      let parte_atual = metadados[k + 3];
      console.log("parte atual_download_salvo: " + num_partes);
      //PAREI AQUI
    } else {
    //download novo
    metadados.push(arquivo);
    const opcoes = {
      method: "GET",
      headers: {
        Range: "bytes=0-0",
      },
    };
    const resposta_tamanho = UrlFetchApp.fetch(arquivo, opcoes);
    tamanho = resposta_tamanho.getHeaders()['Content-Range'].slice(10);
    console.log("tamanho_download_novo: " + tamanho);
    //aqui colocou o tamanho no vetor
    metadados.push(tamanho);
    let num_partes = tamanho / chunk;
    num_partes = Math.ceil(num_partes);
    console.log("num_partes: " + num_partes);
    metadados.push(num_partes);
    let index_parte_atual = j + 3;
    metadados.push(0);
    console.log("metadados: " + JSON.stringify(metadados));
    console.log("parte atual: " + metadados[index_parte_atual]);
    propriedades.setProperty("downloads", JSON.stringify(metadados));
    console.log("downloads - propriedade: " + propriedades.getProperty("downloads"));
    let i = 0;
    for(i; i < num_partes; i++) {
      let inicio;
      let final = i * chunk + chunk;
      if (i == 0) {
        inicio = i * chunk;
      }
      if (i > 0) {
        inicio = i * chunk + 1;
      }
      if (i == num_partes - 1) {
        let aux = i * chunk;
        aux = aux - tamanho;
        final = i * chunk - aux;
        console.log("última parte ajustada: " + final);
      }
      const headers = { 'Range': 'bytes=' + inicio + '-' + final};
      const opcoes = { 'headers': headers };
      let resposta = UrlFetchApp.fetch(arquivo, opcoes);
      let blob = resposta.getBlob();
      DriveApp.createFile(blob).setName(arquivo + "_parte_" + i);
      metadados[index_parte_atual] = i;
      propriedades.setProperty("downloads", JSON.stringify(metadados));
      console.log("inicio_loop: " + inicio);
      console.log("fim_loop: " + final);
      console.log("metadados_loop: " + JSON.stringify(metadados));
      console.log("downloads_loop: " + propriedades.getProperty("downloads"));
    }
    metadados.pop();
    metadados.pop();
    metadados.pop();
    metadados.pop();
    propriedades.setProperty("downloads", JSON.stringify(metadados));
    console.log("downloads depois do pop: " + propriedades.getProperty("downloads"));
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
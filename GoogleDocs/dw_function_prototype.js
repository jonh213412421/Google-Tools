function comecar_novo_download() {
  const chunk = 10000000;
  var pointer = PropertiesService.getScriptProperties();
  pointer.setProperty('pointer', 0);
  let inicio_num_var = 0;
  let fim_num_var = chunk;
  var inicio = PropertiesService.getScriptProperties();
  var fim = PropertiesService.getScriptProperties();
  inicio.setProperty('inicio', inicio_num_var);
  fim.setProperty('fim', fim_num_var);
}

function download() {
    //variáveis
  const doc = DocumentApp.getActiveDocument();
  const chunk = 10000000;
  var size = PropertiesService.getScriptProperties();
  var inicio = PropertiesService.getScriptProperties();
  var fim = PropertiesService.getScriptProperties();
  var num_parts = PropertiesService.getScriptProperties();
  var pointer = PropertiesService.getScriptProperties();

  //get prompt from text body
  const body = doc.getBody();
  const Prompt = body.getParagraphs()[0].getText();
  const comando = Prompt.trim().split(' ')[0];
  const args = Prompt.trim().split(' ').slice(1);
  let argumentos = args.join(' ');
  const url = argumentos.split(' ')[0];

  //pega tamanho do arquivo e coloca em size
    const options = {
      method: "GET",
      headers: {
        Range: "bytes=0-0",
      },
    };
  const resposta = UrlFetchApp.fetch(url, options);
  const tamanho = resposta.getHeaders()['Content-Range'].slice(10);
  size.setProperty('size', tamanho);
  let size_aux = parseInt(size.getProperty('size'));

  //calcula número de partes e armazena em num_parts
  const num_partes = size.getProperty('size') / chunk;
  num_parts.setProperty('num_parts', num_partes);

  //chama dw
  dw(url)

  function dw(url) {
  //debug
  //Logger.log(size.getProperty('size'));
  //Logger.log(size.getProperty('inicio'));
  //Logger.log(size.getProperty('fim'));

  //baixa parte
  let num_parts_aux = Math.ceil(num_parts.getProperty('num_parts'));
  body.appendParagraph("partes: " + num_parts_aux);
  let aux = parseInt(pointer.getProperty('pointer'));
  for (aux; aux < num_parts_aux; pointer.setProperty('pointer', aux++)) {
    pointer.setProperty('pointer', aux);
    body.appendParagraph("i: " + aux);
    //Logger.log("ponteiro: " + pointer.getProperty('pointer'));
    let inicio_num_var = chunk * aux;
    let fim_num_var = chunk * (aux + 1);
    inicio.setProperty('inicio', inicio_num_var);
    inicio.setProperty('fim', fim_num_var);
    body.appendParagraph("inicio_num_var: " + inicio_num_var);
    body.appendParagraph("fim_num_var: " + fim_num_var);

    //adiciona 1 ao bit das partes que serão baixadas subsequentemente
    if (inicio_num_var > 0) {
      inicio_num_var += 1;
    }
    if (fim_num_var > size_aux) {
      let dif = fim_num_var - size_aux;
      fim_num_var = fim_num_var - dif;
      body.appendParagraph("ok")
      body.appendParagraph("fim_num_var com ajuste: " + fim_num_var);
    }
    const headers = { 'Range': 'bytes=' + inicio_num_var + '-' + fim_num_var};
    Logger.log(headers);
    const options2 = { 'headers': headers };
    resposta2 = UrlFetchApp.fetch(url, options2);
    const blob = resposta2.getBlob();
    const file = DriveApp.createFile(blob).setName(aux);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT);
    Logger.log(blob.length);
  }
  }
}

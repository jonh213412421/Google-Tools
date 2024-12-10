  function dw() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  var size = PropertiesService.getScriptProperties();
  var inicio = PropertiesService.getScriptProperties();
  var fim = PropertiesService.getScriptProperties();
    const options = {
      method: "GET",
      headers: {
        Range: "bytes=0-0",
      },
    };
  const url = "https://www.python.org/ftp/python/3.12.8/Python-3.12.8.tar.xz".trim();
  const resposta = UrlFetchApp.fetch(url, options);
  const tamanho = resposta.getHeaders()['Content-Range'].slice(10);
  body.appendParagraph(tamanho);
  size.setProperty('size', tamanho);
  inicio.setProperty('inicio', 0);
  fim.setProperty('fim', 20000);
  Logger.log(size.getProperty('size'));
  Logger.log(size.getProperty('inicio'));
  Logger.log(size.getProperty('fim'));
  const headers = { 'Range': 'bytes=' + inicio + '-' + fim }; 
  const options2 = { 'headers': headers };
  resposta2 = UrlFetchApp.fetch(url, options2);
  const blob = resposta2.getBlob().getBytes();
  Logger.log(blob.length);
  }

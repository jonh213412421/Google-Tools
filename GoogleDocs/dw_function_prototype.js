  function dw() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const chunk = 20000; //BITS
  var size = PropertiesService.getScriptProperties();
  var inicio = PropertiesService.getScriptProperties();
  var fim = PropertiesService.getScriptProperties();
  var num_parts = PropertiesService.getScriptProperties();
  var test = PropertiesService.getScriptProperties();
  test.setProperty('test', 1);
    const options = {
      method: "GET",
      headers: {
        Range: "bytes=0-0",
      },
    };
  const url = "https://www.python.org/ftp/python/3.12.8/Python-3.12.8.tar.xz".trim();
  const resposta = UrlFetchApp.fetch(url, options);
  const tamanho = resposta.getHeaders()['Content-Range'].slice(10);
  size.setProperty('size', tamanho);
  const num_partes = size.getProperty('size') / chunk;
  num_parts.setProperty('num_parts', num_partes);
  inicio.setProperty('inicio', 0);
  fim.setProperty('fim', 20000);
  Logger.log(size.getProperty('size'));
  Logger.log(size.getProperty('inicio'));
  Logger.log(size.getProperty('fim'));
  const headers = { 'Range': 'bytes=' + inicio + '-' + fim }; // Baixar do byte 0 até 2MB (primeiros 3MB)
  const options2 = { 'headers': headers };
  resposta2 = UrlFetchApp.fetch(url, options2);
  const blob = resposta2.getBlob().getBytes();
  Logger.log(blob.length);
  Logger.log(Math.ceil(num_parts.getProperty('num_parts')));
  let temp = test.getProperty('test');
  var i = 0;
  while (i < num_parts.getProperty('num_parts')) {
    i += 1;
    temp += i;
    test.setProperty('test', temp);
    Logger.log(test.getProperty('test'));
  }
  }

  function test() {
    var num_parts = PropertiesService.getScriptProperties();
    Logger.log(Math.ceil(num_parts.getProperty('num_parts')));
  }

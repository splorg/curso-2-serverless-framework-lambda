const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { cadastrarAlunosNoBd } = require("../cadastrarAlunosNoBd");
const { converteDadosCsv } = require("../converteDadosCsv");

const obtemDadosDoCsvDoBucket = async (nome, chave) => {
  const cliente = new S3Client({})

  const comando = new GetObjectCommand({
    Bucket: nome,
    Key: chave
  })

  const resposta = await cliente.send(comando)

  const dadosCsv = await resposta.Body.transformToString('utf-8')

  return dadosCsv
}

module.exports.cadastrarAlunos = async (event) => {
  try {
    const eventoS3 = event.Records[0].s3
    const nomeBucket = eventoS3.bucket.name
    const chaveBucket = decodeURIComponent(eventoS3.object.key.replace(/\+/g, ' '))
    const dadosArquivo = await obtemDadosDoCsvDoBucket(nomeBucket, chaveBucket)
    const alunos = await converteDadosCsv(dadosArquivo)
  
    await cadastrarAlunosNoBd(alunos)

    console.log('Cadastro dos alunos realizado com sucesso.')
  } catch (erro) {
    console.log(erro)
  }
};
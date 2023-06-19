const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3")
const { readFile } = require("fs/promises")
const { join } = require('path')

const criaClienteS3Local = () => {
  return new S3Client({
    forcePathStyle: true,
    credentials: {
      accessKeyId: "S3RVER",
      secretAccessKey: "S3RVER"
    },
    endpoint: "http://localhost:4569"
  })
}

const fazUploadNoBucket = async () => {
  const cliente = criaClienteS3Local()

  const nomeArquivo = 'cadastrar_alunos.csv'
  const caminho = join(__dirname, nomeArquivo)
  const dadosCsv = await readFile(caminho, 'utf-8')

  const comandoUpload = new PutObjectCommand({
    Bucket: "alunos-csv-local",
    Key: nomeArquivo,
    Body: dadosCsv
  })

  await cliente.send(comandoUpload)
}

const obtemDadosDoCsvDoBucket = async (nome, chave) => {
  const cliente = criaClienteS3Local()

  const comando = new GetObjectCommand({
    Bucket: nome,
    Key: chave
  })

  const resposta = await cliente.send(comando)

  const dadosCsv = await resposta.Body.transformToString('utf-8')

  return dadosCsv
}

module.exports = {
  fazUploadNoBucket,
  obtemDadosDoCsvDoBucket
}
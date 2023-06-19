const { parse } = require('fast-csv')

const converteDadosCsv = async (dados) => {
  const resultado = await new Promise((resolve, reject) => {
    const alunos = []
  
    const stream = parse({ headers: ['nome', 'email'], renameHeaders: true })
      .on('data', (aluno) => alunos.push(aluno))
      .on('error', (erro) => reject(new Error('Houve um erro no processamento do arquivo CSV.')))
      .on('end', () => resolve(alunos))
  
    stream.write(dados)
    stream.end()
  })

  if (resultado instanceof Error) throw resultado
  
  return resultado
}

module.exports = {
  converteDadosCsv
}
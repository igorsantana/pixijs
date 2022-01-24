# Gaming Test - Javascript

## Observações

- O arquivo principal é o arquivo `src/index.js`
- [Este](https://github.com/proudcat/pixi-webpack-demo) repositório foi usado como boilerplate para este repositório, para acelerar o processo de desenvolvimento com o webpack.
- Para implementar o tipo de firework `Fountain`, foi usada a biblioteca `@pixi/particle-emitter`.
- O código foi testado tanto no Chrome, quanto no Firefox.
- No `package.json`, foram definidos alguns scripts, dentre os mais importantes:
  - `npm run start`: Executa o código com livereload, para desenvolvimento.
  - `npm run execute`: Executa o `npm install` e o script `npm run start`
  - `npm run build`: Faz o build do projeto, e adiciona o código na pasta `dist/`

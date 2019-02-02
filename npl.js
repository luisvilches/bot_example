const { NlpManager, NlpClassifier } = require('node-nlp');
const intents = require('./train');

const manager = new NlpManager({ languages: ['es'] });

intents.map(e => {
    manager.addDocument(e.lang, e.input, e.intent);
    manager.addAnswer(e.lang, e.intent, e.output); 
});

const classifier = new NlpClassifier({ language: 'es' });
classifier.add('Hola', 'saludar');
classifier.add('Hola como estas', 'saludar');
classifier.add('Que tal', 'saludar');
classifier.add("chao", 'claves');
classifier.add('sabes que', 'claves');
classifier.add('te quiero', 'claves');

async function clasi(){
    await classifier.train();
    const classifications = classifier.classify('que tal');
    console.log(classifications)
}

module.exports = clasi;

// // intenciones del cliente
// manager.addDocument('es', 'goodbye for now', 'greetings.bye');
// manager.addDocument('es', 'bye bye take care', 'greetings.bye');
// manager.addDocument('es', 'okay see you later', 'greetings.bye');
// manager.addDocument('es', 'bye for now', 'greetings.bye');
// manager.addDocument('es', 'i must go', 'greetings.bye');
// manager.addDocument('es', 'hello', 'greetings.hello');
// manager.addDocument('es', 'hi', 'greetings.hello');
// manager.addDocument('es', 'howdy', 'greetings.hello');
// manager.addDocument('es', 'hola', 'greetings.hello');
 
// // Train also the NLG

// // entrenamiento de posibles respuestas
// manager.addAnswer('es', 'greetings.bye', 'Till next time');
// manager.addAnswer('es', 'greetings.bye', 'see you soon!');
// manager.addAnswer('es', 'greetings.hello', 'Hey there!');
// manager.addAnswer('es', 'greetings.hello', 'hola que tal!');
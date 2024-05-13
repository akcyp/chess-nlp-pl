import { EventEmitter } from "../EventEmitter/EventEmitter";

// Polyfills
globalThis.SpeechRecognition ??= webkitSpeechRecognition;
globalThis.SpeechGrammarList ??= webkitSpeechGrammarList;
globalThis.SpeechRecognitionEvent ??= webkitSpeechRecognitionEvent;

export interface SpeechResult {
  transcript: string;
  confidence: number;
}

export class SpeechCtrl extends EventEmitter {
  private recognition = new SpeechRecognition();
  private speechRecognitionList = new SpeechGrammarList();
  private listening = false;

  constructor() {
    super();
    this.recognition.grammars = this.speechRecognitionList;
    this.recognition.lang = 'pl-PL';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
  }

  stop() {
    if (this.listening) {
      this.recognition.stop();
      this.listening = false;
    }
  }
  
  start() {
    if (this.listening) {
      return;
    }
    this.listening = true;
    this.recognition.start();
    this.recognition.onresult = (event) => {
      console.log('result', event);
      const { transcript, confidence } = event.results[0][0];
      this.emit('speech', { transcript: transcript.toLowerCase(), confidence });
    };

    this.recognition.onspeechend = (event) => {
      this.recognition.stop();
      console.log('speechend', event);
    };
  
    this.recognition.onerror = (event) => {
      console.log('error', event);
    };
    
    this.recognition.onaudiostart = (event) => {
      // Fired when the user agent has started to capture audio.
      console.log('onaudiostart', event);
    };
    
    this.recognition.onaudioend = (event) => {
      // Fired when the user agent has finished capturing audio.
      console.log('onaudioend', event);
    };
    
    this.recognition.onend = (event) => {
      // Fired when the speech recognition service has disconnected.
      console.log('onend', event);
    };
    
    this.recognition.onnomatch = (event) => {
      // Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
      console.log('onnomatch', event);
    };
    
    this.recognition.onsoundstart = (event) => {
      // Fired when any sound — recognisable speech or not — has been detected.
      console.log('onsoundstart', event);
    };
    
    this.recognition.onsoundend = (event) => {
      // Fired when any sound — recognisable speech or not — has stopped being detected.
      console.log('onsoundend', event);
    };
    
    this.recognition.onspeechstart = (event) => {
      // Fired when sound that is recognised by the speech recognition service as speech has been detected.
      console.log('onspeechstart', event);
    };

    this.recognition.onstart = (event) => {
      // Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
      console.log('onstart', event);
    };
  }
};

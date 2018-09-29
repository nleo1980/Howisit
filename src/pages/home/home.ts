import { QuestionMap, OptionMap } from './../../interfaces';
import { QuestionProvider } from './../../providers/question/question';
import { Option } from '../../interfaces';
import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { SpeechRecognition } from '@ionic-native/speech-recognition';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  public commands: string[] = ["change", "udpate", "submit", "OK", "right",'ok'];
  public options: Option[] = [];
  public Q1Opts: Option[] = [];
  public Q2Opts: Option[] = [];
  public answers: number[] = [];
  public sumbmited = false;
  public questionMaps: QuestionMap[] = [
    { questionNo: 1, questionText: 'one' },
    { questionNo: 1, questionText: 'question one' },
    { questionNo: 1, questionText: 'question 1' },
    { questionNo: 1, questionText: 'first' },
    { questionNo: 2, questionText: 'two' },
    { questionNo: 2, questionText: 'question two' },
    { questionNo: 2, questionText: 'question 2' },
    { questionNo: 2, questionText: 'second' },
    { questionNo: 2, questionText: 'to' },
    { questionNo: 2, questionText: 'too' }
  ];

  public optionMaps: OptionMap[] = [
    { optionNo: 1, optionText: 'not happy at all' },
    { optionNo: 2, optionText: 'not so happy' },
    { optionNo: 3, optionText: 'neutral' },
    { optionNo: 4, optionText: 'happy' },
    { optionNo: 5, optionText: 'very happy' },
    { optionNo: 1, optionText: 'one' },
    { optionNo: 2, optionText: 'two' },
    { optionNo: 3, optionText: 'three' },
    { optionNo: 4, optionText: 'four' },
    { optionNo: 5, optionText: 'five' },
    { optionNo: 1, optionText: 'first' },
    { optionNo: 2, optionText: 'second' },
    { optionNo: 3, optionText: 'third' },
    { optionNo: 4, optionText: 'forth' },
    { optionNo: 5, optionText: 'fifth' },
    { optionNo: 2, optionText: 'to' },
    { optionNo: 2, optionText: 'too' }
  ];

  constructor(public navCtrl: NavController,
    private speechRecognition: SpeechRecognition,
    private questionProvider: QuestionProvider,
    private toastCtrl: ToastController) { }

  ngOnInit() {

    this.loadOptions();

    // Get permission in initialization
    this.speechRecognition.hasPermission()
      .then(
        permitted => {
          if (!permitted) {
            this.speechRecognition.requestPermission()
              .then(
                () => console.log("Granted"),
                () => console.log("Dennied")
              );
          }
        }
      );
  }

  loadOptions() {
    this.questionProvider.getOptions()
      .subscribe(
        (options) => {

          this.options = options;
          // console.log(this.options);
          this.Q1Opts = options.filter(option => option.questionNo == 1);
          // consokle.log(this.Q1Opts);
          this.Q2Opts = options.filter(option => option.questionNo == 2);
        }
      );
  }

  ionViewDidEnter() {

    // while (!this.sumbmited) {

    //   this.answerQuestion();
    // }
  }

  answerQuestion(): void {

    this.speechRecognition.startListening()
      .subscribe(
        (marches: Array<string>) => {
          //To do process string
          console.log(marches);
          if (this.isCommand(marches[0])) {
            this.processCommand(marches[0]);
          } else {
            this.getAnswer(marches[0]);
          }
        },
        onerror => console.log(onerror)
      );

  }

  // Check if the text is a command
  isCommand(text: string) {

    console.log("isCommand: " + text);

    const reg = new RegExp(this.commands.join("|"));

    console.log(reg);
    console.log(text.match(reg));
    if (text.match(reg))
      return true;

    return false;
  }

  submmitData() {

    console.log("In submit!");

    if (this.answers[1] >= 1 && this.answers[1] <= 5 && this.answers[2] >= 1 && this.answers[2] <= 5) {
      // To do submit data

      let toast = this.toastCtrl.create({
        message: 'Answers have been submitted',
        duration: 2000,
        position: 'middle'
      });

      this.answers = [];
      // this.sumbmited = true;
      toast.present();
    }
    else {
      // Can not submit
      let toast = this.toastCtrl.create({
        message: 'Please answer both 2 questions',
        duration: 1000,
        position: 'middle'
      });
      toast.present();
    }
  }

  // Process commands texts
  processCommand(text: string) {

    const command = text.split(' ')[0];
    switch (command) {

      case 'update':
      case 'change': {
        this.answerQuestion();
        break;
      }

      case 'fine':
      case 'OK':
      case 'submit': {
        // Commit answers
        this.submmitData();
        break;
      }
      default: {
        // Do nothing
        break;
      }
    }
  }

  // Get answer of a question
  getAnswer(text: string) {

    console.log("Get answer :" + text);

    const words = text.split(' ');
    let questionText: string;
    let optionText: string;
    let questionNo: number;
    let optionNo: number;

    switch (words[0]) {

      case 'first':
      case 'two':
      case '1':
      case '2':
      case 'to':
      case 'too':
      case 'second':
      case 'one': {

        questionText = words[0].toString();
        words.shift();
        optionText = words.join(' ');
        break;
      }
      case 'question': {

        questionText = words.slice(0, 2).join(' ');
        optionText = words.slice(2).join(' ');
        break;
      }
    }

    console.log("Question Text: " + questionText);
    console.log("Option Text:" + optionText);

    questionNo = this.getQuestionNo(questionText);
    optionNo = this.getOptionNo(optionText);

    console.log("Question number: " + questionNo);
    console.log("Option number:" + optionNo);


    if (questionNo >= 1 && questionNo <= 2 && optionNo >= 1 && optionNo <= 5) {
      this.answers[questionNo] = optionNo;
    } else {

      let toast = this.toastCtrl.create({
        message: 'Sorry I can not understand you!',
        duration: 1000,
        position: 'middle'
      });
      toast.present();
    }
  }

  // Get question number
  getQuestionNo(text: string): number {


    if (!text)
      return -1;
    console.log("Get question No: " + text);
    // console.log();
    let question = this.questionMaps.find(questionMap => questionMap.questionText == text.trim());


    if (question) {
      return question.questionNo;
    } else {
      // Can not find a questionNo accordingly
      return -1;
    }

  }

  // Get the answer option
  getOptionNo(text: string): number {

    if (!text)
      return -1;

    let option = this.optionMaps.find(option => option.optionText == text);

    if (option) {
      return option.optionNo;
    } else {
      // Can not find a option accordingly
      return -1;
    }
  }

}



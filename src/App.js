import React from 'react';
import {compareTwoStrings} from "string-similarity";



class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      question : '',
      answer : '',
      input : '',
      result : '',
      questionId : 0,
      nextQ : false,
      numberedRight : 0,
      lives : 3
    };

    this.handleChange = this.handleChange.bind(this);
    this.checkAnswer = this.checkAnswer.bind(this);
    this.fetchAPI = this.fetchAPI.bind(this);
    this.handleNextQ = this.handleNextQ.bind(this);
    this.handleLost = this.handleLost.bind(this);
  }

  
  fetchAPI(){
    fetch("https://opentdb.com/api.php?amount=1")
      .then(res => res.json())
      .then(data => {

        //API Has some weird answer inputs so I am cleaning it here
        data = data.results[0]
        let ans = data.correct_answer.split(/(<i>|<\/i>)/)
        try{
          if(ans.length === 5){
            ans = ans[2]
          }
          else {
            ans = ans[0]
          }
        }
        catch {
          console.log('Error on answer splitting')
        }

        ans = ans.split(/((|))/).join('');
        this.setState({
          question : data.question,
          answer : ans
        })
        console.log(this.state.answer);
        console.log(data[0]);
      }
        );

        document.getElementById('submit').style.display = 'block';
        document.getElementById('nextQ').style.display = 'none';
        document.getElementById('show-ans').style.display = 'none';
    
    }
  
  handleChange(event) {
    this.setState({input: event.target.value});
  }
  
  
  checkAnswer(){
    document.getElementById('show-hint').style.display = 'none';
    let similar = compareTwoStrings(this.state.answer.toLowerCase(),this.state.input.toLowerCase());
    console.log(similar);
    if(similar > .85){
      let numRight = this.state.numberedRight;
      this.setState({
        result : 'RIGHT',
        numberedRight : numRight+1
      });
    }
    
    else{
      let livesNew = this.state.lives - 1;
      this.setState({result : 'WRONG', lives : livesNew});
      document.getElementById('show-ans').style.display = 'inline';
      document.getElementById('submit').style.display = 'none';
      document.getElementById('nextQ').style.display = 'block';
    }
    
    this.setState({input : ''});
  }
  
  handleLost(){
    document.getElementById('blurred').style.display = 'flex';
  }
  
  componentDidMount(){
    this.fetchAPI();
    document.getElementById('show-ans').style.display = 'none'; 
  }
  
  componentDidUpdate(){
    if(this.state.lives <= 0){
      this.handleLost();
    }
  }
  
  handleNextQ(){
    this.fetchAPI()
    document.getElementById('results').style.display = 'none';
  }
  
  render(){
    return (
      <div className="App">
        <div id='blurred'>
          <div id="lost-pop-up">
            <div className='high-score'>You got <strong>{this.state.numberedRight}</strong> question(s) right!</div>
            <div onClick={() => {
               document.getElementById('blurred').style.display = 'none';
               this.setState({numberedRight: 0, lives: 3});
               this.handleNextQ();
            }} className='button'>Restart</div>
          </div>
         </div>
        <h1 className="animate__animated animate__fadeInDownBig" id="heading">Random Trivia</h1>
        <Lives lives={this.state.lives}/>
        <span id='question'>{this.state.question}</span>
        <Hint answer={this.state.answer} />
        <span id="numbered-right"><strong>{this.state.numberedRight}</strong> Right</span>
        <input onChange={this.handleChange} value={this.state.input} id="answer-input"></input>   
        <div className='button'  onClick={this.checkAnswer} id='submit'>Check Answer</div>
        <div className='button' onClick={this.handleNextQ} id='nextQ'>Next Question</div>
        <span id="results"> {this.state.result}</span>
        <span id="show-ans">The correct answer was <br></br> <strong>{this.state.answer}</strong></span>
      </div>
      );
    }
}

//Hints Component
function showHint(){
  document.getElementById('show-hint').style.display = 'inline';
}

function Hint(props){
  let hint = props.answer.substring(0,Math.floor(props.answer.length / 2));

  return(
    <div id="hint-box">
      <div className='button'  onClick={showHint} id="hint-button">Hint</div>
      <span id="show-hint">{hint}...</span>
    </div>
  );
}

//Lives
function Lives(props){
  return(
    <span id="lives-left">Lives <strong>{props.lives}</strong></span>
  );
}

export default App;

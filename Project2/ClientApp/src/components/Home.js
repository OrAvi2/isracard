import React, { Component } from 'react';

export class Home extends Component {
  static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = {
           
            historyLog: [], result: "", currentEditIndex: -1, disabledButton:false,validationMessage:""
        };

        this.number1Input = React.createRef();
        this.number2Input = React.createRef();      
        this.operationInput = React.createRef();    
        this.resultElement = React.createRef();           

        this.calculat = this.calculat.bind(this);
        this.deleteFromHistory = this.deleteFromHistory.bind(this);
        this.editHistory = this.editHistory.bind(this);

        if (localStorage.getItem('historyLog')) {
            this.state.historyLog= JSON.parse(localStorage.getItem('historyLog'));
        }
            
    }

    validate() {
        let number1 = this.number1Input.current.value;
        let number2 = this.number2Input.current.value;
        let operation = this.operationInput.current.value;

        if (number1 === "" || number2 === "") {
            this.setState({ validationMessage: "inputs fields are mandtory or values are incorrect" });
            return false;
        }

        let parsedNumbe2 = parseFloat(number2);

        if (operation == "Division" && parsedNumbe2 ===0) {
            this.setState({ validationMessage: "cant divide by zero" });
            return false;
        }

        this.setState({ validationMessage: "" });
        return true;
    }


    async calculat() {

        if(!this.validate())
            return;

        // disable to prevent fast clicks that cause duplicate index
        this.setState({ disabledButton: true }); 
        
        let number1 = this.number1Input.current.value;
        let number2 = this.number2Input.current.value;
        let operation = this.operationInput.current.value;
        let operationText = this.operationInput.current.selectedOptions[0].outerText;
        let nextIndex = this.state.historyLog.length + 1;


        const response = await (fetch(`calculator?operation=${operation}&number1=${number1}&number2=${number2}`).catch(err => { console.log(err);}));

        const data = await response.json();

        if (this.state.currentEditIndex === -1) {//add to the top
            this.state.historyLog.unshift({ index: nextIndex, number1: number1, number2: number2, operationChar: operationText, operation: operation, result: data });
        }
        else
        { //edit history item
            let innerIndex = this.state.historyLog.findIndex(h => h.index === this.state.currentEditIndex);
            let currentEditIndex = this.state.currentEditIndex;

            let item = this.state.historyLog.filter(function (item) {
                return item.index === currentEditIndex
            })   

            item[0].number1 = number1;
            item[0].number2 = number2;
            item[0].operationChar = operationText;
            item[0].operation = operation;
            item[0].result = data;

            this.state.historyLog[innerIndex] = item[0];

            this.state.currentEditIndex = -1;
        }

        localStorage.setItem('historyLog', JSON.stringify(this.state.historyLog));

        this.setState({ result: data, disabledButton: false }); 
      
    }

    deleteFromHistory(index) {

        let arr = this.state.historyLog.filter(function (item) {
            return item.index !== index
        })
         
        for (let i = 0; i < arr.length; i++)
            arr[i].index = i;

        this.setState({ historyLog: arr, currentEditIndex: -1 }); 
        localStorage.setItem('historyLog', JSON.stringify(arr));
 
    }

    editHistory(index) {
         

        let item = this.state.historyLog.filter(function (item) {
            return item.index === index
        })    

        this.number1Input.current.value = item[0].number1;
        this.number2Input.current.value = item[0].number2;
        this.operationInput.current.value = item[0].operation;
        this.resultElement.current.innerText = item[0].result;
         
        this.setState({  currentEditIndex: index }); 
    }

    static renderHistoryTable(historyLog,obj) {
 
        return (
            <div>
                <h2>calculator history</h2>
                <table className='table table-striped' aria-labelledby="tabelLabel">
                    <tbody>
                        {
                            historyLog.map(h =>
                            <tr key={h.index}>
                                <td>{h.number1} {h.operationChar} {h.number2} = {h.result} </td>
                                    <td align="center"><div onClick={  () => obj.deleteFromHistory(h.index)    } >delete from history</div></td>
                                    <td align="center" ><div onClick={() => obj.editHistory(h.index)}    >edit calculation</div></td>
                            </tr>
                        )}
                    </tbody>
                </table>
             </div>
        );
    }

    render() {

        let contents = this.state.historyLog.length===0?"":Home.renderHistoryTable(this.state.historyLog,this);
        let result = this.state.result;

    return (
      <div>
            <div className="calculatorwrapper" >
                <input type="number" ref={this.number1Input} />
                <select  ref={this.operationInput} >
                    <option value="Addition" >+</option>
                    <option value="Subtraction"  >-</option>
                    <option value="Multiplication"  >*</option>
                    <option value="Division"  >/</option>
                 </select>
                <input type="number" ref={this.number2Input}  />
                <button onClick={this.calculat} disabled={this.state.disabledButton} >=</button>
                <div className="result" ref={this.resultElement}  >{result}</div>
                <div  className="errormessage">{this.state.validationMessage}</div>
            </div>

            <div className="calculatorhistorywrapper" >
                {contents}
            </div>
      </div>
   
    );
    }

 

}

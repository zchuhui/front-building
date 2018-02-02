
import React,{Component} from "react"
import ReactDOM from 'react-dom'

class Demo extends Component{
  render(){
    return(
      <div>
        {
          this.props.test
        }
      </div>
    )
  }
}

ReactDOM.render(
  <Demo test="this is react demo." />,
  document.querySelector('.container')
)

import React,{Component} from "react"
import ReactDOM from 'react-dom'
import { f1 } from './util'

import '../styles/base.less'

class Demo extends Component{
  render(){
    f1()
    return(
      <div className="box">
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

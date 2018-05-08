import React from 'react'
import ReactMarkdown from 'react-markdown'
import introMD from './intro.md'
import sendreceiveMD from './send-receive.md'
import beeBoxMD from './beebox.md'
import registerLoginMD from './register-login.md'
import interactionMD from './interaction.md'

const mapping = {
  'introMD':introMD,
  'sendreceiveMD':sendreceiveMD,
  'beeBoxMD':beeBoxMD,
  'registerLoginMD': registerLoginMD,
  'interactionMD': interactionMD,
}


class IntroduceContent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: '',
    }
 


    fetch(mapping[props.tab])
    .then(response => response.text())
    .then(text => {
      // Logs a string of Markdown content.
      // Now you could use e.g. <rexxars/react-markdown> to render it.
      this.setState({
        data: text
      })
     
    });

  }
  render() {
    const { data } = this.state
    return (
      <ReactMarkdown source={data} />
    )
  }
}

export default IntroduceContent
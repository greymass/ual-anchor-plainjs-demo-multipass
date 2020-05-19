// React and UI components for demo
import React, { Component } from 'react'
import { Button, Container, Header, Segment } from 'semantic-ui-react'

// The required ual-reactjs-renderer with ual-anchor, ual-scatter, and ual-ledger
import { Anchor } from 'ual-anchor'
import { Ledger } from 'ual-ledger'
import { Scatter } from 'ual-scatter'
import { UALJs } from 'ual-plainjs-renderer'

// Optional include for custom JsonRpc
import { JsonRpc } from 'eosjs'

// React components for this demo, not required
import { find } from 'lodash'
import blockchains from './assets/blockchains.json'
import Main from './Main'

// Define the app name for UAL
const appName = 'ual-anchor-reactjs-demo-multipass'

class App extends Component {
  // Demo initialization code
  constructor(props) {
    super(props)
    // Add the ability to retrieve the chainId from the URL
    const search = window.location.search
    const params = new URLSearchParams(search)
    const chainId = params.get('chainId') || '0db13ab9b321c37c0ba8481cb4681c2788b622c3abfd1f12f0e5353d44ba6e72'
    // Set initial application state with the default chainId
    this.state = {
      chainId,
    }
  }
  // Establish the authenticators for UAL to use
  getAuthenticators = (chainId) => {
    // Find the blockchain to be used
    const [ chain ] = blockchains.filter((c) => c.chainId === chainId)
    // Optional: Setup a custom JsonRpc adapter
    const [ rpcEndpoint ] = chain.rpcEndpoints
    const rpc = new JsonRpc(`${rpcEndpoint.protocol}://${rpcEndpoint.host}:${rpcEndpoint.port}`)
    // Initialize the Anchor authenticator
    const anchor = new Anchor([chain], {
      // Required: The name of the app requesting a session
      appName,
      // Optional: An instance of JsonRpc for ual-anchor to use
      rpc,
    })
    // Initialize the Ledger authenticator
    const ledger = new Ledger([chain])
    // Initialize the Scatter authenticator
    const scatter = new Scatter([chain], {
      appName
    })
    // Return the authenticators
    return [anchor, ledger, scatter]
  }
  // React State Helper to update chainId while switching blockchains
  setChainId = (e, { value }) => this.setState({
    chainId: value
  })
  render() {
    const {
      chainId,
    } = this.state
    // Find the blockchain information (rpc, name, etc) for UI purposes
    const chain = find(blockchains, { chainId })
    // Retrieve the authenticators for this chain for UAL
    const authenticators = this.getAuthenticators(chainId)

    const activeUser = null
    const callback = () => {
      console.log("callback")
    }
    const containerElement = document.getElementById(appName)
    console.log(containerElement)
    let ual
    if (containerElement) {
      ual = new UALJs(callback, [chain], appName, authenticators, { containerElement })
      ual.init()
    }
    // Return the UI
    return (
      <Main
        appName={appName}
        chain={chain}
        setChainId={this.setChainId}
        key={chain.chainId}
        ual={ual}
      />
    )
  }
}

export default App

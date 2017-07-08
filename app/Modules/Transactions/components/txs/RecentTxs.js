
import React, { Component } from 'react'
import TxCard from './TxCard'
import TxList from './TxList'
import WithEmptyState from 'Elements/WithEmptyState'
import EmptyTransactions from './EmptyTransactions'
import Icon from 'Elements/Icon'

import Styles from './RecentTxs.css'

export default class RecentTxs extends Component {
  constructor (props) {
    super(props)

    this.state = {
      currentTxSearchMatch: null,
      currentTxNumberSearch: '',
      currentTxSearch: '',
      isSearchingForTx: false,
      txSearchMatch: false,
      validTxSearchResult: false
    }
  }

  componentDidMount () {
    if (this.props.params.txhash) {
      this._handleTxSearch(this.props.params.txhash)
    }
  }

  componentWillReceiveProps (nextProps, nextState) {
    if (nextProps.testRpcState.currentTxSearchMatch !== null && nextProps.testRpcState.currentTxSearchMatch !== this.props.testRpcState.currentTxSearchMatch) {
      this.setState({
        currentTxSearchMatch: nextProps.testRpcState.currentTxSearchMatch,
        isSearchingForTx: false,
        txSearchMatch: true,
        validTxSearchResult: nextProps.testRpcState.currentTxSearchMatch && !nextProps.testRpcState.currentTxSearchMatch.hasOwnProperty('error')
      })
    }
  }

  _renderSearchingTx = () => {
    return (
      <section>
        Searching for Transaction {this.state.currentTxNumberSearch}
      </section>
    )
  }

  _renderTxSearchMatch = () => {
    const tx = this.state.currentTxSearchMatch
    return this.state.currentTxSearchMatch && this._renderTransactionCard(tx)
  }

  _renderTransactionCard = (tx) => {
    return (
      <TxCard
        className={Styles.Transaction}
        key={tx.hash}
        tx={tx}
        handleTxSearch={this._handleTxSearch}
      />
    )
  }

  _renderTransactions = () => {
    return this.props.testRpcState.transactions.map(this._renderTransactionCard)
  }

  _handleTxSearch = (value) => {
    console.log(`SEARCHING FOR ${value}`)
    this.setState({isSearchingForTx: true})
    this.props.appSearchTx(value)
  }

  _handleTxSearchChange = (value) => {
    this.setState({currentTxSearch: value})
  }

  _handleClearTxSearch = (e) => {
    e.preventDefault()
    this.setState({txSearchMatch: false, currentTxNumberSearch: '', currentTxSearchMatch: null, validTxSearchResult: false})
  }

  _renderPanelHeaderText = () => {
    if (this.state.validTxSearchResult) {
      return `SHOWING TX ${this.state.currentTxSearchMatch.hash}`
    }

    return `LAST ${this.props.testRpcState.transactions.length} TRANSACTIONS`
  }

  _renderPanelHeaderControls = () => {
    if (this.state.validTxSearchResult) {
      return (
        <a href="#" className={Styles.BackButton} onClick={this._handleClearTxSearch}>&larr; All TXs</a>
      )
    }
  }

  _renderPanelBody = () => {
    if (!this.state.isSearchingForTx && !this.state.txSearchMatch) {
      return (
        <TxList
          transactions={this.props.testRpcState.transactions}
          handleTxSearch={this._handleTxSearch}
        />
      )
    }

    if (this.state.currentTxSearchMatch === null) {
      return this._renderSearchingTx()
    }

    if (this.state.validTxSearchResult) {
      return this._renderTxSearchMatch()
    }

    return this.state.currentTxSearchMatch.error
  }

  render () {
    return (
      <div className={Styles.Transactions}>
        <h4>
          <span><Icon name="transactions" size={24} /> { this._renderPanelHeaderText() }</span>
          { this._renderPanelHeaderControls() }
        </h4>
        <main>
          <WithEmptyState
            test={this.props.testRpcState.transactions.length === 0}
            emptyStateComponent={EmptyTransactions}
          >
            { this._renderPanelBody() }
          </WithEmptyState>
        </main>
        <footer>
        </footer>
      </div>
    )
  }
}

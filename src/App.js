import {Component} from 'react'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'

import './App.css'

class App extends Component {
  state = {
    cartList: [],
  }

  addCartItem = product => {
    const {cartList} = this.state
    let updatedData = []
    let matched = false

    if (cartList.length > 0) {
      updatedData = cartList.map(item => {
        if (product.id === item.id) {
          matched = true
          return {...item, quantity: product.quantity + item.quantity}
        }
        return item
      })
    }

    if (!matched) {
      updatedData = [...cartList, product]
    }

    this.setState({cartList: updatedData})
  }

  deleteCartItem = id => {
    const {cartList} = this.state
    const updatedData = cartList.filter(item => item.id !== id)
    this.setState({cartList: updatedData})
  }

  updateCartItem = product => {
    const {cartList} = this.state

    if (product.quantity === 0) {
      this.deleteCartItem(product.id)
    } else {
      const updatedData = cartList.map(item => {
        if (product.id === item.id) {
          return product
        }
        return item
      })
      this.setState({cartList: updatedData})
    }
  }

  render() {
    const {cartList} = this.state

    return (
      <BrowserRouter>
        <CartContext.Provider
          value={{
            cartList,
            addCartItem: this.addCartItem,
            deleteCartItem: this.deleteCartItem,
            updateCartItem: this.updateCartItem,
          }}
        >
          <Switch>
            <Route exact path="/login" component={LoginForm} />
            <ProtectedRoute exact path="/" component={Home} />
            <ProtectedRoute exact path="/products" component={Products} />
            <ProtectedRoute
              exact
              path="/products/:id"
              component={ProductItemDetails}
            />
            <ProtectedRoute exact path="/cart" component={Cart} />
            <Route path="/not-found" component={NotFound} />
            <Redirect to="not-found" />
          </Switch>
        </CartContext.Provider>
      </BrowserRouter>
    )
  }
}

export default App

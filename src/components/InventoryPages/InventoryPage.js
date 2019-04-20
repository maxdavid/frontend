import React from "react";
import NavBar from "../NavBar";
import InventoryWrapper from "./InventoryWrapper";
import axios from "axios";
import {Route} from "react-router-dom";
import AddInventory from "./AddInventory";
import Item from "../ItemPages/Item";
import ItemEditForm from "../ItemPages/ItemEditForm";

class InventoryPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        items: [],
        filtered_items : [],
        searching: false,
        token: null,
        selected_category: "-1",
      }
    }
    componentDidMount() {
        if (localStorage.getItem("expiry")) {
            if (localStorage.getItem("expiry") < Number(Date.now().toString().slice(0,10))) {
                this.props.handleTokenExpired();
            } else {
                this.setState({token:localStorage.getItem("token")});
            }
        }
        let options = { 
            headers: {
                Authorization: localStorage.getItem("token"),
            }}
        axios
        .get('https://kitchen-soup-backend.herokuapp.com/api/items', options)
        .then(response => 
        {
            this.setState({items: response.data.items})
            localStorage.setItem("expiry", response.data.decodedToken.exp)
        })
        .catch(err => {
            console.log(err);
            alert("Unable to get items from backend. Contact an administrator.")
            localStorage.clear();
        });
    }

    handleAdd = (e, categoryID, showSnackBar) => {
        e.preventDefault();
        let addObj = {
            name : e.target[0].value,
            amount : parseInt(e.target[1].value),
            unit : e.target[2].value,
            price: e.target[3].value,
            supplier_name: e.target[4].value,
            supplier_contact: e.target[5].value,
            image : e.target[6].value,
            categoryID : parseInt(categoryID),
        }
        if (addObj['image'] === '' || undefined) {
          addObj['image'] = 'https://spoonacular.com/cdn/ingredients_500x500/' + addObj['name'].toLowerCase() + '.jpg'
        }
        console.log(addObj)
        let options = { 
            headers: {
                Authorization: localStorage.getItem("token"),
            }}
        axios
        .post('https://kitchen-soup-backend.herokuapp.com/api/items',addObj,options)
        .then(response => {
            let options = { 
                headers: {
                    Authorization: localStorage.getItem("token"),
                }}
            axios
            .get('https://kitchen-soup-backend.herokuapp.com/api/items', options)
            .then(response => 
            {
                this.setState({items: response.data.items})
                showSnackBar();
            })
            .catch(err => {
                console.log(err)
            });
                })
        .catch(err => {
            console.log(err)
        })
        e.target.reset()
    }

    deleteItem = (e, itemID, history) => {
        e.preventDefault();
        let options = { 
            headers: {
                Authorization: localStorage.getItem("token"),
            }}
        axios
        .delete(`https://kitchen-soup-backend.herokuapp.com/api/items/${itemID}`, options)
        .then(response => { 
            axios
            .get('https://kitchen-soup-backend.herokuapp.com/api/items', options)
            .then(response => 
            {
                this.setState({items: response.data.items})
            })
            .catch(err => {
                console.log(err)
            });
            history.push(`/`);
        })
        .catch(err => console.log(err))
    }

    logOut = () => {
        localStorage.clear();
        window.location.reload();
    }

    setStateofInventoryPage = () => {
        let options = { 
            headers: {
                Authorization: localStorage.getItem("token"),
            }}
        axios
        .get('https://kitchen-soup-backend.herokuapp.com/api/items', options)
        .then(response => 
        {
            this.setState({items: response.data.items})
        })
        .catch(err => {
            console.log(err)
        });
    }

    addDefaultSrc = (e) => {
        e.target.src = 'https://i.imgur.com/zpw4lgT.png'
    }

    handleSearch = e => {
        let string = e.target.value;
        let obj = this.state;
        if (string.length > 0) {
          const searched_array = obj.items.filter(item => {
            return item.name.toUpperCase().indexOf(string.toUpperCase()) > -1;
          });
          obj.filtered_items = searched_array;
          obj.searching = true;
          this.setState(obj);
        } else if (string.length === 0) {
          obj.filtered_items = [];
          obj.searching = false;
          this.setState(obj);
        }
      };

    clearSearch = () => {
        this.setState({filtered_items: [], searching:false, selected_category: "-1"});
        let options = { 
            headers: {
                Authorization: localStorage.getItem("token"),
            }}
        axios
        .get('https://kitchen-soup-backend.herokuapp.com/api/items', options)
        .then(response => 
        {
            this.setState({items: response.data.items})
            localStorage.setItem("expiry", response.data.decodedToken.exp)
        })
        .catch(err => {
            console.log(err);
            alert("Unable to get items from backend. Contact an administrator.")
            localStorage.clear();
        });
    }

    handleCategory = (id) => {
        let options = { 
            headers: {
                Authorization: localStorage.getItem("token"),
            }}
        if (id === "-1") {
            axios
            .get('https://kitchen-soup-backend.herokuapp.com/api/items', options)
            .then(response => 
            {
                this.setState({items: response.data.items, selected_category: id})
            })
            .catch(err => {
                console.log(err);
            });
        } else {
            axios
            .get(`https://kitchen-soup-backend.herokuapp.com/api/categories/${id}`, options)
            .then(response => 
            {
                console.log(response)
                this.setState({items: response.data.items, selected_category: id})
            })
            .catch(err => {
                console.log(err);
            });
        }
    }

    render() {
      return (
        <div className="inventory-page">
          <NavBar clearSearch={this.clearSearch} logOut={this.logOut}></NavBar>
          {this.state.searching ? 
          <Route exact path="/" render={(props) => <InventoryWrapper selectedCategory={this.state.selected_category} handleCategory={this.handleCategory} clearSearch={this.clearSearch} handleSearch={this.handleSearch} onError={this.addDefaultSrc} items={this.state.filtered_items} {...props}/>}/> 
          :
          <Route exact path="/" render={(props) => <InventoryWrapper selectedCategory={this.state.selected_category} handleCategory={this.handleCategory} clearSearch={this.clearSearch} handleSearch={this.handleSearch} onError={this.addDefaultSrc} items={this.state.items} {...props}/>}/>}
          
          <Route path="/add" render={(props) => <AddInventory handleAdd={this.handleAdd} {...props}/>}/>
          <Route path="/inventory/:id" render={(props) => <Item handleUpdate={this.setStateofInventoryPage} onError={this.addDefaultSrc} items={this.state.items} updateItem={this.updateItem} deleteItem={this.deleteItem} {...props}/>} />
          <Route path="/inventory/edit" render={(props) => <ItemEditForm handleUpdate={this.setStateofInventoryPage} items={this.state.items} {...props}/>} />
        </div>
      );
    }
  }
  
  export default InventoryPage;
